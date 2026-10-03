"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";
export default function BibliotecarioLayout({ children, }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const buttons = [
        { id: "Búsqueda", path: "/biblioteca/bibliotecario/busqueda", icon: "/catalogo-buscar.webp" },
        { id: "Gestionar material", path: "/biblioteca/bibliotecario/gestionar-material", icon: "/agregar-a-biblioteca.webp" },
        { id: "Reservas", path: "/biblioteca/bibliotecario/reservas", icon: "/mis-reservas.webp" },
        { id: "Préstamos", path: "/biblioteca/bibliotecario/prestamos", icon: "/mis-prestamos.webp" },
        { id: "Atender reclamos", path: "/biblioteca/bibliotecario/atender-reclamos", icon: "/atencion-al-cliente.png" },
        { id: "Generar reportes", path: "/biblioteca/bibliotecario/generar-reportes", icon: "/reporte-de-negocios.png" },
    ];
    return (<div className="flex min-h-[calc(100vh-64px)]">

      <div className="w-1/6 sticky top-0 h-[100vh] bg-coral dark:bg-gray-800 p-6 border-r  dark:border-gray-700 border-coral overflow-y-auto">
        <ul className="space-y-4">
          {buttons.map((button, index) => {
            const isActive = pathname === button.path;
            return (<div key={button.id}>
                <li>
                  <button onClick={() => router.push(button.path)} className={`w-full text-left p-3 rounded-sm flex items-center transition-all duration-300 ${isActive
                    ? "bg-[#FFD859] font-bold text-black shadow-xl"
                    : "text-[#626262] font-bold bg-white hover:bg-[#F7E1C1] hover:text-black"}`}>
                    <div className="w-8 h-8 mr-3">
                      <Image src={button.icon} alt={button.id} width={80} height={80} className="object-cover"/>
                    </div>
                    {button.id}
                  </button>
                </li>
                {index === 0 && (<hr className="border-t-2 border-white my-5 w-1/4"/>)}
                {index === 3 && (<hr className="border-t-2 border-white my-5 w-1/4"/>)}
              </div>);
        })}
        </ul>
      </div>


      <main className="flex-1 p-0 overflow-y-auto">{children}</main>
    </div>);
}
