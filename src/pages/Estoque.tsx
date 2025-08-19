import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  AlertTriangle,
  TrendingDown,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";

export function Estoque() {
  const stockData = {
    totalProducts: 1247,
    lowStock: 23,
    outOfStock: 8,
    totalValue: "R$ 345.280,00"
  };

  const products = [
    { 
      id: "P001", 
      name: "Produto A", 
      category: "Categoria 1",
      stock: 45, 
      minStock: 20,
      price: "R$ 89,90",
      supplier: "Fornecedor XYZ",
      status: "normal"
    },
    { 
      id: "P002", 
      name: "Produto B", 
      category: "Categoria 2",
      stock: 12, 
      minStock: 15,
      price: "R$ 125,50",
      supplier: "Fornecedor ABC",
      status: "low"
    },
    { 
      id: "P003", 
      name: "Produto C", 
      category: "Categoria 1",
      stock: 0, 
      minStock: 10,
      price: "R$ 67,30",
      supplier: "Fornecedor XYZ",
      status: "out"
    },
    { 
      id: "P004", 
      name: "Produto D", 
      category: "Categoria 3",
      stock: 78, 
      minStock: 25,
      price: "R$ 198,75",
      supplier: "Fornecedor DEF",
      status: "normal"
    },
  ];

  const recentMovements = [
    { id: 1, product: "Produto A", type: "entrada", quantity: 50, date: "2024-01-15", reason: "Compra" },
    { id: 2, product: "Produto B", type: "saida", quantity: 8, date: "2024-01-15", reason: "Venda" },
    { id: 3, product: "Produto C", type: "saida", quantity: 15, date: "2024-01-14", reason: "Venda" },
    { id: 4, product: "Produto A", type: "saida", quantity: 5, date: "2024-01-14", reason: "Perda" },
  ];

  const categories = [
    { name: "Categoria 1", products: 45, value: "R$ 125.430" },
    { name: "Categoria 2", products: 32, value: "R$ 89.240" },
    { name: "Categoria 3", products: 28, value: "R$ 78.650" },
    { name: "Categoria 4", products: 18, value: "R$ 51.960" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Estoque Baixo</Badge>;
      case 'out':
        return <Badge variant="destructive">Sem Estoque</Badge>;
      default:
        return <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estoque</h1>
          <p className="text-muted-foreground">Controle completo do inventário da BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stock KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
            <Package className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">itens no estoque</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Baixo
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.lowStock}</div>
            <p className="text-xs text-muted-foreground">produtos precisando reposição</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sem Estoque
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.outOfStock}</div>
            <p className="text-xs text-muted-foreground">produtos esgotados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
            <Package className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.totalValue}</div>
            <p className="text-xs text-muted-foreground">valor do inventário</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Lista de Produtos</CardTitle>
                  <CardDescription>Gerenciamento completo do inventário</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar produtos..." className="w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id} • {product.category}</p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Estoque: {product.stock} un. (Mín: {product.minStock})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Fornecedor: {product.supplier}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{product.price}</p>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
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

        <TabsContent value="movements" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Movimentações Recentes</CardTitle>
              <CardDescription>Histórico de entradas e saídas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${movement.type === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-foreground">{movement.product}</p>
                        <p className="text-sm text-muted-foreground">{movement.date} • {movement.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${movement.type === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                        {movement.type === 'entrada' ? '+' : '-'} {movement.quantity} un.
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Estoque por Categoria</CardTitle>
              <CardDescription>Distribuição do inventário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-foreground">{category.name}</h3>
                      <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                        {category.products} produtos
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-foreground">{category.value}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-bldr-gold h-2 rounded-full" 
                        style={{ width: `${(category.products / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Produtos com Estoque Baixo</CardTitle>
                <CardDescription>Itens que precisam de reposição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.filter(p => p.status === 'low' || p.status === 'out').map((product) => (
                    <div key={product.id} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Estoque atual: {product.stock} un. (Mín: {product.minStock})
                          </p>
                        </div>
                        <Button size="sm" className="bg-bldr-gold hover:bg-bldr-gold-dark text-primary-foreground">
                          Repor
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Configurações de Alerta</CardTitle>
                <CardDescription>Gerenciar notificações de estoque</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">Email de Estoque Baixo</p>
                      <p className="text-sm text-muted-foreground">Notificar quando produtos atingirem estoque mínimo</p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">Relatório Semanal</p>
                      <p className="text-sm text-muted-foreground">Resumo semanal do inventário</p>
                    </div>
                    <Badge variant="secondary">Inativo</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">Alerta de Produtos Parados</p>
                      <p className="text-sm text-muted-foreground">Produtos sem movimentação há 30 dias</p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
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