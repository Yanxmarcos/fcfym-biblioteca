"use client";
import { useState, useEffect } from "react";
import { Search, AlertCircle } from 'lucide-react';
interface Prestamo {
    id_prestamo: number;
    id_usuario: number;
    id_recurso: number;
    fecha_prestamo: string;
    fecha_devolucion_prevista: string;
    fecha_devolucion_real: string;
    estado: string;
    renovaciones: number;
    titulo: string;
    autor: string;
    editorial: string;
    anio_publicacion: number;
    isbn_issn: string;
    portada: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    tipo_usuario: string;
    dias_atraso: number;
    esta_atrasado: number;
}
interface Estadisticas {
    total_prestamos: number;
    activos: number;
    devueltos: number;
    atrasados: number;
    perdidos: number;
    vencidos: number;
}
export default function PrestamosPage() {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [estadisticas, setEstadisticas] = useState<Estadisticas>({
        total_prestamos: 0,
        activos: 0,
        devueltos: 0,
        atrasados: 0,
        perdidos: 0,
        vencidos: 0,
    });
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        cargarPrestamos();
    }, []);
    const cargarPrestamos = async (termino: string = "") => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (termino)
                params.append('busqueda', termino);
            const response = await fetch(`/api/prestamos?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Error al cargar préstamos");
            }
            const data = await response.json();
            setPrestamos(data.prestamos || []);
            setEstadisticas(data.estadisticas || {});
        }
        catch (error) {
            console.error("Error:", error);
            setError("Error al cargar los préstamos");
        }
        finally {
            setLoading(false);
        }
    };
    const handleBuscar = () => {
        cargarPrestamos(busqueda);
    };
    const handleMarcarComoFinalizado = async (idPrestamo: number) => {
        try {
            const response = await fetch('/api/prestamos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_prestamo: idPrestamo,
                    estado: 'devuelto'
                }),
            });
            if (response.ok) {
                alert('Préstamo marcado como devuelto');
                cargarPrestamos(busqueda);
            }
            else {
                throw new Error('Error al marcar como devuelto');
            }
        }
        catch (error) {
            console.error('Error:', error);
            alert('Error al marcar como devuelto');
        }
    };
    const handleNotificarUsuario = async (idPrestamo: number) => {
        try {
            const response = await fetch('/api/prestamos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_prestamo: idPrestamo,
                    estado: 'activo',
                    notificar_usuario: true
                }),
            });
            if (response.ok) {
                alert('Usuario notificado exitosamente');
            }
            else {
                throw new Error('Error al notificar usuario');
            }
        }
        catch (error) {
            console.error('Error:', error);
            alert('Error al notificar usuario');
        }
    };
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };
    if (loading) {
        return (<div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539] mb-4"></div>
          <p className="text-lg text-gray-600">Cargando préstamos...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#B26539] mb-2">GESTIÓN DE PRÉSTAMOS</h1>
          <p className="text-gray-600">Administra y supervisa todos los préstamos de la biblioteca</p>
        </div>


        {error && (<div className="mb-6 p-4 border-2 border-red-500 bg-red-50 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2"/>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>)}

        <div className="flex gap-6">

          <div className="w-64">
            <div className="bg-white border-2 border-[#B26539] p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-[#B26539] mb-4 text-center">Total de préstamos</h2>
              <div className="text-4xl font-bold text-[#B26539] text-center py-6 border-2 border-[#B26539] bg-gray-50 rounded">
                {estadisticas.total_prestamos}
              </div>
            </div>
          </div>


          <div className="flex-1">

            <div className="mb-6">
              <div className="relative">
                <input type="search" className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                           bg-white text-gray-700 placeholder-gray-500 text-sm" placeholder="Buscar préstamos por título, autor, usuario, email..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} onKeyPress={(e) => {
            if (e.key === "Enter") {
                handleBuscar();
            }
        }}/>
                <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#B26539] hover:bg-[#8B4513]
                           transition-colors duration-200 rounded-r-lg flex items-center justify-center" onClick={handleBuscar}>
                  <Search className="w-5 h-5 text-white"/>
                </button>
                {loading && (<div className="absolute right-14 top-3.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B26539]"></div>
                  </div>)}
              </div>
            </div>


            <div className="space-y-4">
              {prestamos.length === 0 ? (<div className="text-center py-16 bg-white border-2 border-[#B26539] rounded-lg">
                  <p className="text-gray-600 text-xl font-medium mb-2">No se encontraron préstamos</p>
                  <p className="text-gray-400">
                    {busqueda ? 'Intenta con otros términos de búsqueda' : 'Aún no hay préstamos registrados'}
                  </p>
                </div>) : (prestamos.map((prestamo) => (<div key={prestamo.id_prestamo} className="border-2 border-[#B26539] p-4 bg-white rounded-lg">
                    <div className="flex gap-4">

                      <div className="w-24 h-32 border border-[#B26539] bg-gray-100 flex items-center justify-center rounded">
                        {prestamo.portada ? (<img src={prestamo.portada} alt={prestamo.titulo} className="w-full h-full object-cover rounded"/>) : (<div className="text-gray-400 text-center text-sm">
                            <div className="mb-2">📚</div>
                            Imagen del libro
                          </div>)}
                      </div>


                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-[#B26539]">{prestamo.titulo}</h3>
                        <div className="text-sm text-gray-600 mb-2">
                          <p><strong>Autor(es):</strong> {prestamo.autor || 'Nombre'}</p>
                          <p><strong>Fecha de publicación:</strong> {prestamo.anio_publicacion || '2000'}</p>
                          <p><strong>Edición:</strong> {prestamo.editorial || 'Número ed.'}</p>
                          <p><strong>ISBN:</strong> {prestamo.isbn_issn || '2233-1233-12333'}</p>
                        </div>
                      </div>


                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="font-bold border-b border-[#B26539] pb-1">Fecha de entrega</div>
                            <div className="py-2">{formatearFecha(prestamo.fecha_prestamo)}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold border-b border-[#B26539] pb-1">Fecha de regreso</div>
                            <div className="py-2">{formatearFecha(prestamo.fecha_devolucion_prevista)}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold border-b border-[#B26539] pb-1">Usuario en posesión</div>
                            <div className="py-2">
                              <div className="text-sm">{prestamo.nombres} {prestamo.apellido_paterno}</div>

                            </div>
                          </div>
                        </div>


                        <div className="flex gap-2">

                          <button onClick={() => handleNotificarUsuario(prestamo.id_prestamo)} className="flex-1 border-2 border-[#F9A232] py-2 px-4 text-sm bg-[#F9A232] hover:bg-[#E8921C] text-white flex items-center justify-center rounded transition-colors">
                            💬 Notificar usuario
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>)))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
