import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleModal({ open, onOpenChange }: SaleModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    services: [],
    value: "",
    seller: "",
    paymentMethod: "",
    installments: "1",
    notes: "",
    deliveryDate: ""
  });

  const availableServices = [
    "Consultoria Estratégica",
    "Auditoria Empresarial", 
    "Gestão de Projetos",
    "Análise de Mercado",
    "Treinamento Corporativo",
    "Planejamento Financeiro"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.value || !formData.seller) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você integraria com seu backend/API
    toast.success("Venda registrada com sucesso!");
    
    // Reset form
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      services: [],
      value: "",
      seller: "",
      paymentMethod: "",
      installments: "1",
      notes: "",
      deliveryDate: ""
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nova Venda</DialogTitle>
          <DialogDescription>
            Registre uma nova venda de serviços no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados do Cliente */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-bldr-gold border-b border-border pb-1">Dados do Cliente</h3>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente*</Label>
              <Input
                id="clientName"
                placeholder="Nome completo ou razão social"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientEmail">E-mail</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({...prev, clientEmail: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  placeholder="(00) 00000-0000"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({...prev, clientPhone: e.target.value}))}
                />
              </div>
            </div>
          </div>

          {/* Dados da Venda */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-bldr-gold border-b border-border pb-1">Dados da Venda</h3>
            
            <div className="space-y-2">
              <Label htmlFor="services">Serviços</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione os serviços vendidos" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor Total*</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({...prev, value: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seller">Vendedor*</Label>
                <Select value={formData.seller} onValueChange={(value) => setFormData(prev => ({...prev, seller: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana-costa">Ana Costa</SelectItem>
                    <SelectItem value="pedro-lima">Pedro Lima</SelectItem>
                    <SelectItem value="carlos-silva">Carlos Silva</SelectItem>
                    <SelectItem value="lucia-ferreira">Lucia Ferreira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({...prev, paymentMethod: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao-credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartao-debito">Cartão de Débito</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installments">Parcelas</Label>
                <Select value={formData.installments} onValueChange={(value) => setFormData(prev => ({...prev, installments: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Data de Entrega</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({...prev, deliveryDate: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações sobre a venda, requisitos especiais, etc."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground">
              Registrar Venda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}