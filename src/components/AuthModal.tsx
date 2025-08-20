import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  onAuthSuccess: () => void;
}

type Role = "partner" | "user" | "guest";

export function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("user"); // novo: papel escolhido no cadastro
  const [partnersCount, setPartnersCount] = useState<number | null>(null); // novo: total de sócios
  const MAX_PARTNERS = 4;

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Busca quantos "Sócio" já existem (profiles.role = 'partner')
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Requer tabela 'profiles' com coluna 'role' e permissão de count (RLS)
        const { count, error } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "partner");

        if (!cancelled) {
          if (error) {
            // Mantém usabilidade mesmo se não for possível contar
            setPartnersCount(null);
          } else {
            setPartnersCount(count ?? 0);
          }
        }
      } catch {
        if (!cancelled) setPartnersCount(null);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao BLDR",
        });
        onAuthSuccess();
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Bloqueio client-side para papel "Sócio" quando atingir 4
    if (role === "partner" && (partnersCount ?? 0) >= MAX_PARTNERS) {
      toast({
        title: "Limite de sócios atingido",
        description: "Já existem 4 contas de sócio cadastradas.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role, // novo: envia papel no metadata do usuário
          },
        },
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta",
        });
        // Opcional: atualizar contador depois de cadastrar
        try {
          const { count } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "partner");
          setPartnersCount(count ?? partnersCount);
        } catch {}
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper de estado do option "Sócio"
  const partnerDisabled = partnersCount !== null && partnersCount >= MAX_PARTNERS;
  const partnerLabel =
    partnersCount === null
      ? "Sócio (verificando…)"
      : `Sócio (${Math.min(partnersCount, MAX_PARTNERS)}/${MAX_PARTNERS})`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            BLDR
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema de Gestão Empresarial
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Entre com sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                  className="w-full bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </TabsContent>

              {/* CADASTRO */}
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* NOVO: seletor de papel (sem novos imports, usando <select>) */}
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de Conta</Label>
                  <select
                    id="role"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <option value="user">Usuário</option>
                    <option value="guest">Convidado</option>
                    <option value="partner" disabled={partnerDisabled}>
                      {partnerLabel}
                    </option>
                  </select>
                  {partnerDisabled && (
                    <p className="text-xs text-muted-foreground">
                      Limite de sócios atingido (4/4).
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSignUp}
                  disabled={loading || !email || !password || !fullName || (role === "partner" && partnerDisabled)}
                  className="w-full bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground"
                >
                  {loading ? "Cadastrando..." : "Criar Conta"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
