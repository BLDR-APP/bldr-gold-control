import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  is_active: boolean;
}

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSuccess?: () => void;
}

export function ServiceModal({ open, onOpenChange, service, onSuccess }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price.toString(),
        description: service.description || ""
      });
    } else {
      // Reset form for new service
      setFormData({
        name: "",
        category: "",
        price: "",
        description: ""
      });
    }
  }, [service, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const serviceData = {
        user_id: user.id,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        is_active: true
      };

      let error;
      if (service?.id) {
        // Update existing service
        const result = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id);
        error = result.error;
      } else {
        // Create new service
        const result = await supabase
          .from('services')
          .insert(serviceData);
        error = result.error;
      }

      if (error) {
        toast.error("Erro ao salvar serviço: " + error.message);
        return;
      }

      toast.success(service ? "Serviço atualizado com sucesso!" : "Serviço cadastrado com sucesso!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro inesperado ao salvar serviço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {service ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {service ? "Atualize as informações do serviço." : "Cadastre um novo serviço no catálogo da BLDR."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço*</Label>
            <Input
              id="name"
              placeholder="Ex: Consultoria Estratégica"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria*</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="auditoria">Auditoria</SelectItem>
                  <SelectItem value="gestao">Gestão</SelectItem>
                  <SelectItem value="treinamento">Treinamento</SelectItem>
                  <SelectItem value="analise">Análise</SelectItem>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço*</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o serviço, objetivos e entregas"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Salvando..." : (service ? "Atualizar Serviço" : "Cadastrar Serviço")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}