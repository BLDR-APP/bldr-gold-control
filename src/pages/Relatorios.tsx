import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Package,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useUserRole } from "@/hooks/useUserRole";
import { ReportFilterModal, ReportFilters } from "@/components/modals/ReportFilterModal";
import { formatCurrency, exportToCSV, formatDate } from "@/utils/csvExport";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  payment_method: string;
}

interface Sale {
  id: string;
  client_name: string;
  amount: number;
  sale_date: string;
  status: string;
  services: { name: string } | null;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  is_active: boolean;
}

interface Employee {
  id: string;
  full_name: string;
  department: string;
  salary: number;
  status: string;
}

export function Relatorios() {
  const { canWrite } = useUserRole();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentReportType, setCurrentReportType] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Data queries
  const transactionsQuery = useSupabaseQuery<Transaction>({
    table: 'transactions',
    select: '*',
    filters: [
      { column: 'date', operator: 'gte', value: currentFilters.startDate },
      { column: 'date', operator: 'lte', value: currentFilters.endDate }
    ],
    orderBy: { column: 'date', ascending: false }
  });

  const salesQuery = useSupabaseQuery<Sale>({
    table: 'sales',
    select: '*, services(name)',
    filters: [
      { column: 'sale_date', operator: 'gte', value: currentFilters.startDate },
      { column: 'sale_date', operator: 'lte', value: currentFilters.endDate }
    ],
    orderBy: { column: 'sale_date', ascending: false }
  });

  const servicesQuery = useSupabaseQuery<Service>({
    table: 'services',
    select: '*',
    filters: [{ column: 'is_active', operator: 'eq', value: true }]
  });

  const employeesQuery = useSupabaseQuery<Employee>({
    table: 'employees',
    select: '*',
    filters: [{ column: 'is_active', operator: 'eq', value: true }]
  });

  // Calculate KPIs
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    monthlySales: 0,
    productsSold: 0,
    newClients: 0
  });

  useEffect(() => {
    if (transactionsQuery.data && salesQuery.data) {
      const revenue = transactionsQuery.data
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyIncome = salesQuery.data.reduce((sum, s) => sum + s.amount, 0);
      const totalSales = salesQuery.data.length;
      const clients = new Set(salesQuery.data.map(s => s.client_name)).size;

      setKpis({
        totalRevenue: revenue,
        monthlySales: monthlyIncome,
        productsSold: totalSales,
        newClients: clients
      });
    }
  }, [transactionsQuery.data, salesQuery.data, currentFilters]);

  const handleOpenFilterModal = (reportType: string) => {
    setCurrentReportType(reportType);
    setFilterModalOpen(true);
  };

  const handleApplyFilters = (filters: ReportFilters) => {
    setCurrentFilters(filters);
    // Refetch data with new filters
    transactionsQuery.refetch();
    salesQuery.refetch();
  };

  const handleExportFinancial = async () => {
    try {
      let query = supabase.from('transactions').select('*');
      
      query = query.gte('date', currentFilters.startDate);
      query = query.lte('date', currentFilters.endDate);
      
      if (currentFilters.category) {
        query = query.eq('category', currentFilters.category);
      }

      const { data, error } = await query;
      if (error) throw error;

      const csvData = data?.map(t => ({
        'Data': formatDate(t.date),
        'Descrição': t.description,
        'Tipo': t.type === 'income' ? 'Entrada' : 'Saída',
        'Categoria': t.category,
        'Valor': t.amount,
        'Pagamento': t.payment_method || 'N/A'
      })) || [];

      exportToCSV(csvData, `relatorio-financeiro-${currentFilters.startDate}-${currentFilters.endDate}`);
      toast.success("Relatório financeiro exportado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao exportar relatório: " + error.message);
    }
  };

  const handleExportSales = async () => {
    try {
      let query = supabase.from('sales').select('*, services(name)');
      
      query = query.gte('sale_date', currentFilters.startDate);
      query = query.lte('sale_date', currentFilters.endDate);

      const { data, error } = await query;
      if (error) throw error;

      const csvData = data?.map((s: any) => ({
        'Data': formatDate(s.sale_date),
        'Cliente': s.client_name,
        'Serviço': s.services?.name || 'N/A',
        'Valor': s.amount,
        'Status': s.status,
        'Pagamento': s.payment_method || 'N/A'
      })) || [];

      exportToCSV(csvData, `relatorio-vendas-${currentFilters.startDate}-${currentFilters.endDate}`);
      toast.success("Relatório de vendas exportado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao exportar relatório: " + error.message);
    }
  };

  const handleExportServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (error) throw error;

      const csvData = data?.map(s => ({
        'Nome': s.name,
        'Categoria': s.category,
        'Preço': s.price,
        'Status': s.is_active ? 'Ativo' : 'Inativo',
        'Criado em': formatDate(s.created_at)
      })) || [];

      exportToCSV(csvData, `relatorio-servicos-${new Date().toISOString().split('T')[0]}`);
      toast.success("Relatório de serviços exportado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao exportar relatório: " + error.message);
    }
  };

  const quickReports = [
    { 
      name: "Vendas do Período", 
      description: "Resumo das vendas do período selecionado", 
      icon: TrendingUp, 
      color: "text-green-500",
      action: handleExportSales
    },
    { 
      name: "Situação Financeira", 
      description: "Entradas e saídas do período", 
      icon: DollarSign, 
      color: "text-blue-500",
      action: handleExportFinancial
    },
    { 
      name: "Catálogo de Serviços", 
      description: "Lista completa de serviços", 
      icon: Package, 
      color: "text-purple-500",
      action: handleExportServices
    }
  ];

  const reportCategories = [
    {
      title: "Relatórios Financeiros",
      icon: DollarSign,
      reports: [
        { name: "Demonstrativo de Resultados", action: () => handleOpenFilterModal('financial') },
        { name: "Fluxo de Caixa", action: handleExportFinancial },
        { name: "Análise de Custos", action: () => handleOpenFilterModal('financial') }
      ]
    },
    {
      title: "Relatórios de Vendas",
      icon: TrendingUp,
      reports: [
        { name: "Performance de Vendas", action: handleExportSales },
        { name: "Análise de Clientes", action: handleExportSales },
        { name: "Metas vs Realizações", action: handleExportSales }
      ]
    },
    {
      title: "Relatórios de Serviços",
      icon: Package,
      reports: [
        { name: "Catálogo Completo", action: handleExportServices },
        { name: "Análise de Preços", action: () => handleOpenFilterModal('services') },
        { name: "Performance por Categoria", action: () => handleOpenFilterModal('services') }
      ]
    }
  ];

  if (transactionsQuery.error || salesQuery.error) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Erro ao carregar dados</h3>
          <p className="text-muted-foreground">{transactionsQuery.error || salesQuery.error}</p>
          <Button 
            onClick={() => {
              transactionsQuery.refetch();
              salesQuery.refetch();
            }}
            className="mt-4"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Central de relatórios e análises da BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground"
            onClick={() => handleOpenFilterModal('general')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Filtrar Período
          </Button>
          <Button 
            className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
            onClick={() => handleOpenFilterModal('financial')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Current Period Display */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Período Atual</p>
              <p className="text-lg font-semibold text-foreground">
                {formatDate(currentFilters.startDate)} até {formatDate(currentFilters.endDate)}
              </p>
            </div>
            <Button variant="outline" onClick={() => handleOpenFilterModal('general')}>
              <Calendar className="w-4 h-4 mr-2" />
              Alterar Período
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <Activity className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            {transactionsQuery.loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{formatCurrency(kpis.totalRevenue)}</div>
            )}
            <p className="text-xs text-muted-foreground">no período selecionado</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas do Período
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            {salesQuery.loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{formatCurrency(kpis.monthlySales)}</div>
            )}
            <p className="text-xs text-muted-foreground">valor das vendas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Vendas
            </CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {salesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{kpis.productsSold}</div>
            )}
            <p className="text-xs text-muted-foreground">vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Únicos
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            {salesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{kpis.newClients}</div>
            )}
            <p className="text-xs text-muted-foreground">clientes diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="quick">Relatórios Rápidos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {reportCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bldr-gold rounded-lg flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">{category.title}</CardTitle>
                    <CardDescription>Relatórios disponíveis nesta categoria</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                          CSV
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-bldr-gold hover:bg-bldr-gold-dark text-primary-foreground"
                          onClick={report.action}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Relatórios Rápidos</CardTitle>
              <CardDescription>Gere relatórios instantâneos com dados atuais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {quickReports.map((report, index) => (
                  <div 
                    key={index} 
                    className="p-6 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={report.action}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-bldr-gold group-hover:text-primary-foreground transition-colors`}>
                        <report.icon className={`w-6 h-6 ${report.color} group-hover:text-primary-foreground`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
                      <Download className="w-3 h-3 mr-2" />
                      Gerar Agora
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Análises Avançadas</CardTitle>
              <CardDescription>Relatórios com insights e tendências baseados em dados reais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start h-16"
                onClick={() => handleOpenFilterModal('financial')}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-bldr-gold" />
                  <div className="text-left">
                    <p className="font-medium">Análise de Tendências Financeiras</p>
                    <p className="text-xs text-muted-foreground">Padrões de receitas e despesas</p>
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-16"
                onClick={handleExportSales}
              >
                <div className="flex items-center space-x-3">
                  <PieChart className="w-5 h-5 text-bldr-gold" />
                  <div className="text-left">
                    <p className="font-medium">Segmentação de Clientes</p>
                    <p className="text-xs text-muted-foreground">Análise do perfil de clientes</p>
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-16"
                onClick={() => handleOpenFilterModal('services')}
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-bldr-gold" />
                  <div className="text-left">
                    <p className="font-medium">Performance de Serviços</p>
                    <p className="text-xs text-muted-foreground">KPIs e métricas de desempenho</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filter Modal */}
      <ReportFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        reportType={currentReportType}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}