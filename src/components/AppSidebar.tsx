import { useState } from "react";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Building2,
  Calendar   // ← ADICIONADO
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onLogout: () => void;
}

const partnerItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Finanças", url: "/financas", icon: DollarSign },
  { title: "Vendas", url: "/vendas", icon: TrendingUp },
  { title: "Serviços", url: "/estoque", icon: Package },
  { title: "RH", url: "/rh", icon: Users },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Reuniões", url: "/reunioes", icon: Calendar }, // ← ADICIONADO
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

const userItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Vendas", url: "/vendas", icon: TrendingUp },
  { title: "Serviços", url: "/estoque", icon: Package },
];

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // For now, show all items. Later can be customized based on user profile
  const items = partnerItems;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold text-foreground">BLDR</h2>
                <p className="text-xs text-muted-foreground">
                  Sistema de Gestão
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-bldr-gold font-medium">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          linkActive 
                            ? 'bg-bldr-gold text-bldr-white font-medium' 
                            : 'text-bldr-gold'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-bldr-gold rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
