import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  PlusCircle,
  Download
} from "lucide-react";

export function Financas() {
  const financialData = {
    revenue: "R$ 125.430,00",
    expenses: "R$ 78.250,00",
    profit: "R$ 47.180,00",
    cashFlow: "R$ 23.890,00"
  };

  const transactions = [
    { id: 1, date: "2024-01-15", description: "Venda - Cliente João", type: "entrada", value: "R$ 2.350,00", category: "Vendas" },
    { id: 2, date: "2024-01-15", description: "Fornecedor XYZ", type: "saida", value: "R$ 1.200,00", category: "Compras" },
    { id: 3, date: "2024-01-14", description: "Venda - Cliente Maria", type: "entrada", value: "R$ 890,00", category: "Vendas" },
    { id: 4, date: "2024-01-14", description: "Energia Elétrica", type: "saida", value: "R$ 450,00", category: "Operacional" },
    { id: 5, date: "2024-01-13", description: "Venda - Cliente Pedro", type: "entrada", value: "R$ 3.240,00", category: "Vendas" },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 125430, expenses: 78250 },
    { month: "Fev", revenue: 142300, expenses: 85600 },
    { month: "Mar", revenue: 134200, expenses: 79800 },
    { month: "Abr", revenue: 156780, expenses: 92400 },
    { month: "Mai", revenue: 143500, expenses: 88200 },
    { month: "Jun", revenue: 167890, expenses: 95600 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finanças</h1>
          <p className="text-muted-foreground">Controle financeiro completo da BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{financialData.revenue}</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{financialData.expenses}</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span className="text-red-500">+3.2%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro Líquido
            </CardTitle>
            <DollarSign className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{financialData.profit}</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+18.7%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fluxo de Caixa
            </CardTitle>
            <Wallet className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{financialData.cashFlow}</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+5.4%</span>
              <span className="text-muted-foreground">disponível</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Transações Recentes</CardTitle>
              <CardDescription>Histórico de movimentações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${transaction.type === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <div className="flex space-x-2 text-sm text-muted-foreground">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'entrada' ? '+' : '-'} {transaction.value}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Receita vs Despesas</CardTitle>
                <CardDescription>Comparativo mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{data.month}</span>
                        <div className="flex space-x-4">
                          <span className="text-green-500">R$ {data.revenue.toLocaleString()}</span>
                          <span className="text-red-500">R$ {data.expenses.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(data.revenue / 170000) * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(data.expenses / 170000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Categorias de Despesas</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Operacional", percentage: 45, value: "R$ 35.200" },
                    { category: "Pessoal", percentage: 30, value: "R$ 23.500" },
                    { category: "Compras", percentage: 20, value: "R$ 15.650" },
                    { category: "Marketing", percentage: 5, value: "R$ 3.900" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{item.category}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div 
                          className="bg-bldr-gold h-2 rounded-full transition-all" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Relatórios Disponíveis</CardTitle>
                <CardDescription>Gere relatórios financeiros detalhados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Demonstrativo de Resultados
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Fluxo de Caixa Detalhado
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Análise de Tendências
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Wallet className="w-4 h-4 mr-2" />
                  Balanço Patrimonial
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Alertas Financeiros</CardTitle>
                <CardDescription>Notificações importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm font-medium text-yellow-600">Atenção</p>
                  <p className="text-xs text-yellow-600/80">Fluxo de caixa baixo previsto para próxima semana</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-600">Sucesso</p>
                  <p className="text-xs text-green-600/80">Meta de receita do mês atingida</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-medium text-blue-600">Informação</p>
                  <p className="text-xs text-blue-600/80">Relatório mensal disponível para download</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}