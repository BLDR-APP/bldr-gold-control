import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  ShoppingCart,
  Target,
  Users,
  PlusCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export function Vendas() {
  const salesData = {
    totalSales: "R$ 0,00",
    thisMonth: "R$ 0,00",
    target: "R$ 0,00",
    conversion: "0%"
  };

  const recentSales = [];

  const salesTargets = [
    { seller: "Ana Costa", target: 15000, achieved: 12350, percentage: 82.3 },
    { seller: "Pedro Lima", target: 12000, achieved: 9800, percentage: 81.7 },
    { seller: "Carlos Silva", target: 10000, achieved: 7200, percentage: 72.0 },
    { seller: "Lucia Ferreira", target: 8000, achieved: 6100, percentage: 76.3 },
  ];

  const topServices = [
    { name: "Consultoria Estratégica", sales: 156, revenue: "R$ 15.600,00", margin: "32%" },
    { name: "Auditoria Empresarial", sales: 142, revenue: "R$ 12.480,00", margin: "28%" },
    { name: "Análise de Mercado", sales: 128, revenue: "R$ 11.200,00", margin: "35%" },
    { name: "Gestão de Projetos", sales: 98, revenue: "R$ 8.820,00", margin: "25%" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground">Gestão completa de vendas de serviços e relacionamento com clientes</p>
        </div>
        <Button 
          className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
          onClick={() => alert('Abrir modal de nova venda de serviço')}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      {/* Sales KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas Totais
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{salesData.totalSales}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-muted-foreground">Aguardando dados</span>
              </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas do Mês
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{salesData.thisMonth}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-muted-foreground">Aguardando dados</span>
              </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meta do Mês
            </CardTitle>
            <Target className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{salesData.target}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-bldr-gold h-2 rounded-full" style={{ width: "0%" }} />
            </div>
            <span className="text-xs text-muted-foreground">0% atingido</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Users className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{salesData.conversion}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-muted-foreground">Aguardando dados</span>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="targets">Metas</TabsTrigger>
          <TabsTrigger value="products">Serviços</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Vendas Recentes</CardTitle>
              <CardDescription>Histórico das últimas transações</CardDescription>
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
                    <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{sale.client}</p>
                            <p className="text-sm text-muted-foreground">ID: {sale.id} • {sale.date}</p>
                          </div>
                          <Badge 
                            variant={sale.status === 'Finalizada' ? 'default' : sale.status === 'Processando' ? 'secondary' : 'destructive'}
                          >
                            {sale.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Serviços: {sale.services.join(', ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Vendedor: {sale.seller}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{sale.value}</p>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Metas por Vendedor</CardTitle>
              <CardDescription>Acompanhamento de performance individual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {salesTargets.map((target, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-foreground">{target.seller}</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {target.achieved.toLocaleString()} de R$ {target.target.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={target.percentage >= 80 ? 'default' : 'secondary'}>
                        {target.percentage}%
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${target.percentage >= 80 ? 'bg-bldr-gold' : 'bg-muted-foreground'}`}
                        style={{ width: `${target.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Serviços Mais Vendidos</CardTitle>
              <CardDescription>Ranking de serviços por vendas e margem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-bldr-gold rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.sales} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{service.revenue}</p>
                      <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                        {service.margin} margem
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Vendas por Período</CardTitle>
                <CardDescription>Análise de tendências mensais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "Janeiro", sales: 23850, growth: "+8.2%" },
                    { month: "Dezembro", sales: 22100, growth: "+5.1%" },
                    { month: "Novembro", sales: 21000, growth: "+12.3%" },
                    { month: "Outubro", sales: 18700, growth: "-2.4%" },
                  ].map((data, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{data.month}</p>
                        <p className="text-sm text-muted-foreground">R$ {data.sales.toLocaleString()}</p>
                      </div>
                      <Badge variant={data.growth.startsWith('+') ? 'default' : 'destructive'}>
                        {data.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Canais de Venda</CardTitle>
                <CardDescription>Performance por canal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: "Presencial", percentage: 65, value: "R$ 15.500" },
                    { channel: "Online", percentage: 25, value: "R$ 5.950" },
                    { channel: "Telefone", percentage: 10, value: "R$ 2.400" }
                  ].map((channel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{channel.channel}</span>
                        <span className="text-muted-foreground">{channel.value}</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div 
                          className="bg-bldr-gold h-2 rounded-full transition-all" 
                          style={{ width: `${channel.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{channel.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}