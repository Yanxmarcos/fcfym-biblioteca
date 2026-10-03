"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
interface ReportesData {
    totalMateriales: number;
    materialesPorTipo: Array<{
        tipo: string;
        cantidad: number;
    }>;
    inventario: {
        disponibles: number;
        prestados: number;
        reservados: number;
    };
    movimientos: {
        prestamos?: number;
        devoluciones?: number;
        renovaciones?: number;
        reservas?: number;
    };
    solicitados: Array<{
        titulo: string;
        autor: string;
        solicitudes: number;
    }>;
    materialesMensuales: Array<{
        mes: string;
        disponibles: number;
        ocupados: number;
    }>;
    totalReclamos: number;
}
export default function GenerarReportesPage() {
    const [datos, setDatos] = useState<ReportesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        cargarReportes();
    }, []);
    const cargarReportes = async () => {
        try {
            setError(null);
            const response = await fetch('/api/reportes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setDatos(data);
        }
        catch (error) {
            console.error('Error al cargar reportes:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (<div className="p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-[#B26539] mb-8">REPORTES</h1>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B26539]"></div>
                </div>
            </div>);
    }
    if (error || !datos) {
        return (<div className="p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-[#B26539] mb-8">REPORTES</h1>
                <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar reportes</h3>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <Button onClick={cargarReportes} className="bg-coral hover:bg-coral-dark text-white">
                        Reintentar
                    </Button>
                </div>
            </div>);
    }
    return (<div className="p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-[#B26539] mb-8">REPORTES</h1>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                <Card className="border-2 border-gray-300 rounded-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold text-center">
                            Total de materiales bibliográficos disponibles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex  items-center justify-between mb-4">
                            <div className="text-center text-4xl font-bold text-coral ">
                                {datos.totalMateriales.toLocaleString()}
                            </div>

                        </div>


                        <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-3 text-gray-700">Materiales por tipo</h4>
                            <div className="space-y-2">
                                {datos.materialesPorTipo.map((item, index) => (<div key={index} className="flex items-center gap-3">
                                        <div className="w-16 text-xs text-gray-600 capitalize">
                                            {item.tipo}
                                        </div>
                                        <div className="flex-1 flex items-center gap-2">
                                            <div className="h-4 bg-coral rounded" style={{
                width: `${Math.max((item.cantidad / datos.totalMateriales) * 100, 5)}%`,
                minWidth: '20px'
            }}></div>
                                            <span className="text-xs text-gray-700 min-w-[30px]">
                                                {item.cantidad}
                                            </span>
                                        </div>
                                    </div>))}
                            </div>
                        </div>

                    </CardContent>
                </Card>


                <Card className="border-2 border-gray-300 rounded-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold">
                            Estado del inventario bibliográfico
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">

                            <div className="flex flex-col gap-4 w-48">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 bg-green-500 rounded" style={{ width: `${Math.max((datos.inventario.disponibles / datos.totalMateriales) * 100, 5)}%` }}></div>
                                            <span className="text-xs">{datos.inventario.disponibles}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-coral rounded"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 bg-coral rounded" style={{ width: `${Math.max((datos.inventario.prestados / datos.totalMateriales) * 100, 5)}%` }}></div>
                                            <span className="text-xs">{datos.inventario.prestados}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 bg-orange-500 rounded" style={{ width: `${Math.max((datos.inventario.reservados / datos.totalMateriales) * 100, 5)}%` }}></div>
                                            <span className="text-xs">{datos.inventario.reservados}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-sm">Disponibles ({datos.inventario.disponibles})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-coral rounded"></div>
                                    <span className="text-sm">Prestados ({datos.inventario.prestados})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span className="text-sm">Reservados ({datos.inventario.reservados})</span>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card className="border-2 border-gray-300 rounded-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Movimientos de la biblioteca
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-3 bg-coral rounded" style={{ width: `${Math.max((datos.movimientos.prestamos || 0) * 2, 20)}px` }}></div>
                                <span className="text-sm">Préstamos ({datos.movimientos.prestamos || 0})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-3 bg-green-500 rounded" style={{ width: `${Math.max((datos.movimientos.devoluciones || 0) * 2, 20)}px` }}></div>
                                <span className="text-sm">Devoluciones ({datos.movimientos.devoluciones || 0})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-3 bg-orange-500 rounded" style={{ width: `${Math.max((datos.movimientos.renovaciones || 0) * 3, 15)}px` }}></div>
                                <span className="text-sm">Renovaciones ({datos.movimientos.renovaciones || 0})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-3 bg-slate-500 rounded" style={{ width: `${Math.max((datos.movimientos.reservas || 0) * 2, 20)}px` }}></div>
                                <span className="text-sm">Reservas ({datos.movimientos.reservas || 0})</span>
                            </div>
                        </div>
                        <div className="text-right mb-4">
                            <span className="text-sm font-semibold">Últimos 30 días</span>
                        </div>

                    </CardContent>
                </Card>


                <Card className="border-2 border-gray-300 rounded-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Más solicitados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mb-4">
                            {datos.solicitados.slice(0, 3).map((item, index) => (<div key={index} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 bg-coral rounded" style={{ width: `${Math.max(item.solicitudes * 3, 20)}px` }}></div>
                                        <span className="text-xs">({item.solicitudes})</span>
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {item.titulo.substring(0, 25)}...
                                    </div>
                                </div>))}
                            {datos.solicitados.length === 0 && (<div className="text-sm text-gray-500">
                                    No hay datos disponibles
                                </div>)}
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>);
}
