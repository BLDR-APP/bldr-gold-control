import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceModal({ open, onOpenChange }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
    responsible: "",
    status: "ativo"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.duration) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você integraria com seu backend/API
    toast.success("Serviço cadastrado com sucesso!");
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      price: "",
      duration: "",
      description: "",
      responsible: "",
      status: "ativo"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Novo Serviço</DialogTitle>
          <DialogDescription>
            Cadastre um novo serviço no catálogo da BLDR.
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração*</Label>
              <Input
                id="duration"
                placeholder="Ex: 3 meses, 2 semanas"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                placeholder="Nome do responsável"
                value={formData.responsible}
                onChange={(e) => setFormData(prev => ({...prev, responsible: e.target.value}))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="desenvolvimento">Em Desenvolvimento</SelectItem>
              </SelectContent>
            </Select>
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
            <Button type="submit" className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
              Cadastrar Serviço
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}