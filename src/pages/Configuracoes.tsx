import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  User,
  Shield,
  Bell,
  Database,
  Mail,
  Smartphone,
  Key,
  Building2,
  Save
} from "lucide-react";

// ✅ mínimos necessários para persistir e refazer leitura
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

export function Configuracoes() {
  // ---- Estado controlado SOMENTE para os campos editáveis da empresa
  const [form, setForm] = useState({
    company_name: "BLDR",
    cnpj: "12.345.678/0001-90",
    address: "Rua Principal, 123",
    phone: "(11) 9999-8888",
    email: "contato@bldr.com.br",
    website: "www.bldr.com.br",
  });
  const [saving, setSaving] = useState(false);

  // ---- Lê a tabela `settings` (ajuste filtros conforme seu schema, se precisar)
  const settingsQuery = useSupabaseQuery<any>({
    table: "settings",
    select: "*",
    limit: 1,
    orderBy: { column: "updated_at", ascending: false },
  });

  // ---- Hidrata o formulário quando a query carregar
  useEffect(() => {
    const row = settingsQuery.data?.[0];
    if (row) {
      setForm(prev => ({
        company_name: row.company_name ?? prev.company_name,
        cnpj: row.cnpj ?? prev.cnpj,
        address: row.address ?? prev.address,
        phone: row.phone ?? prev.phone,
        email: row.email ?? prev.email,
        website: row.website ?? prev.website,
      }));
    }
  }, [settingsQuery.data]);

  const onChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

  // ---- Mantém o MESMO botão; apenas trocamos o handler para salvar de verdade
  const onSave = async () => {
    // mantém a UX atual
    alert("Salvando todas as configurações");
    try {
      setSaving(true);

      // Se tiver uma chave única (ex.: org_id), inclua aqui:
      const payload = {
        company_name: form.company_name,
        cnpj: form.cnpj,
        address: form.address,
        phone: form.phone,
        email: form.email,
        website: form.website,
        updated_at: new Date().toISOString(),
        // org_id: currentOrgId,
      };

      // upsert cria/ou atualiza a mesma linha de settings
      const { error } = await supabase
        .from("settings")
        .upsert(payload); // { onConflict: "org_id" } se você tiver campo único

      if (error) throw error;

      // Recarrega os dados para refletir em tela
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
                  <Input id="company-name" value={form.company_name} onChange={onChange("company_name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={form.cnpj} onChange={onChange("cnpj")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" value={form.address} onChange={onChange("address")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={form.phone} onChange={onChange("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email} onChange={onChange("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={form.website} onChange={onChange("website")} />
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
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Acesso de Funcionários</p>
                    <p className="text-sm text-muted-foreground">Acesso limitado às operações</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">12 usuários</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Acesso de Convidados</p>
                    <p className="text-sm text-muted-foreground">Acesso somente leitura</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">0 usuários</Badge>
                    <Switch />
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
                  { module: "Finanças", partner: true, user: false },
                  { module: "Vendas", partner: true, user: true },
                  { module: "Estoque", partner: true, user: true },
                  { module: "RH", partner: true, user: false },
                  { module: "Relatórios", partner: true, user: false },
                  { module: "Configurações", partner: true, user: false }
                ].map((perm, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-foreground">{perm.module}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Sócios</Label>
                        <Switch defaultChecked={perm.partner} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Usuários</Label>
                        <Switch defaultChecked={perm.user} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Sessões Múltiplas</Label>
                  <p className="text-sm text-muted-foreground">Permitir login em vários dispositivos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Timeout de Sessão</Label>
                  <p className="text-sm text-muted-foreground">Logout automático após inatividade</p>
                </div>
                <Badge variant="outline">30 minutos</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">Registro de todas as ações</p>
                </div>
                <Switch defaultChecked />
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
                  <Input defaultValue="8" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Validade (dias)</Label>
                  <Input defaultValue="90" type="number" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Exigir letras maiúsculas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Exigir números</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Exigir caracteres especiais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>Histórico de senhas (não repetir últimas 5)</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-bldr-gold" />
                    <div>
                      <Label className="text-foreground">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Alertas no navegador</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
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
                { type: "Vendas realizadas", enabled: true },
                { type: "Estoque baixo", enabled: true },
                { type: "Novas transações financeiras", enabled: true },
                { type: "Relatórios gerados", enabled: false },
                { type: "Novos funcionários", enabled: true },
                { type: "Metas atingidas", enabled: true },
                { type: "Alertas de segurança", enabled: true },
                { type: "Backup do sistema", enabled: false }
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label className="text-foreground">{notification.type}</Label>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Retenção de Logs</Label>
                  <p className="text-sm text-muted-foreground">Manter logs por 90 dias</p>
                </div>
                <Badge variant="outline">90 dias</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">Desabilitar acesso de usuários</p>
                </div>
                <Switch />
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
