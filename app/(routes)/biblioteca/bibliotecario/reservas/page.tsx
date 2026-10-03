"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
interface Reserva {
    id_reserva: number;
    id_usuario: number;
    id_recurso: number;
    fecha_reserva: string;
    fecha_expiracion: string;
    estado: string;
    prioridad: number;
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
    total_reservas_pendientes: number;
    en_prestamo: number;
    usuario_en_posesion: string;
}
interface Estadisticas {
    total_reservas: number;
    requieren_aprobacion: number;
    completadas: number;
    canceladas: number;
    expiradas: number;
}
export default function ReservasPage() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [estadisticas, setEstadisticas] = useState<Estadisticas>({
        total_reservas: 0,
        requieren_aprobacion: 0,
        completadas: 0,
        canceladas: 0,
        expiradas: 0,
    });
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [listaEspera, setListaEspera] = useState<any[]>([]);
    useEffect(() => {
        cargarReservas();
    }, []);
    const cargarReservas = async (termino: string = "") => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (termino)
                params.append('busqueda', termino);
            const response = await fetch(`/api/reservas?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Error al cargar reservas");
            }
            const data = await response.json();
            setReservas(data.reservas || []);
            setEstadisticas(data.estadisticas || {});
        }
        catch (error) {
            console.error("Error:", error);
            setError("Error al cargar las reservas");
        }
        finally {
            setLoading(false);
        }
    };
    const handleBuscar = () => {
        cargarReservas(busqueda);
    };
    const handleVerReservas = async (reserva: Reserva) => {
        try {
            const response = await fetch(`/api/reservas?id_recurso=${reserva.id_recurso}`);
            if (!response.ok) {
                throw new Error("Error al cargar la lista de espera");
            }
            const data = await response.json();
            setListaEspera(data.reservas || []);
            setReservaSeleccionada(reserva);
            setMostrarDetalle(true);
        }
        catch (error) {
            console.error("Error:", error);
            alert("Error al cargar la lista de espera");
        }
    };
    const handleCerrarDetalle = () => {
        setMostrarDetalle(false);
        setReservaSeleccionada(null);
        setListaEspera([]);
    };
    const handleMarcarComoEntregado = async (idReserva: number) => {
        try {
            const response = await fetch('/api/reservas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_reserva: idReserva,
                    estado: 'completada'
                }),
            });
            if (response.ok) {
                alert('Reserva marcada como entregada');
                if (reservaSeleccionada) {
                    handleVerReservas(reservaSeleccionada);
                }
            }
            else {
                throw new Error('Error al marcar como entregada');
            }
        }
        catch (error) {
            console.error('Error:', error);
            alert('Error al marcar como entregada');
        }
    };
    const handleNotificarUsuario = async (idReserva: number) => {
        try {
            const response = await fetch('/api/reservas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_reserva: idReserva,
                    estado: 'pendiente',
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
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    const getEstadoTexto = (estado: string) => {
        switch (estado) {
            case 'pendiente': return 'En espera';
            case 'completada': return 'Completada';
            case 'cancelada': return 'Cancelada';
            case 'expirada': return 'Expirada';
            default: return estado;
        }
    };
    if (loading) {
        return (<div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando reservas...</p>
      </div>);
    }
    if (mostrarDetalle && reservaSeleccionada) {
        return (<div className="max-w-7xl mx-auto p-2 bg-white min-h-screen">

        <div className="border-b-2 border-[#B26539] w-full pb-4 mb-6">
          <div className="flex items-center">
            <button onClick={handleCerrarDetalle} className="border-2 border-[#B26539] inline-flex items-center px-4 py-2 mr-4 bg-white hover:bg-[#B26539] hover:text-white transition-colors duration-200 rounded-lg font-medium">
              ← Regresar
            </button>
            <h1 className="text-xl font-bold text-[#B26539]">RESERVAS DEL MATERIAL</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div>
            <h2 className="text-lg font-bold mb-4 text-[#B26539]">Libro reservado</h2>
            <div className="flex gap-4 mb-4">
              <div className="w-32 h-40 border-2 border-[#B26539] bg-gray-100 flex items-center justify-center rounded-xl">
                {reservaSeleccionada.portada ? (<Image src={reservaSeleccionada.portada} alt={reservaSeleccionada.titulo} width={128} height={160} className="object-cover w-full h-full rounded-xl"/>) : (<div className="text-gray-400 text-center text-sm">
                    <div className="mb-2">📚</div>
                    Imagen del libro
                  </div>)}
              </div>
              <div className="flex-1 border-2 border-[#B26539] p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <h3 className="font-bold text-lg mb-2 text-[#B26539]">{reservaSeleccionada.titulo}</h3>
                <div className="text-sm mb-2">
                  <p><strong>Autor(es):</strong> {reservaSeleccionada.autor || 'N/A'}</p>
                  <p><strong>Fecha de publicación:</strong> {reservaSeleccionada.anio_publicacion}</p>
                  <p><strong>Edición:</strong> {reservaSeleccionada.editorial || 'N/A'}</p>
                  <p><strong>ISBN:</strong> {reservaSeleccionada.isbn_issn || 'N/A'}</p>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <p><strong>Descripción:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>

              </div>
            </div>
          </div>


          <div>
            <h2 className="text-lg font-bold mb-4 text-[#B26539]">Usuario en posesión actual del libro</h2>
            <div className="border-2 border-[#B26539] p-4 mb-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4 mb-4">

                <div>
                  <h3 className="font-bold text-[#B26539]">{reservaSeleccionada.usuario_en_posesion || 'Felipe Ramiro Priale'}</h3>
                  <p className="text-sm text-gray-600">Correo: ramiro@unitru.edu.pe</p>
                  <p className="text-sm text-gray-600">N° Matrícula: 1028736210</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-[#B26539] p-2 text-center rounded-lg bg-white">
                  <div className="font-bold text-[#B26539]">Fecha de préstamo</div>
                  <div>12/12/2024</div>
                </div>
                <div className="border-2 border-[#B26539] p-2 text-center rounded-lg bg-white">
                  <div className="font-bold text-[#B26539]">Fecha de entrega</div>
                  <div>01/01/2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div>
          <h2 className="text-lg font-bold mb-4 text-[#B26539]">Lista de espera: {listaEspera.length}</h2>
          <div className="border-2 border-[#B26539] rounded-xl overflow-hidden shadow-lg">

            <div className="grid grid-cols-4 border-b-2 border-[#B26539] bg-gradient-to-r from-orange-100 to-yellow-100 p-4 font-bold text-[#B26539]">
              <div>Nombre de Usuario</div>
              <div className="text-center">Fecha de Reserva</div>
              <div className="text-center">Fecha de recojo</div>
              <div className="text-center">Herramientas</div>
            </div>


            {listaEspera.map((reserva, index) => (<div key={reserva.id_reserva} className="grid grid-cols-4 border-b border-[#B26539] p-4 bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <span>{reserva.nombres} {reserva.apellido_paterno} {reserva.apellido_materno}</span>

                </div>
                <div className="text-center">{formatearFecha(reserva.fecha_reserva)}</div>
                <div className="text-center">{formatearFecha(reserva.fecha_expiracion)}</div>
                <div className="flex gap-1 justify-center">
                  <button onClick={() => handleMarcarComoEntregado(reserva.id_reserva)} className="border-2 border-green-500 px-2 py-1 text-xs bg-white hover:bg-green-500 hover:text-white transition-colors duration-200 rounded-lg font-medium">
                    Marcar como entregado
                  </button>
                  <button className="border-2 border-red-500 px-2 py-1 text-xs bg-white hover:bg-red-500 hover:text-white transition-colors duration-200 rounded-lg">
                    🗑️
                  </button>
                </div>
              </div>))}
          </div>
        </div>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto p-2 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-[#B26539] mb-8">GESTIÓN DE RESERVAS</h1>

      {error && (<div className="mb-6 p-4 border border-red-500 bg-red-50 text-red-700">
          {error}
        </div>)}

      <div className="flex gap-6 mb-8">

        <div className="flex flex-col gap-4">
          <div className="border-2 border-[#B26539] p-4 bg-white rounded-xl shadow-lg">
            <h2 className="font-bold text-lg mb-2 text-[#B26539]">Total reservas</h2>
            <div className="text-4xl font-bold text-center py-4 border-2 border-[#B26539] rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50">
              {estadisticas.total_reservas}
            </div>
          </div>

          <div className="border-2 border-[#B26539] p-4 bg-white rounded-xl shadow-lg">
            <h2 className="font-bold text-lg mb-2 text-[#B26539]">Requieren aprobación</h2>
            <div className="text-4xl font-bold text-center py-4 border-2 border-[#B26539] rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50">
              {estadisticas.requieren_aprobacion}
            </div>

          </div>
        </div>


        <div className="flex-1">
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <input type="search" placeholder="Buscar material reservado..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full px-4 py-2 border-2 border-[#B26539] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26539] focus:border-transparent" onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}/>
              {loading && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#B26539] border-t-transparent"></div>
                </div>)}
            </div>
            <button onClick={handleBuscar} className="px-6 py-2 bg-[#B26539] text-white rounded-lg hover:bg-[#8B4513] transition-colors flex items-center gap-2">
              <Search size={20}/>
              Buscar
            </button>
          </div>


          <div className="space-y-4">
            {reservas.length === 0 ? (<p className="text-gray-500 text-center py-8">
                No se encontraron reservas
              </p>) : (reservas.map((reserva) => (<div key={reserva.id_reserva} className="border-2 border-[#B26539] p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4">

                    <div className="w-24 h-32 border-2 border-[#B26539] bg-gray-100 flex items-center justify-center rounded-lg">
                      {reserva.portada ? (<Image src={reserva.portada} alt={reserva.titulo} width={96} height={128} className="object-cover w-full h-full rounded-lg"/>) : (<div className="text-gray-400 text-center text-sm">
                          <div className="mb-2">📚</div>
                          Imagen del libro
                        </div>)}
                    </div>


                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-[#B26539]">{reserva.titulo}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>Autor(es):</strong> {reserva.autor || 'N/A'}</p>
                        <p><strong>Fecha de publicación:</strong> {reserva.anio_publicacion}</p>
                        <p><strong>Edición:</strong> {reserva.editorial || 'N/A'}</p>
                        <p><strong>ISBN:</strong> {reserva.isbn_issn || 'N/A'}</p>
                      </div>
                    </div>


                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="border-2 border-[#B26539] px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 font-medium rounded-lg">
                            {getEstadoTexto(reserva.estado)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-[#B26539]">Usuario en posesión</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold border-2 border-[#B26539] py-2 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50">
                            {reserva.total_reservas_pendientes}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm mb-2">
                            {reserva.usuario_en_posesion || 'Disponible'}
                          </div>

                        </div>
                      </div>


                      <div className="text-xs text-gray-500 mb-3 border-2 border-[#B26539] p-2 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg">
                        <p><strong>Reservado por:</strong> {reserva.nombres} {reserva.apellido_paterno}</p>
                        <p><strong>Email:</strong> {reserva.email}</p>
                        <p><strong>Fecha:</strong> {formatearFecha(reserva.fecha_reserva)}</p>
                        <p><strong>Expira:</strong> {formatearFecha(reserva.fecha_expiracion)}</p>
                      </div>


                      <div className="flex gap-2">
                        <button onClick={() => handleVerReservas(reserva)} className="flex-1 border-2 border-[#B26539] py-2 px-4 text-sm bg-white hover:bg-[#B26539] hover:text-white transition-colors duration-200 flex items-center justify-center rounded-lg font-medium">
                          👁️ Ver reservas
                        </button>

                      </div>
                    </div>
                  </div>
                </div>)))}
          </div>
        </div>
      </div>
    </div>);
}
