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

interface DashboardProps {
  userRole: 'partner' | 'user' | null;
}

export function Dashboard({ userRole }: DashboardProps) {
  const isPartner = userRole === 'partner';

  const kpis = [
    {
      title: "Receita Total",
      value: "R$ 0,00",
      change: "0%",
      trend: "up",
      icon: DollarSign,
      visible: isPartner
    },
    {
      title: "Vendas do Mês",
      value: "R$ 0,00",
      change: "0%",
      trend: "up",
      icon: TrendingUp,
      visible: true
    },
    {
      title: "Serviços Ativos",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Package,
      visible: true
    },
    {
      title: "Funcionários Ativos",
      value: "0",
      change: "0",
      trend: "up",
      icon: Users,
      visible: isPartner
    }
  ];

  const recentSales = [];

  const topServices = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema BLDR - {isPartner ? 'Painel do Sócio' : 'Painel Operacional'}
          </p>
        </div>
        <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
          {new Date().toLocaleDateString('pt-BR')}
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.filter(kpi => kpi.visible).map((kpi, index) => (
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
              {recentSales.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Nenhuma venda registrada ainda.</p>
                  <p className="text-sm mt-2">Comece registrando sua primeira venda!</p>
                </div>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{sale.client}</p>
                      <p className="text-sm text-muted-foreground">ID: {sale.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{sale.value}</p>
                      <Badge 
                        variant={sale.status === 'Pago' ? 'default' : sale.status === 'Pendente' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {sale.status}
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
            <CardTitle className="text-foreground">Serviços Mais Vendidos</CardTitle>
            <CardDescription>Ranking de vendas do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Nenhum serviço vendido ainda.</p>
                  <p className="text-sm mt-2">Registre seus primeiros serviços para ver as estatísticas!</p>
                </div>
              ) : (
                topServices.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-bldr-gold">#{index + 1}</span>
                        <span className="font-medium text-foreground">{service.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{service.revenue}</span>
                    </div>
                    <Progress 
                      value={(service.sales / 160) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">{service.sales} vendas</p>
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
              onClick={() => alert('Redirecionando para nova venda de serviço')}
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
              onClick={() => alert('Abrindo gestão de serviços')}
            >
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-bldr-gold" />
                <div>
                  <h3 className="font-medium text-foreground">Gerenciar Serviços</h3>
                  <p className="text-sm text-muted-foreground">Controle de serviços</p>
                </div>
              </div>
            </button>

            {isPartner && (
              <button 
                className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors"
                onClick={() => alert('Abrindo relatórios detalhados')}
              >
                <div className="flex items-center space-x-3">
                  <Eye className="h-6 w-6 text-bldr-gold" />
                  <div>
                    <h3 className="font-medium text-foreground">Relatórios</h3>
                    <p className="text-sm text-muted-foreground">Análises detalhadas</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}