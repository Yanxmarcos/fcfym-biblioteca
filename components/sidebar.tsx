"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { Search, BookOpen, Calendar, BookMarked, MessageSquare, Settings, Users, FileText, AlertTriangle, BarChart3, LogOut, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
interface User {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    tipo_usuario: 'estudiante' | 'profesor' | 'admin';
}
interface SidebarItem {
    title: string;
    url: string;
    icon: React.ElementType;
    roles: string[];
}
export default function LibrarySidebar() {
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    const sidebarItems: SidebarItem[] = [
        {
            title: "Búsqueda",
            url: "/busqueda",
            icon: Search,
            roles: ['estudiante', 'profesor', 'admin']
        },
        {
            title: "Mis reservas",
            url: "/mis-reservas",
            icon: Calendar,
            roles: ['estudiante', 'profesor']
        },
        {
            title: "Mi préstamo",
            url: "/mis-prestamos",
            icon: BookOpen,
            roles: ['estudiante', 'profesor']
        },
        {
            title: "Mi biblioteca",
            url: "/mi-biblioteca",
            icon: BookMarked,
            roles: ['estudiante', 'profesor']
        },
        {
            title: "Bandeja de mensajes",
            url: "/mensajes",
            icon: MessageSquare,
            roles: ['estudiante', 'profesor', 'admin']
        },
        {
            title: "Gestionar material",
            url: "/admin/gestionar-material",
            icon: Settings,
            roles: ['admin']
        },
        {
            title: "Reservas",
            url: "/admin/reservas",
            icon: Calendar,
            roles: ['admin']
        },
        {
            title: "Préstamos",
            url: "/admin/prestamos",
            icon: BookOpen,
            roles: ['admin']
        },
        {
            title: "Atender reclamos",
            url: "/admin/reclamos",
            icon: AlertTriangle,
            roles: ['admin']
        },
        {
            title: "Generar reportes",
            url: "/admin/reportes",
            icon: BarChart3,
            roles: ['admin']
        }
    ];
    const filteredItems = sidebarItems.filter(item => user && item.roles.includes(user.tipo_usuario));
    const userItems = filteredItems.filter(item => !item.url.startsWith('/admin'));
    const adminItems = filteredItems.filter(item => item.url.startsWith('/admin'));
    if (!user) {
        return null;
    }
    return (<SidebarProvider>
      <Sidebar side="right" className="border-l border-gray-200">
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-coral"/>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user.nombre} {user.apellido}
              </span>
              <span className="truncate text-xs text-gray-500 capitalize">
                {user.tipo_usuario}
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>

          {userItems.length > 0 && (<SidebarGroup>
              <SidebarGroupLabel>Mi cuenta</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (<SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} className="hover:bg-coral/10 hover:text-coral data-[state=open]:bg-coral/10 data-[state=open]:text-coral">
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4"/>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>)}


          {adminItems.length > 0 && (<>
              <Separator className="my-2"/>
              <SidebarGroup>
                <SidebarGroupLabel>Administración</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminItems.map((item) => (<SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url} className="hover:bg-coral/10 hover:text-coral data-[state=open]:bg-coral/10 data-[state=open]:text-coral">
                          <Link href={item.url} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4"/>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>)}
        </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/logout" className="flex items-center gap-3 text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4"/>
                  <span>Cerrar sesión</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>);
}
