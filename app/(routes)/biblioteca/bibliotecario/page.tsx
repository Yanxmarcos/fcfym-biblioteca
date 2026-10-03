"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function BibliotecarioPage() {
    const router = useRouter();
    useEffect(() => {
        router.push('/biblioteca/bibliotecario/busqueda');
    }, [router]);
    return (<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coral mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>);
}
