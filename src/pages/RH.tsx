import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  UserPlus,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useUserRole } from "@/hooks/useUserRole";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { ReportFilterModal, ReportFilters } from "@/components/modals/ReportFilterModal";
import { formatCurrency, exportToCSV } from "@/utils/csvExport";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  position: string;
  department: string;
  salary: number;
  admission_date: string;
  status: string;
  email?: string;
  phone?: string;
}

export function RH() {
  const { canWrite } = useUserRole();
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportFilterOpen, setReportFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const employeesQuery = useSupabaseQuery<Employee>({
    table: 'employees',
    select: '*',
    filters: [{ column: 'is_active', operator: 'eq', value: true }],
    orderBy: { column: 'created_at', ascending: false }
  });

  const departmentsQuery = useSupabaseQuery({
    table: 'departments',
    select: '*',
    orderBy: { column: 'name', ascending: true }
  });

  // Calculate KPIs
  const totalEmployees = employeesQuery.data.length;
  const activeEmployees = employeesQuery.data.filter(e => e.status === 'active').length;
  const onLeave = employeesQuery.data.filter(e => e.status === 'on_vacation' || e.status === 'on_leave').length;
  const totalPayroll = employeesQuery.data.reduce((sum, emp) => sum + (emp.salary || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">Ativo</Badge>;
      case 'on_vacation':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-500/30">Férias</Badge>;
      case 'on_leave':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Afastado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: false })
        .eq('id', selectedEmployee.id);
      if (error) throw error;
      toast.success("Funcionário removido com sucesso!");
      employeesQuery.refetch();
    } catch (error: any) {
      toast.error("Erro ao remover funcionário: " + error.message);
    }
  };

  const handleExportReport = async (filters: ReportFilters) => {
    try {
      let query = supabase.from('employees').select('*');
      
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const csvData = data?.map(emp => ({
        'ID': emp.employee_id,
        'Nome': emp.full_name,
        'Cargo': emp.position,
        'Departamento': emp.department,
        'Salário': emp.salary,
        'Admissão': emp.admission_date,
        'Status': emp.status
      })) || [];
      
      exportToCSV(csvData, `funcionarios-${new Date().toISOString().split('T')[0]}`);
      toast.success("Relatório exportado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao exportar relatório: " + error.message);
    }
  };

  if (employeesQuery.error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Erro ao carregar dados</h3>
        <p className="text-muted-foreground">{employeesQuery.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recursos Humanos</h1>
          <p className="text-muted-foreground">Gestão completa de pessoal da BLDR</p>
        </div>
        {canWrite && (
          <Button 
            className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
            onClick={() => {
              setSelectedEmployee(null);
              setEmployeeModalOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Funcionário
          </Button>
        )}
      </div>

      {/* HR KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Funcionários
            </CardTitle>
            <Users className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            {employeesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{totalEmployees}</div>
            )}
            <p className="text-xs text-muted-foreground">colaboradores registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Ativos
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            {employeesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{activeEmployees}</div>
            )}
            <p className="text-xs text-muted-foreground">em atividade</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Férias/Afastamento
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {employeesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{onLeave}</div>
            )}
            <p className="text-xs text-muted-foreground">temporariamente ausentes</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Folha de Pagamento
            </CardTitle>
            <DollarSign className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            {employeesQuery.loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalPayroll)}</div>
            )}
            <p className="text-xs text-muted-foreground">total mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* HR Tabs */}
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Lista de Funcionários</CardTitle>
              <CardDescription>Gestão completa da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              {employeesQuery.loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : employeesQuery.data.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">Nenhum funcionário encontrado</h3>
                  <p className="text-muted-foreground">Não há funcionários cadastrados ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {employeesQuery.data.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{employee.full_name}</p>
                            <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                          </div>
                          {getStatusBadge(employee.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              ID: {employee.employee_id} • Admissão: {new Date(employee.admission_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <p className="text-lg font-bold text-foreground">{formatCurrency(employee.salary)}</p>
                            {canWrite && (
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setEmployeeModalOpen(true);
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Departamentos</CardTitle>
              <CardDescription>Organização por área</CardDescription>
            </CardHeader>
            <CardContent>
              {departmentsQuery.loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {departmentsQuery.data.map((dept: any) => (
                    <div key={dept.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-foreground">{dept.name}</h3>
                        <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                          {employeesQuery.data.filter(e => e.department === dept.name).length} pessoas
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-foreground mb-2">{formatCurrency(dept.budget || 0)}</p>
                      <p className="text-xs text-muted-foreground">Orçamento mensal</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Relatórios de RH</CardTitle>
              <CardDescription>Gere relatórios de recursos humanos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setReportFilterOpen(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar Relatório de Funcionários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EmployeeModal
        open={employeeModalOpen}
        onOpenChange={setEmployeeModalOpen}
        employee={selectedEmployee}
        onSuccess={() => employeesQuery.refetch()}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Remover Funcionário"
        description="Tem certeza que deseja remover este funcionário? Esta ação irá marcá-lo como inativo."
        itemName={selectedEmployee?.full_name || ""}
        onConfirm={handleDeleteEmployee}
      />

      <ReportFilterModal
        open={reportFilterOpen}
        onOpenChange={setReportFilterOpen}
        reportType="hr"
        onApplyFilters={handleExportReport}
      />
    </div>
  );
}