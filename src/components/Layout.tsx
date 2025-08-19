import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { LoginModal } from "@/components/LoginModal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'partner' | 'user' | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('bldr-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserRole(userData.role);
    }
  }, []);

  const handleLogin = (role: 'partner' | 'user') => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('bldr-user', JSON.stringify({ role, loginTime: Date.now() }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('bldr-user');
  };

  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar userRole={userRole} onLogout={handleLogout} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-foreground" />
              <div className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                BLDR
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {userRole === 'partner' ? 'Sócio' : 'Usuário'}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sair
              </button>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}