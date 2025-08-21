import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Financas } from "@/pages/Financas";
import { Vendas } from "@/pages/Vendas";
import { Servicos } from "@/pages/Servicos";
import { RH } from "@/pages/RH";
import { Relatorios } from "@/pages/Relatorios";
import { Configuracoes } from "@/pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [userRole, setUserRole] = useState<'partner' | 'user' | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard userRole={userRole} />} />
              <Route path="/financas" element={<Financas />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/estoque" element={<Servicos />} />
              <Route path="/rh" element={<RH />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/reunioes" element={<ReunioesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
