import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleModal({ open, onOpenChange }: SaleModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceId: "",
    amount: "",
    paymentMethod: "",
    notes: "",
    saleDate: new Date().toISOString().split('T')[0]
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchServices();
    }
  }, [open]);

  const fetchServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Erro ao buscar serviços:', error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar serviços:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.amount || !formData.serviceId) {
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

      const { error } = await supabase.from('sales').insert({
        user_id: user.id,
        service_id: formData.serviceId,
        client_name: formData.clientName,
        client_email: formData.clientEmail || null,
        client_phone: formData.clientPhone || null,
        amount: parseFloat(formData.amount),
        payment_method: formData.paymentMethod || null,
        notes: formData.notes || null,
        sale_date: formData.saleDate,
        status: 'completed'
      });

      if (error) {
        toast.error("Erro ao registrar venda: " + error.message);
        return;
      }

      toast.success("Venda registrada com sucesso!");
      
      // Reset form
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        serviceId: "",
        amount: "",
        paymentMethod: "",
        notes: "",
        saleDate: new Date().toISOString().split('T')[0]
      });
      
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro inesperado ao registrar venda");
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="serviceId">Serviço*</Label>
              <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({...prev, serviceId: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço vendido" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - R$ {service.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor Total*</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="saleDate">Data da Venda</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData(prev => ({...prev, saleDate: e.target.value}))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({...prev, paymentMethod: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
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
            <Button 
              type="submit" 
              className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar Venda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}