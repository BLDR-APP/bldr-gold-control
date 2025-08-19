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

      {/* ... resto da tela inalterado ... */}

      {/* Modals */}
      <ServiceModal
        key={selectedService?.id ?? "new"}
        open={serviceModalOpen}
        onOpenChange={setServiceModalOpen}
        service={selectedService}
        onSuccess={handleServiceSuccess}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Remover Serviço"
        description="Tem certeza que deseja remover este serviço? Esta ação irá marcá-lo como inativo."
        itemName={selectedService?.name || ""}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
