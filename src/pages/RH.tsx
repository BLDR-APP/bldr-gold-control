import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export function RH() {
  const hrData = {
    totalEmployees: 24,
    activeEmployees: 22,
    onLeave: 2,
    totalPayroll: "R$ 45.280,00"
  };

  const employees = [
    { 
      id: "E001", 
      name: "Ana Costa", 
      position: "Gerente de Vendas",
      department: "Vendas",
      salary: "R$ 4.500,00",
      admissionDate: "2022-03-15",
      status: "Ativo"
    },
    { 
      id: "E002", 
      name: "Pedro Lima", 
      position: "Vendedor",
      department: "Vendas",
      salary: "R$ 2.800,00",
      admissionDate: "2023-01-10",
      status: "Ativo"
    },
    { 
      id: "E003", 
      name: "Carlos Silva", 
      position: "Vendedor",
      department: "Vendas",
      salary: "R$ 2.600,00",
      admissionDate: "2023-06-20",
      status: "Ativo"
    },
    { 
      id: "E004", 
      name: "Maria Santos", 
      position: "Auxiliar Administrativo",
      department: "Administrativo",
      salary: "R$ 1.800,00",
      admissionDate: "2023-09-05",
      status: "Férias"
    },
  ];

  const departments = [
    { name: "Vendas", employees: 8, budget: "R$ 24.500,00" },
    { name: "Administrativo", employees: 6, budget: "R$ 12.800,00" },
    { name: "Operacional", employees: 7, budget: "R$ 15.200,00" },
    { name: "Gerência", employees: 3, budget: "R$ 18.600,00" },
  ];

  const recentActivities = [
    { id: 1, type: "Admissão", employee: "João Santos", date: "2024-01-10", details: "Novo vendedor contratado" },
    { id: 2, type: "Férias", employee: "Maria Santos", date: "2024-01-08", details: "Período de 15 dias" },
    { id: 3, type: "Promoção", employee: "Ana Costa", date: "2024-01-05", details: "Promovida a Gerente de Vendas" },
    { id: 4, type: "Avaliação", employee: "Pedro Lima", date: "2024-01-03", details: "Avaliação de desempenho concluída" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">Ativo</Badge>;
      case 'Férias':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-500/30">Férias</Badge>;
      case 'Afastado':
        return <Badge variant="destructive">Afastado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recursos Humanos</h1>
          <p className="text-muted-foreground">Gestão completa de pessoal da BLDR</p>
        </div>
        <Button 
          className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
          onClick={() => alert('Abrindo formulário para novo funcionário')}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
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
            <div className="text-2xl font-bold text-foreground">{hrData.totalEmployees}</div>
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
            <div className="text-2xl font-bold text-foreground">{hrData.activeEmployees}</div>
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
            <div className="text-2xl font-bold text-foreground">{hrData.onLeave}</div>
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
            <div className="text-2xl font-bold text-foreground">{hrData.totalPayroll}</div>
            <p className="text-xs text-muted-foreground">total mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* HR Tabs */}
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Lista de Funcionários</CardTitle>
              <CardDescription>Gestão completa da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                        </div>
                        {getStatusBadge(employee.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            ID: {employee.id} • Admissão: {employee.admissionDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{employee.salary}</p>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => alert('Abrindo documentos do funcionário')}
                            >
                              <FileText className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => alert('Gerenciando férias e horários')}
                            >
                              <Calendar className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="grid gap-4 md:grid-cols-2">
                {departments.map((dept, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-foreground">{dept.name}</h3>
                      <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                        {dept.employees} pessoas
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-foreground mb-2">{dept.budget}</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-bldr-gold h-2 rounded-full" 
                        style={{ width: `${(dept.employees / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Orçamento mensal</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Atividades Recentes</CardTitle>
              <CardDescription>Histórico de movimentações de RH</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-bldr-gold" />
                      <div>
                        <p className="font-medium text-foreground">{activity.employee}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{activity.type}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Relatórios de RH</CardTitle>
                <CardDescription>Gere relatórios de recursos humanos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Gerando relatório de funcionários')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Relatório de Funcionários
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Processando folha de pagamento')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Folha de Pagamento
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Abrindo controle de férias')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Controle de Férias
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Iniciando avaliações de desempenho')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Avaliações de Desempenho
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Alertas de RH</CardTitle>
                <CardDescription>Notificações importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-600">Atenção</p>
                  </div>
                  <p className="text-xs text-yellow-600/80 mt-1">3 funcionários com férias vencendo em 30 dias</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-600">Lembrete</p>
                  </div>
                  <p className="text-xs text-blue-600/80 mt-1">Avaliações de desempenho do trimestre pendentes</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-600">Informação</p>
                  </div>
                  <p className="text-xs text-green-600/80 mt-1">Novo funcionário inicia na próxima segunda-feira</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}