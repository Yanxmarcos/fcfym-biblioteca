"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface Reclamo {
    id: number;
    usuario_id: number;
    usuario_nombre: string;
    usuario_email: string;
    tipo_reclamo: string;
    recurso_id: number;
    recurso_titulo: string;
    recurso_portada: string;
    razon: string;
    descripcion: string;
    estado: string;
    fecha_reclamo: string;
    fecha_resolucion: string | null;
    prioridad: string;
}
export default function AtenderReclamosPage() {
    const [reclamos, setReclamos] = useState<Reclamo[]>([]);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    useEffect(() => {
        cargarReclamos();
    }, []);
    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => {
                setMensaje(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    const cargarReclamos = async () => {
        try {
            setError(null);
            setMensaje(null);
            const response = await fetch('/api/reclamos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Datos recibidos:', data);
            if (data.error) {
                throw new Error(data.error);
            }
            setReclamos(data.reclamos || []);
        }
        catch (error) {
            console.error('Error al cargar reclamos:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }
        finally {
            setLoading(false);
        }
    };
    const marcarComoResuelto = async (reclamoId: number) => {
        setProcesando(reclamoId);
        try {
            setError(null);
            setMensaje(null);
            const response = await fetch(`/api/reclamos?id=${reclamoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: 'resuelto',
                    fecha_resolucion: new Date().toISOString()
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMensaje('Reclamo marcado como resuelto exitosamente');
                await cargarReclamos();
            }
            else {
                console.error('Error al marcar reclamo como resuelto:', data);
                setError(data.error || 'Error al actualizar el reclamo');
            }
        }
        catch (error) {
            console.error('Error al marcar reclamo como resuelto:', error);
            setError('Error de conexión al actualizar el reclamo');
        }
        finally {
            setProcesando(null);
        }
    };
    const obtenerColorPrioridad = (prioridad: string) => {
        switch (prioridad) {
            case 'alta': return 'bg-red-100 text-red-800';
            case 'media': return 'bg-yellow-100 text-yellow-800';
            case 'baja': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const obtenerColorEstado = (estado: string) => {
        switch (estado) {
            case 'pendiente': return 'bg-orange-100 text-orange-800';
            case 'resuelto': return 'bg-green-100 text-green-800';
            case 'en_proceso': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const formatearHora = (fecha: string) => {
        return new Date(fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (loading) {
        return (<div className="p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-[#B26539] mb-8">Atender Reclamos</h1>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B26539]"></div>
                </div>
            </div>);
    }
    if (error) {
        return (<div className="p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-[#B26539] mb-8">Atender Reclamos</h1>
                <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar reclamos</h3>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <Button onClick={cargarReclamos} className="bg-blue-600 hover:bg-blue-700">
                        Reintentar
                    </Button>
                </div>
            </div>);
    }
    return (<div className="p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-[#B26539] mb-8">Atención de Reclamos sobre el Material Bibliográfico</h1>


            {mensaje && (<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3"/>
                        <p className="text-green-800">{mensaje}</p>
                    </div>
                </div>)}


            {error && (<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3"/>
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>)}


            <div className="mb-6">
                <div className="flex items-start gap-6">

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 min-w-[180px]">
                        <div className="text-lg font-semibold text-orange-800 mb-2">Pendientes</div>
                        <div className="text-4xl font-bold text-orange-900 text-center py-4">
                            {reclamos.filter(reclamo => reclamo.estado === 'pendiente').length}
                        </div>
                    </div>


                    <div className="flex-1 space-y-6">
                        {reclamos.filter(reclamo => reclamo.estado === 'pendiente').map((reclamo) => (<Card key={reclamo.id} className="border-l-4 border-l-orange-400">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                <div className="lg:col-span-3">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-gray-600"/>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{reclamo.usuario_nombre}</div>
                                            <div className="text-sm text-gray-600">{reclamo.usuario_email}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4"/>
                                            {formatearFecha(reclamo.fecha_reclamo)}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4"/>
                                            {formatearHora(reclamo.fecha_reclamo)}
                                        </div>
                                    </div>

                                </div>


                                <div className="lg:col-span-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-20 bg-gray-200 rounded border flex items-center justify-center flex-shrink-0">
                                            {reclamo.recurso_portada ? (<img src={reclamo.recurso_portada} alt={reclamo.recurso_titulo} className="w-full h-full object-cover rounded"/>) : (<FileText className="h-8 w-8 text-gray-400"/>)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-2">{reclamo.recurso_titulo}</h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div>ID: {reclamo.recurso_id}</div>
                                                <div>Tipo: {reclamo.tipo_reclamo}</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className="lg:col-span-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge className={obtenerColorPrioridad(reclamo.prioridad)}>
                                            {reclamo.prioridad.charAt(0).toUpperCase() + reclamo.prioridad.slice(1)} Prioridad
                                        </Badge>
                                        <Badge className={obtenerColorEstado(reclamo.estado)}>
                                            {reclamo.estado.charAt(0).toUpperCase() + reclamo.estado.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="mb-4">
                                        <div className="font-semibold text-gray-900 mb-2">
                                            Razón: {reclamo.razon}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <strong>Detalles adicionales:</strong>
                                        </div>
                                        <div className="mt-2 p-3 bg-gray-50 rounded border max-h-24 overflow-y-auto text-sm text-gray-700">
                                            {reclamo.descripcion}
                                        </div>
                                    </div>

                                    <Button onClick={() => marcarComoResuelto(reclamo.id)} disabled={procesando === reclamo.id} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                        {procesando === reclamo.id ? (<>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Procesando...
                                            </>) : (<>
                                                <CheckCircle className="h-4 w-4 mr-2"/>
                                                Marcar como resuelto
                                            </>)}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>))}

                {reclamos.filter(reclamo => reclamo.estado === 'pendiente').length === 0 && (<Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CheckCircle className="h-12 w-12 text-green-500 mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No hay reclamos pendientes
                            </h3>
                            <p className="text-gray-600 text-center">
                                Todos los reclamos han sido atendidos. ¡Excelente trabajo!
                            </p>
                        </CardContent>
                    </Card>)}
                    </div>
                </div>
            </div>
        </div>);
}
