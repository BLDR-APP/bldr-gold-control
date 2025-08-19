import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package
} from "lucide-react";

export function Relatorios() {
  const reportCategories = [
    {
      title: "Relatórios Financeiros",
      icon: DollarSign,
      reports: [
        { name: "Demonstrativo de Resultados", lastGenerated: "2024-01-15", frequency: "Mensal" },
        { name: "Fluxo de Caixa", lastGenerated: "2024-01-15", frequency: "Diário" },
        { name: "Balanço Patrimonial", lastGenerated: "2024-01-01", frequency: "Trimestral" },
        { name: "Análise de Custos", lastGenerated: "2024-01-10", frequency: "Mensal" }
      ]
    },
    {
      title: "Relatórios de Vendas",
      icon: TrendingUp,
      reports: [
        { name: "Performance de Vendas", lastGenerated: "2024-01-15", frequency: "Semanal" },
        { name: "Análise de Produtos", lastGenerated: "2024-01-14", frequency: "Mensal" },
        { name: "Metas vs Realizações", lastGenerated: "2024-01-15", frequency: "Mensal" },
        { name: "Comissões de Vendedores", lastGenerated: "2024-01-01", frequency: "Mensal" }
      ]
    },
    {
      title: "Relatórios de Estoque",
      icon: Package,
      reports: [
        { name: "Inventário Geral", lastGenerated: "2024-01-15", frequency: "Diário" },
        { name: "Produtos em Baixa", lastGenerated: "2024-01-15", frequency: "Semanal" },
        { name: "Movimentação de Estoque", lastGenerated: "2024-01-14", frequency: "Diário" },
        { name: "Análise de Giro", lastGenerated: "2024-01-01", frequency: "Mensal" }
      ]
    },
    {
      title: "Relatórios de RH",
      icon: Users,
      reports: [
        { name: "Folha de Pagamento", lastGenerated: "2024-01-01", frequency: "Mensal" },
        { name: "Controle de Ponto", lastGenerated: "2024-01-15", frequency: "Quinzenal" },
        { name: "Avaliações de Performance", lastGenerated: "2024-01-01", frequency: "Trimestral" },
        { name: "Relatório de Férias", lastGenerated: "2024-01-10", frequency: "Mensal" }
      ]
    }
  ];

  const quickReports = [
    { name: "Vendas do Dia", description: "Resumo das vendas de hoje", icon: TrendingUp, color: "text-green-500" },
    { name: "Estoque Crítico", description: "Produtos com estoque baixo", icon: Package, color: "text-yellow-500" },
    { name: "Fluxo de Caixa", description: "Posição financeira atual", icon: DollarSign, color: "text-blue-500" },
    { name: "Funcionários Ativos", description: "Status da equipe", icon: Users, color: "text-purple-500" }
  ];

  const dashboardMetrics = [
    { title: "Receita Total", value: "R$ 125.430", change: "+12.5%", trend: "up" },
    { title: "Vendas do Mês", value: "R$ 23.850", change: "+8.2%", trend: "up" },
    { title: "Produtos Vendidos", value: "1.247", change: "+15.3%", trend: "up" },
    { title: "Novos Clientes", value: "45", change: "+22.1%", trend: "up" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Central de relatórios e análises da BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Relatório
          </Button>
          <Button className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
            <FileText className="w-4 h-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-card transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Activity className="h-5 w-5 text-bldr-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{metric.change}</span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="quick">Relatórios Rápidos</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
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
                <div className="grid gap-4 md:grid-cols-2">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                          {report.frequency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Último: {report.lastGenerated}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Baixar
                        </Button>
                        <Button size="sm" className="bg-bldr-gold hover:bg-bldr-gold-dark text-primary-foreground">
                          <Activity className="w-3 h-3 mr-1" />
                          Gerar
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
              <div className="grid gap-4 md:grid-cols-2">
                {quickReports.map((report, index) => (
                  <div key={index} className="p-6 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
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

        <TabsContent value="scheduled" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Relatórios Agendados</CardTitle>
              <CardDescription>Relatórios configurados para geração automática</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Relatório Diário de Vendas", schedule: "Todo dia às 18:00", status: "Ativo", nextRun: "Hoje 18:00" },
                  { name: "Inventário Semanal", schedule: "Segundas-feiras às 08:00", status: "Ativo", nextRun: "Segunda 08:00" },
                  { name: "Relatório Mensal Financeiro", schedule: "1º dia do mês às 09:00", status: "Ativo", nextRun: "01/02 09:00" },
                  { name: "Performance Trimestral", schedule: "Início de cada trimestre", status: "Pausado", nextRun: "01/04 09:00" }
                ].map((scheduled, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{scheduled.name}</p>
                      <p className="text-sm text-muted-foreground">{scheduled.schedule}</p>
                      <p className="text-xs text-muted-foreground">Próxima execução: {scheduled.nextRun}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={scheduled.status === 'Ativo' ? 'default' : 'secondary'}>
                        {scheduled.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
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
                <CardTitle className="text-foreground">Análises Avançadas</CardTitle>
                <CardDescription>Relatórios com insights e tendências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start h-16">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-bldr-gold" />
                    <div className="text-left">
                      <p className="font-medium">Análise de Tendências</p>
                      <p className="text-xs text-muted-foreground">Identificação de padrões e previsões</p>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start h-16">
                  <div className="flex items-center space-x-3">
                    <PieChart className="w-5 h-5 text-bldr-gold" />
                    <div className="text-left">
                      <p className="font-medium">Segmentação de Clientes</p>
                      <p className="text-xs text-muted-foreground">Análise comportamental e demográfica</p>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start h-16">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-bldr-gold" />
                    <div className="text-left">
                      <p className="font-medium">Análise de Performance</p>
                      <p className="text-xs text-muted-foreground">KPIs e métricas de desempenho</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Exportação de Dados</CardTitle>
                <CardDescription>Configurações de formato e destino</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Formato PDF</span>
                    <Badge variant="default">Padrão</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Formato Excel</span>
                    <Badge variant="outline">Disponível</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Formato CSV</span>
                    <Badge variant="outline">Disponível</Badge>
                  </div>
                </div>
                <hr className="border-border" />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Email Automático</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Armazenamento Local</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Integração Cloud</span>
                    <Badge variant="secondary">Configurar</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}