import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  AlertTriangle,
  Clock,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw,
  User
} from "lucide-react";

export function Servicos() {
  const serviceData = {
    totalServices: 18,
    activeProjects: 12,
    pendingServices: 3,
    totalRevenue: "R$ 345.280,00"
  };

  const services = [
    { 
      id: "S001", 
      name: "Consultoria Estratégica", 
      category: "Consultoria",
      duration: "3 meses", 
      price: "R$ 15.000,00",
      responsible: "Ana Costa",
      status: "ativo"
    },
    { 
      id: "S002", 
      name: "Auditoria Empresarial", 
      category: "Auditoria",
      duration: "1 mês", 
      price: "R$ 8.500,00",
      responsible: "Pedro Lima",
      status: "pendente"
    },
    { 
      id: "S003", 
      name: "Análise de Mercado", 
      category: "Pesquisa",
      duration: "2 semanas", 
      price: "R$ 5.200,00",
      responsible: "Carlos Silva",
      status: "concluido"
    },
    { 
      id: "S004", 
      name: "Gestão de Projetos", 
      category: "Gestão",
      duration: "6 meses", 
      price: "R$ 25.000,00",
      responsible: "Lucia Ferreira",
      status: "ativo"
    },
  ];

  const recentProjects = [
    { id: 1, service: "Consultoria Estratégica", client: "Empresa A", type: "inicio", date: "2024-01-15", status: "Iniciado" },
    { id: 2, service: "Auditoria Empresarial", client: "Empresa B", type: "conclusao", date: "2024-01-15", status: "Concluído" },
    { id: 3, service: "Análise de Mercado", client: "Empresa C", type: "inicio", date: "2024-01-14", status: "Em Progresso" },
    { id: 4, service: "Gestão de Projetos", client: "Empresa D", type: "pausa", date: "2024-01-14", status: "Pausado" },
  ];

  const categories = [
    { name: "Consultoria", services: 8, revenue: "R$ 125.430" },
    { name: "Auditoria", services: 5, revenue: "R$ 89.240" },
    { name: "Pesquisa", services: 3, revenue: "R$ 78.650" },
    { name: "Gestão", services: 2, revenue: "R$ 51.960" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pendente</Badge>;
      case 'concluido':
        return <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">Concluído</Badge>;
      case 'ativo':
        return <Badge variant="default" className="bg-blue-500/20 text-blue-600 border-blue-500/30">Ativo</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground">Gestão completa dos serviços oferecidos pela BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground"
            onClick={() => alert('Atualizando lista de serviços...')}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
            onClick={() => alert('Abrir modal de novo serviço')}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Service KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Serviços
            </CardTitle>
            <Briefcase className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{serviceData.totalServices}</div>
            <p className="text-xs text-muted-foreground">serviços cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{serviceData.activeProjects}</div>
            <p className="text-xs text-muted-foreground">projetos em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{serviceData.pendingServices}</div>
            <p className="text-xs text-muted-foreground">aguardando início</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <Briefcase className="h-5 w-5 text-bldr-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{serviceData.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">valor dos serviços</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Lista de Serviços</CardTitle>
                  <CardDescription>Catálogo completo de serviços oferecidos</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar serviços..." className="w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{service.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {service.id} • {service.category}</p>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Duração: {service.duration}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Responsável: {service.responsible}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{service.price}</p>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => alert(`Editando serviço: ${service.name}`)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => alert(`Excluindo serviço: ${service.name}`)}
                            >
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

        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Projetos Recentes</CardTitle>
              <CardDescription>Histórico de atividades dos projetos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        project.type === 'inicio' ? 'bg-green-500' : 
                        project.type === 'conclusao' ? 'bg-blue-500' : 
                        'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{project.service}</p>
                        <p className="text-sm text-muted-foreground">{project.client} • {project.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {project.status}
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
              <CardTitle className="text-foreground">Serviços por Categoria</CardTitle>
              <CardDescription>Distribuição dos serviços oferecidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-foreground">{category.name}</h3>
                      <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                        {category.services} serviços
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-foreground">{category.revenue}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-bldr-gold h-2 rounded-full" 
                        style={{ width: `${(category.services / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Equipe de Serviços</CardTitle>
                <CardDescription>Responsáveis pelos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ana Costa", role: "Consultora Sênior", projects: 5, avatar: "AC" },
                    { name: "Pedro Lima", role: "Auditor", projects: 3, avatar: "PL" },
                    { name: "Carlos Silva", role: "Analista", projects: 2, avatar: "CS" },
                    { name: "Lucia Ferreira", role: "Gerente de Projetos", projects: 4, avatar: "LF" }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-bldr-gold rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">{member.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-bldr-gold text-bldr-gold">
                        {member.projects} projetos
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Performance da Equipe</CardTitle>
                <CardDescription>Indicadores de produtividade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-600">Projetos Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-xs text-green-600/80">Este mês</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-medium text-blue-600">Projetos em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-xs text-blue-600/80">Atualmente</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm font-medium text-yellow-600">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold text-yellow-600">96%</p>
                  <p className="text-xs text-yellow-600/80">Média mensal</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}