import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  AlertTriangle,
  Clock,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useUserRole } from "@/hooks/useUserRole";
import { ServiceModal } from "@/components/modals/ServiceModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { formatCurrency } from "@/utils/csvExport";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface Project {
  id: string;
  service_id: string;
  client_name: string;
  start_date: string;
  end_date: string;
  status: string;
  services: { name: string };
}

export function Servicos() {
  const { canWrite } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Services query
  const servicesQuery = useSupabaseQuery<Service>({
    table: "services",
    select: "*",
    filters: searchTerm ? [{ column: "name", operator: "ilike", value: `%${searchTerm}%` }] : undefined,
    orderBy: { column: "created_at", ascending: false },
  });

  // Projects query
  const projectsQuery = useSupabaseQuery<Project>({
    table: "projects",
    select: "*, services(name)",
    orderBy: { column: "created_at", ascending: false },
    limit: 10,
  });

  const services = servicesQuery.data ?? [];
  const projects = projectsQuery.data ?? [];

  const [kpis, setKpis] = useState({
    totalServices: 0,
    activeProjects: 0,
    pendingServices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const totalServices = services.length;
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const pendingServices = services.filter((s) => !s.is_active).length;
    const totalRevenue = services.reduce((sum, service) => sum + (service.price || 0), 0);

    setKpis({
      totalServices,
      activeProjects,
      pendingServices,
      totalRevenue,
    });
  }, [services, projects]);

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-blue-500/20 text-blue-600 border-blue-500/30">
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500/20 text-gray-600 border-gray-500/30">
        Inativo
      </Badge>
    );
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">Ativo</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-blue-500/20 text-blue-600 border-blue-500/30">Concluído</Badge>;
      case "on_hold":
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pausado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEditService = (service: Service) => {
    if (!canWrite) {
      toast.error("Você não tem permissão para editar serviços");
      return;
    }
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    if (!canWrite) {
      toast.error("Você não tem permissão para excluir serviços");
      return;
    }
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: false })
        .eq("id", selectedService.id);

      if (error) throw error;

      toast.success("Serviço removido com sucesso!");
      servicesQuery.refetch();
    } catch (error: any) {
      toast.error("Erro ao remover serviço: " + error.message);
    }
  };

  const handleServiceSuccess = () => {
    servicesQuery.refetch();
    projectsQuery.refetch();
  };

  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || "Outros";
    if (!acc[category]) {
      acc[category] = { services: 0, revenue: 0 };
    }
    acc[category].services += 1;
    acc[category].revenue += service.price || 0;
    return acc;
  }, {} as Record<string, { services: number; revenue: number }>);

  const errorMsg =
    (servicesQuery.error && (servicesQuery.error.message ?? String(servicesQuery.error))) ||
    (projectsQuery.error && (projectsQuery.error.message ?? String(projectsQuery.error)));

  if (servicesQuery.error || projectsQuery.error) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Erro ao carregar dados</h3>
          <p className="text-muted-foreground">{errorMsg}</p>
          <Button
            onClick={() => {
              servicesQuery.refetch();
              projectsQuery.refetch();
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
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground">Gestão completa dos serviços oferecidos pela BLDR</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-bldr-gold text-bldr-gold hover:bg-bldr-gold hover:text-primary-foreground"
            onClick={() => {
              servicesQuery.refetch();
              projectsQuery.refetch();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          {canWrite && (
            <Button
              className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
              onClick={() => {
                setSelectedService(null);
                setServiceModalOpen(true);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          )}
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
            {servicesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{kpis.totalServices}</div>
            )}
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
            {projectsQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{kpis.activeProjects}</div>
            )}
            <p className="text-xs text-muted-foreground">projetos em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inativos
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {servicesQuery.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{kpis.pendingServices}</div>
            )}
            <p className="text-xs text-muted-foreground">serviços inativos</p>
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
            {servicesQuery.loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{formatCurrency(kpis.totalRevenue)}</div>
            )}
            <p className="text-xs text-muted-foreground">valor dos serviços</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
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
                  <Input 
                    placeholder="Buscar serviços..." 
                    className="w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {servicesQuery.loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center p-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">Nenhum serviço encontrado</h3>
                  <p className="text-muted-foreground">Não há serviços cadastrados ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.category}</p>
                          </div>
                          {getStatusBadge(service.is_active)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {service.description || "Sem descrição"}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <p className="text-lg font-bold text-foreground">{formatCurrency(service.price)}</p>
                            {canWrite && (
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteService(service)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {projectsQuery.loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center p-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">Nenhum projeto encontrado</h3>
                  <p className="text-muted-foreground">Não há projetos cadastrados ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          project.status === 'active' ? 'bg-green-500' : 
                          project.status === 'completed' ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{project.services?.name || 'Serviço não encontrado'}</p>
                          <p className="text-sm text-muted-foreground">{project.client_name} • {new Date(project.start_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getProjectStatusBadge(project.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {servicesQuery.loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-8 w-24 mb-2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : Object.keys(servicesByCategory).length === 0
