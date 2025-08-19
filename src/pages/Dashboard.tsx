import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  userRole?: 'partner' | 'user' | null;
}

export function Dashboard({ userRole }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    monthlySales: 0,
    activeServices: 0,
    recentSales: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar vendas do mês atual
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: salesData } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .gte('sale_date', `${currentMonth}-01`);

      // Buscar todas as transações de receita
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income');

      // Buscar serviços ativos
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Buscar vendas recentes (últimas 5)
      const { data: recentSalesData } = await supabase
        .from('sales')
        .select(`
          *,
          services(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const totalRevenue = revenueData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
      const monthlySales = salesData?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
      
      setDashboardData({
        totalRevenue,
        monthlySales,
        activeServices: servicesData?.length || 0,
        recentSales: recentSalesData || [],
        topServices: servicesData || []
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  const kpis = [
    {
      title: "Receita Total",
      value: formatCurrency(dashboardData.totalRevenue),
      change: "0%",
      trend: "up",
      icon: DollarSign,
      visible: true
    },
    {
      title: "Vendas do Mês",
      value: formatCurrency(dashboardData.monthlySales),
      change: "0%",
      trend: "up",
      icon: TrendingUp,
      visible: true
    },
    {
      title: "Serviços Ativos",
      value: dashboardData.activeServices.toString(),
      change: "0%",
      trend: "up",
      icon: Package,
      visible: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema BLDR - Sistema de Gestão Empresarial
          </p>
        </div>
        <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
          {new Date().toLocaleDateString('pt-BR')}
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-card transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-5 w-5 text-bldr-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {kpi.change}
                </span>
                <span className="text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Vendas Recentes</CardTitle>
            <CardDescription>Últimas transações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentSales.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Nenhuma venda registrada ainda.</p>
                  <p className="text-sm mt-2">Comece registrando sua primeira venda!</p>
                </div>
              ) : (
                dashboardData.recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{sale.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.services?.name || 'Serviço removido'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{formatCurrency(Number(sale.amount))}</p>
                      <Badge 
                        variant={sale.status === 'completed' ? 'default' : sale.status === 'pending' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {sale.status === 'completed' ? 'Concluída' : sale.status === 'pending' ? 'Pendente' : 'Cancelada'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Serviços Cadastrados</CardTitle>
            <CardDescription>Serviços disponíveis no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topServices.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Nenhum serviço cadastrado ainda.</p>
                  <p className="text-sm mt-2">Registre seus primeiros serviços para ver as estatísticas!</p>
                </div>
              ) : (
                dashboardData.topServices.slice(0, 5).map((service: any, index: number) => (
                  <div key={service.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-bldr-gold">#{index + 1}</span>
                        <span className="font-medium text-foreground">{service.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatCurrency(Number(service.price))}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {service.category} • {service.is_active ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button 
              className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors"
              onClick={() => window.location.href = '/vendas'}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-bldr-gold" />
                <div>
                  <h3 className="font-medium text-foreground">Nova Venda</h3>
                  <p className="text-sm text-muted-foreground">Registrar novo serviço</p>
                </div>
              </div>
            </button>
            
            <button 
              className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors"
              onClick={() => window.location.href = '/estoque'}
            >
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-bldr-gold" />
                <div>
                  <h3 className="font-medium text-foreground">Gerenciar Serviços</h3>
                  <p className="text-sm text-muted-foreground">Controle de serviços</p>
                </div>
              </div>
            </button>

            <button 
              className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors"
              onClick={() => window.location.href = '/relatorios'}
            >
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-bldr-gold" />
                <div>
                  <h3 className="font-medium text-foreground">Relatórios</h3>
                  <p className="text-sm text-muted-foreground">Análises detalhadas</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}