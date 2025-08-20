import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  Shield,
  Bell,
  Database,
  Mail,
  Smartphone,
  Building2,
  Save
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

type SettingsRow = {
  // 🔑 adicionado para vincular ao usuário no Supabase
  user_id?: string;

  // Geral
  company_name?: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;

  // Users
  users_partner_enabled?: boolean;
  users_user_enabled?: boolean;
  users_guest_enabled?: boolean;

  // Permissões por módulo
  perm_financas_partner?: boolean;
  perm_financas_user?: boolean;
  perm_vendas_partner?: boolean;
  perm_vendas_user?: boolean;
  perm_estoque_partner?: boolean;
  perm_estoque_user?: boolean;
  perm_rh_partner?: boolean;
  perm_rh_user?: boolean;
  perm_relatorios_partner?: boolean;
  perm_relatorios_user?: boolean;
  perm_configs_partner?: boolean;
  perm_configs_user?: boolean;

  // Segurança
  two_factor_enabled?: boolean;
  multi_session_enabled?: boolean;
  audit_log_enabled?: boolean;
  session_timeout_minutes?: number;

  pass_min_length?: number;
  pass_expiry_days?: number;
  pass_require_uppercase?: boolean;
  pass_require_numbers?: boolean;
  pass_require_special?: boolean;
  pass_history_enabled?: boolean;

  // Notificações
  notif_email_enabled?: boolean;
  notif_push_enabled?: boolean;

  notif_sales?: boolean;
  notif_low_stock?: boolean;
  notif_new_transactions?: boolean;
  notif_reports?: boolean;
  notif_new_employees?: boolean;
  notif_goals?: boolean;
  notif_security?: boolean;
  notif_backup?: boolean;

  // Sistema
  backup_enabled?: boolean;
  logs_retention_days?: number;
  maintenance_mode?: boolean;

  updated_at?: string;
};

export function Configuracoes() {
  // --------- ESTADO CONTROLADO (mantendo layout e textos)
  const [form, setForm] = useState<SettingsRow>({
    // Geral
    company_name: "BLDR",
    cnpj: "12.345.678/0001-90",
    address: "Rua Principal, 123",
    phone: "(11) 9999-8888",
    email: "contato@bldr.com.br",
    website: "www.bldr.com.br",

    // Users
    users_partner_enabled: true,
    users_user_enabled: true,
    users_guest_enabled: false,

    // Permissões (iguais à UI original)
    perm_financas_partner: true, perm_financas_user: false,
    perm_vendas_partner: true,  perm_vendas_user: true,
    perm_estoque_partner: true, perm_estoque_user: true,
    perm_rh_partner: true,      perm_rh_user: false,
    perm_relatorios_partner: true, perm_relatorios_user: false,
    perm_configs_partner: true,   perm_configs_user: false,

    // Segurança
    two_factor_enabled: true,
    multi_session_enabled: true,
    audit_log_enabled: true,
    session_timeout_minutes: 30,

    pass_min_length: 8,
    pass_expiry_days: 90,
    pass_require_uppercase: true,
    pass_require_numbers: true,
    pass_require_special: true,
    pass_history_enabled: false,

    // Notificações
    notif_email_enabled: true,
    notif_push_enabled: true,

    notif_sales:  true,
    notif_low_stock: true,
    notif_new_transactions: true,
    notif_reports: false,
    notif_new_employees: true,
    notif_goals: true,
    notif_security: true,
    notif_backup: false,

    // Sistema
    backup_enabled: true,
    logs_retention_days: 90,
    maintenance_mode: false,
  });

  const [saving, setSaving] = useState(false);

  // --------- BUSCA NO SUPABASE (mantém a mesma UX/estrutura)
  const settingsQuery = useSupabaseQuery<SettingsRow>({
    table: "settings",
    select: "*",
    limit: 1,
    orderBy: { column: "updated_at", ascending: false },
  });

  // --------- HIDRATA FORM AO CARREGAR
  useEffect(() => {
    const row = settingsQuery.data?.[0];
    if (row) {
      setForm(prev => ({
        ...prev,
        ...row,
      }));
    }
  }, [settingsQuery.data]);

  // --------- HANDLERS (mantidos)
  const onChange =
    (field: keyof SettingsRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setForm(prev => ({ ...prev, [field]: value }));
    };

  const onToggle =
    (field: keyof SettingsRow) =>
    (checked: boolean) => {
      setForm(prev => ({ ...prev, [field]: checked }));
    };

  // --------- SALVAR CONFIGURAÇÕES (ajuste mínimo: user_id + onConflict)
  const onSave = async () => {
    alert("Salvando todas as configurações");
    try {
      setSaving(true);

      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      const userId = authData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      const payload: SettingsRow = {
        ...form,
        user_id: userId, // 🔑 vincula a linha ao usuário
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("settings")
        .upsert(payload, { onConflict: "user_id" }); // 🔑 garante 1 linha por user_id

      if (error) throw error;

      await settingsQuery.refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Configurações gerais do sistema BLDR</p>
        </div>
        <Button 
          className="bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
          onClick={onSave}
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* ----------------- GERAL ----------------- */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-bldr-gold" />
                <div>
                  <CardTitle className="text-foreground">Informações da Empresa</CardTitle>
                  <CardDescription>Dados básicos da BLDR</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" value={form.company_name ?? ""} onChange={onChange("company_name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={form.cnpj ?? ""} onChange={onChange("cnpj")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" value={form.address ?? ""} onChange={onChange("address")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={form.phone ?? ""} onChange={onChange("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email ?? ""} onChange={onChange("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={form.website ?? ""} onChange={onChange("website")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Configurações Gerais</CardTitle>
              <CardDescription>Preferências do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Fuso Horário</Label>
                  <p className="text-sm text-muted-foreground">America/Sao_Paulo (GMT-3)</p>
                </div>
                <Badge variant="outline">Detectado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Moeda Padrão</Label>
                  <p className="text-sm text-muted-foreground">Real Brasileiro (BRL)</p>
                </div>
                <Badge variant="default">R$</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Idioma do Sistema</Label>
                  <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                </div>
                <Badge variant="outline">pt-BR</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------- USUÁRIOS ----------------- */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-bldr-gold" />
                <div>
                  <CardTitle className="text-foreground">Gestão de Usuários</CardTitle>
                  <CardDescription>Controle de acesso e permissões</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Acesso de Sócios</p>
                    <p className="text-sm text-muted-foreground">Acesso completo ao sistema</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">3 usuários</Badge>
                    <Switch checked={!!form.users_partner_enabled} onCheckedChange={onToggle("users_partner_enabled")} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Acesso de Funcionários</p>
                    <p className="text-sm text-muted-foreground">Acesso limitado às operações</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">12 usuários</Badge>
                    <Switch checked={!!form.users_user_enabled} onCheckedChange={onToggle("users_user_enabled")} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Acesso de Convidados</p>
                    <p className="text-sm text-muted-foreground">Acesso somente leitura</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">0 usuários</Badge>
                    <Switch checked={!!form.users_guest_enabled} onCheckedChange={onToggle("users_guest_enabled")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Permissões por Módulo</CardTitle>
              <CardDescription>Configure o acesso aos módulos do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "financas",  label: "Finanças" },
                  { key: "vendas",    label: "Vendas" },
                  { key: "estoque",   label: "Estoque" },
                  { key: "rh",        label: "RH" },
                  { key: "relatorios",label: "Relatórios" },
                  { key: "configs",   label: "Configurações" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-foreground">{label}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Sócios</Label>
                        <Switch
                          checked={!!(form as any)[`perm_${key}_partner`]}
                          onCheckedChange={(v) => onToggle(`perm_${key}_partner` as keyof SettingsRow)(v)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Usuários</Label>
                        <Switch
                          checked={!!(form as any)[`perm_${key}_user`]}
                          onCheckedChange={(v) => onToggle(`perm_${key}_user` as keyof SettingsRow)(v)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------- SEGURANÇA ----------------- */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-bldr-gold" />
                <div>
                  <CardTitle className="text-foreground">Configurações de Segurança</CardTitle>
                  <CardDescription>Proteção e controle de acesso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">Segurança adicional no login</p>
                </div>
                <Switch checked={!!form.two_factor_enabled} onCheckedChange={onToggle("two_factor_enabled")} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Sessões Múltiplas</Label>
                  <p className="text-sm text-muted-foreground">Permitir login em vários dispositivos</p>
                </div>
                <Switch checked={!!form.multi_session_enabled} onCheckedChange={onToggle("multi_session_enabled")} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Timeout de Sessão</Label>
                  <p className="text-sm text-muted-foreground">Logout automático após inatividade</p>
                </div>
                <Badge variant="outline">{form.session_timeout_minutes ?? 30} minutos</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">Registro de todas as ações</p>
                </div>
                <Switch checked={!!form.audit_log_enabled} onCheckedChange={onToggle("audit_log_enabled")} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Políticas de Senha</CardTitle>
              <CardDescription>Regras de criação de senhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tamanho Mínimo</Label>
                  <Input type="number" value={form.pass_min_length ?? 8} onChange={onChange("pass_min_length")} />
                </div>
                <div className="space-y-2">
                  <Label>Validade (dias)</Label>
                  <Input type="number" value={form.pass_expiry_days ?? 90} onChange={onChange("pass_expiry_days")} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch checked={!!form.pass_require_uppercase} onCheckedChange={onToggle("pass_require_uppercase")} />
                  <Label>Exigir letras maiúsculas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={!!form.pass_require_numbers} onCheckedChange={onToggle("pass_require_numbers")} />
                  <Label>Exigir números</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={!!form.pass_require_special} onCheckedChange={onToggle("pass_require_special")} />
                  <Label>Exigir caracteres especiais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={!!form.pass_history_enabled} onCheckedChange={onToggle("pass_history_enabled")} />
                  <Label>Histórico de senhas (não repetir últimas 5)</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------- NOTIFICAÇÕES ----------------- */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-bldr-gold" />
                <div>
                  <CardTitle className="text-foreground">Configurações de Notificações</CardTitle>
                  <CardDescription>Gerenciar alertas e comunicações</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-bldr-gold" />
                    <div>
                      <Label className="text-foreground">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">Receber alertas por email</p>
                    </div>
                  </div>
                  <Switch checked={!!form.notif_email_enabled} onCheckedChange={onToggle("notif_email_enabled")} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-bldr-gold" />
                    <div>
                      <Label className="text-foreground">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Alertas no navegador</p>
                    </div>
                  </div>
                  <Switch checked={!!form.notif_push_enabled} onCheckedChange={onToggle("notif_push_enabled")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tipos de Notificação</CardTitle>
              <CardDescription>Configure quais eventos geram notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { field: "notif_sales", label: "Vendas realizadas" },
                { field: "notif_low_stock", label: "Estoque baixo" },
                { field: "notif_new_transactions", label: "Novas transações financeiras" },
                { field: "notif_reports", label: "Relatórios gerados" },
                { field: "notif_new_employees", label: "Novos funcionários" },
                { field: "notif_goals", label: "Metas atingidas" },
                { field: "notif_security", label: "Alertas de segurança" },
                { field: "notif_backup", label: "Backup do sistema" },
              ].map((n) => (
                <div key={n.field} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label className="text-foreground">{n.label}</Label>
                  <Switch
                    checked={!!(form as any)[n.field]}
                    onCheckedChange={(v) => onToggle(n.field as keyof SettingsRow)(v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------- SISTEMA ----------------- */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-bldr-gold" />
                <div>
                  <CardTitle className="text-foreground">Configurações do Sistema</CardTitle>
                  <CardDescription>Configurações técnicas e manutenção</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Backup diário às 02:00</p>
                </div>
                <Switch checked={!!form.backup_enabled} onCheckedChange={onToggle("backup_enabled")} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Retenção de Logs</Label>
                  <p className="text-sm text-muted-foreground">Manter logs por {form.logs_retention_days ?? 90} dias</p>
                </div>
                <Badge variant="outline">{form.logs_retention_days ?? 90} dias</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">Desabilitar acesso de usuários</p>
                </div>
                <Switch checked={!!form.maintenance_mode} onCheckedChange={onToggle("maintenance_mode")} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informações do Sistema</CardTitle>
              <CardDescription>Detalhes técnicos da instalação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Versão:</span>
                    <Badge variant="default">v2.1.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Última Atualização:</span>
                    <span className="text-sm text-foreground">15/01/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uptime:</span>
                    <span className="text-sm text-foreground">15 dias, 3h</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Usuários Ativos:</span>
                    <span className="text-sm text-foreground">8/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Storage Usado:</span>
                    <span className="text-sm text-foreground">2.3GB/10GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Último Backup:</span>
                    <span className="text-sm text-foreground">Hoje 02:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
