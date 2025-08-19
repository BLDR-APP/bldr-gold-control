import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id?: string;
  employee_id: string;
  full_name: string;
  position: string;
  department: string;
  salary: number;
  admission_date: string;
  status: string;
  email?: string;
  phone?: string;
}

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSuccess?: () => void;
}

export function EmployeeModal({ open, onOpenChange, employee, onSuccess }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    position: "",
    department: "",
    salary: "",
    admission_date: new Date().toISOString().split('T')[0],
    status: "active",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.employee_id,
        full_name: employee.full_name,
        position: employee.position,
        department: employee.department,
        salary: employee.salary.toString(),
        admission_date: employee.admission_date,
        status: employee.status,
        email: employee.email || "",
        phone: employee.phone || ""
      });
    } else {
      // Reset form for new employee
      setFormData({
        employee_id: "",
        full_name: "",
        position: "",
        department: "",
        salary: "",
        admission_date: new Date().toISOString().split('T')[0],
        status: "active",
        email: "",
        phone: ""
      });
    }
  }, [employee, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.position || !formData.department || !formData.salary || !formData.employee_id) {
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

      const employeeData = {
        user_id: user.id,
        employee_id: formData.employee_id,
        full_name: formData.full_name,
        position: formData.position,
        department: formData.department,
        salary: parseFloat(formData.salary),
        admission_date: formData.admission_date,
        status: formData.status,
        email: formData.email || null,
        phone: formData.phone || null
      };

      let error;
      if (employee?.id) {
        // Update existing employee
        const result = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employee.id);
        error = result.error;
      } else {
        // Create new employee
        const result = await supabase
          .from('employees')
          .insert(employeeData);
        error = result.error;
      }

      if (error) {
        toast.error("Erro ao salvar funcionário: " + error.message);
        return;
      }

      toast.success(employee ? "Funcionário atualizado com sucesso!" : "Funcionário cadastrado com sucesso!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro inesperado ao salvar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {employee ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <DialogDescription>
            {employee ? "Atualize as informações do funcionário." : "Cadastre um novo funcionário na empresa."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">ID do Funcionário*</Label>
              <Input
                id="employee_id"
                placeholder="Ex: F001"
                value={formData.employee_id}
                onChange={(e) => setFormData(prev => ({...prev, employee_id: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="on_vacation">Férias</SelectItem>
                  <SelectItem value="on_leave">Afastado</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo*</Label>
            <Input
              id="full_name"
              placeholder="Ex: João Silva Santos"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Cargo*</Label>
              <Input
                id="position"
                placeholder="Ex: Vendedor"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Departamento*</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({...prev, department: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                  <SelectItem value="Operacional">Operacional</SelectItem>
                  <SelectItem value="Gerência">Gerência</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salário*</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({...prev, salary: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admission_date">Data de Admissão*</Label>
              <Input
                id="admission_date"
                type="date"
                value={formData.admission_date}
                onChange={(e) => setFormData(prev => ({...prev, admission_date: e.target.value}))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="funcionario@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
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
              {loading ? "Salvando..." : (employee ? "Atualizar" : "Cadastrar")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}