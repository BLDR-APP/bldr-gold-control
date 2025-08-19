import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";

interface LoginModalProps {
  onLogin: (role: 'partner' | 'user') => void;
}

export function LoginModal({ onLogin }: LoginModalProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            BLDR
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema de Gestão Empresarial
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="border-border bg-card hover:shadow-gold transition-all duration-300 cursor-pointer group"
                onClick={() => onLogin('partner')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Acesso de Sócio</CardTitle>
              <CardDescription>
                Acesso completo a todas as funcionalidades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-gold hover:bg-bldr-gold-dark text-primary-foreground font-semibold"
                size="lg"
              >
                Entrar como Sócio
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:shadow-card transition-all duration-300 cursor-pointer group"
                onClick={() => onLogin('user')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Acesso de Usuário</CardTitle>
              <CardDescription>
                Acesso limitado às funcionalidades operacionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold"
                size="lg"
              >
                Entrar como Usuário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}