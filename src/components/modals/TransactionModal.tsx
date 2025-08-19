import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.type || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você integraria com seu backend/API
    toast.success("Transação registrada com sucesso!");
    
    // Reset form
    setFormData({
      description: "",
      amount: "",
      type: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      notes: ""
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova movimentação financeira no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo*</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor*</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição*</Label>
            <Input
              id="description"
              placeholder="Ex: Venda de serviço para Cliente X"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
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
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="pessoal">Pessoal</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="compras">Compras</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Data*</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais (opcional)"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
              Registrar Transação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}