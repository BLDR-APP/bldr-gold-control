import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionModal } from "@/components/modals/TransactionModal";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  PlusCircle,
  Download
} from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { formatCurrency } from "@/utils/csvExport";

type Transaction = {
  id: string;
  type: "entrada" | "saída" | "saida"; // cobre variações
  description: string;
  date: string;       // ISO string
  category?: string;
  value: number;      // valor numérico
  created_at?: string;
};

export function Financas() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // 🔎 Busca transações no Supabase (mínimo necessário)
  const transactionsQuery = useSupabaseQuery<Transaction>({
    table: "transactions",
    select: "*",
    orderBy: { column: "created_at", ascending: false },
  });

  // ✅ Array defensivo + normalização de campos (única mudança necessária)
  const transactions: Transaction[] = (transactionsQuery.data ?? []).map((t: any) => ({
    ...t,
    // aceita "value" | "amount" | "valor" e converte para número (suporta "120,00")
    value: Number(String(t.value ?? t.amount ?? t.valor ?? "0").replace(/\./g, "").replace(",", ".")),
    // aceita "type" | "tipo"
    type: (t.type ?? t.tipo) as "entrada" | "saída" | "saida",
  }));

  // 📊 KPIs derivados das transações (receita, despesas, lucro, fluxo)
  const { revenue, expenses, profit, cashFlow } = useMemo(() => {
    const receita = transactions
      .filter(t => t.type === "entrada")
      .reduce((sum, t) => sum + (t.value || 0), 0);

    const saida = transactions
      .filter(t => t.type === "saída" || t.type === "saida")
      .reduce((sum, t) => sum + (t.value || 0), 0);

    const lucro = receita - saida;
    const fluxo = lucro;

    return {
      revenue: formatCurrency(receita),
      expenses: formatCurrency(saida),
      profit: formatCurrency(lucro),
      cashFlow: formatCurrency(fluxo),
    };
  }, [transactions]);

  // 📈 Dados mensais (para os “gráficos” textuais existentes)
  const monthlyData = useMemo(() => {
    const map = new Map<string, { revenue: number; expenses: number }>();
    for (const t of transactions) {
      const d = new Date(t.date || t.created_at || Date.now());
      const key = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      if (!map.has(key)) map.set(key, { revenue: 0, expenses: 0 });
      const bucket = map.get(key)!;
      if (t.type === "entrada") {
        bucket.revenue += t.value || 0;
      } else if (t.type === "saída" || t.type === "saida") {
        bucket.expenses += t.value || 0;
      }
    }
    return Array.from(map.entries())
      .map(([month, { revenue, expenses }]) => ({ month, revenue, expenses }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split("/").map(Number);
        const [mb, yb] = b.month.split("/").map(Number);
        return yb - ya || mb - ma; // desc
      });
  }, [transactions]);

  // 🔄 Quando fechar o modal, refetch (não mexe no modal)
  useEffect(() => {
    if (!isTransactionModalOpen) {
      transactionsQuery.refetch();
    }
  }, [isTransactionModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const financialData = {
    revenue,
    expenses,
    profit,
    cashFlow
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finanças</h1>
          <p className="text-muted-foreground">Controle financeiro completo da BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground"
            onClick={() => alert('Exportando relatório financeiro...')}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          {/* Botão mantido exatamente como estava */}
          <Button 
            className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
            onClick={() => setIsTransactionModalOpen(true)}
          >
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
              <span className="text-muted-foreground">
                {transactionsQuery.loading ? "Carregando..." : "Atualizado pelos lançamentos"}
              </span>
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
              <span className="text-muted-foreground">
                {transactionsQuery.loading ? "Carregando..." : "Atualizado pelos lançamentos"}
              </span>
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
              <span className="text-muted-foreground">
                {transactionsQuery.loading ? "Carregando..." : "Receita - Despesas"}
              </span>
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
              <span className="text-muted-foreground">
                {transactionsQuery.loading ? "Carregando..." : "Base simples dos lançamentos"}
              </span>
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
                {transactionsQuery.loading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Carregando transações...
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Nenhuma transação registrada ainda.</p>
                    <p className="text-sm mt-2">Comece registrando suas primeiras transações!</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${transaction.type === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <div className="flex space-x-2 text-sm text-muted-foreground">
                            <span>{new Date(transaction.date || transaction.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <span>{transaction.category || "Sem categoria"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type === 'entrada' ? '+' : '-'} {formatCurrency(transaction.value || 0)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
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
                  {monthlyData.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>Nenhum dado histórico disponível.</p>
                      <p className="text-sm mt-2">Os gráficos aparecerão conforme você registra transações.</p>
                    </div>
                  ) : (
                    monthlyData.map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">{data.month}</span>
                          <div className="flex space-x-4">
                            <span className="text-green-500">{formatCurrency(data.revenue)}</span>
                            <span className="text-red-500">{formatCurrency(data.expenses)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((data.revenue / Math.max(1, data.revenue + data.expenses)) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((data.expenses / Math.max(1, data.revenue + data.expenses)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Categorias aparecerão após registro de despesas.</p>
                    <p className="text-sm mt-2">Organize suas despesas por categoria para melhor controle.</p>
                  </div>
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Gerando Demonstrativo de Resultados...')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Demonstrativo de Resultados
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Gerando Fluxo de Caixa Detalhado...')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Fluxo de Caixa Detalhado
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Gerando Análise de Tendências...')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Análise de Tendências
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Gerando Balanço Patrimonial...')}
                >
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
      
      <TransactionModal 
        open={isTransactionModalOpen} 
        onOpenChange={setIsTransactionModalOpen} 
      />
    </div>
  );
}
