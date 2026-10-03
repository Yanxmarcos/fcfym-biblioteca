"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
interface RecursoType {
    id_recurso: number;
    titulo: string;
    autor: string;
    nombre_categoria: string;
    nombre_formato: string;
    nombre_tipo_recurso: string;
    portada_base64?: string;
    año_publicacion?: number;
    isbn?: string;
    editorial?: string;
    descripcion?: string;
    disponible?: boolean;
}
type AccionType = "AÑADIR" | "ELIMINAR" | "ACTUALIZAR" | null;
type TipoRecursoType = "LIBRO" | "REVISTA" | "ARTICULO" | "TESIS" | null;
export default function GestionarMaterialPage() {
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [recursos, setRecursos] = useState<RecursoType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [recursoSeleccionado, setRecursoSeleccionado] = useState<number | null>(null);
    const [accionSeleccionada, setAccionSeleccionada] = useState<AccionType>(null);
    const [tipoRecursoSeleccionado, setTipoRecursoSeleccionado] = useState<TipoRecursoType>(null);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState<RecursoType[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    useEffect(() => {
        const cargarRecursos = async () => {
            try {
                const response = await fetch("/api/recurso");
                if (!response.ok) {
                    throw new Error("Error al cargar los recursos");
                }
                const data = await response.json();
                setRecursos(data.recursos || []);
            }
            catch (error) {
                console.error("Error:", error);
                setError("No se pudieron cargar los recursos");
            }
            finally {
                setLoading(false);
            }
        };
        cargarRecursos();
    }, []);
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const handleSeleccionarRecurso = (id: number) => {
        setRecursoSeleccionado(id === recursoSeleccionado ? null : id);
    };
    const handleActualizar = () => {
        if (recursoSeleccionado) {
            router.push(`/biblioteca/bibliotecario/gestionar-material/editar/${recursoSeleccionado}`);
        }
        else {
            alert("Por favor, seleccione un recurso para actualizar");
        }
    };
    const handleEliminar = () => {
        if (recursoSeleccionado) {
            router.push(`/biblioteca/bibliotecario/gestionar-material/eliminar/${recursoSeleccionado}`);
        }
        else {
            alert("Por favor, seleccione un recurso para eliminar");
        }
    };
    const handleSeleccionarAccion = (accion: AccionType) => {
        setAccionSeleccionada(accion);
        if (accion === "AÑADIR") {
            setTipoRecursoSeleccionado(null);
            setMostrarTabla(false);
            setTerminoBusqueda("");
            setResultadosBusqueda([]);
            setMostrarResultados(false);
        }
        else {
            setTipoRecursoSeleccionado(null);
            setMostrarTabla(true);
            setTerminoBusqueda("");
            setResultadosBusqueda([]);
            setMostrarResultados(false);
        }
    };
    const handleSeleccionarTipoRecurso = (tipo: TipoRecursoType) => {
        setTipoRecursoSeleccionado(tipo);
        if (accionSeleccionada === "AÑADIR") {
            router.push("/biblioteca/bibliotecario/gestionar-material/anadir");
        }
        else {
            setTerminoBusqueda("");
            setResultadosBusqueda([]);
            setMostrarResultados(false);
        }
    };
    const buscarRecursos = async (termino: string) => {
        if (!termino.trim() || termino.trim().length < 2) {
            setResultadosBusqueda([]);
            setMostrarResultados(false);
            return;
        }
        setBuscando(true);
        try {
            const tipoFiltro = tipoRecursoSeleccionado ? tipoRecursoSeleccionado.toLowerCase() : 'todos';
            const response = await fetch(`/api/recurso/buscar?q=${encodeURIComponent(termino.trim())}&tipo=${tipoFiltro}`);
            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }
            const data = await response.json();
            setResultadosBusqueda(data.recursos || []);
            setMostrarResultados(true);
        }
        catch (error) {
            console.error('Error al buscar recursos:', error);
            setError('Error al buscar recursos');
            setResultadosBusqueda([]);
            setMostrarResultados(true);
        }
        finally {
            setBuscando(false);
        }
    };
    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setTerminoBusqueda(valor);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (valor.trim().length >= 2) {
            timeoutRef.current = setTimeout(() => {
                buscarRecursos(valor);
            }, 300);
        }
        else if (valor.trim().length === 0) {
            setResultadosBusqueda([]);
            setMostrarResultados(false);
        }
    };
    const handleSeleccionarRecursoCard = (recurso: RecursoType) => {
        setRecursoSeleccionado(recurso.id_recurso);
        if (accionSeleccionada === "ELIMINAR") {
            router.push(`/biblioteca/bibliotecario/gestionar-material/eliminar/${recurso.id_recurso}`);
        }
        else if (accionSeleccionada === "ACTUALIZAR") {
            router.push(`/biblioteca/bibliotecario/gestionar-material/editar/${recurso.id_recurso}`);
        }
    };
    const handleSiguiente = () => {
        if (accionSeleccionada === "AÑADIR") {
            router.push("/biblioteca/bibliotecario/gestionar-material/anadir");
        }
        else if (accionSeleccionada === "ELIMINAR") {
            if (recursoSeleccionado) {
                router.push(`/biblioteca/bibliotecario/gestionar-material/eliminar/${recursoSeleccionado}`);
            }
            else if (tipoRecursoSeleccionado) {
                router.push("/biblioteca/bibliotecario/gestionar-material/eliminar");
            }
        }
        else if (accionSeleccionada === "ACTUALIZAR" && recursoSeleccionado) {
            router.push(`/biblioteca/bibliotecario/gestionar-material/editar/${recursoSeleccionado}`);
        }
    };
    const puedeAvanzar = () => {
        if (accionSeleccionada === "AÑADIR") {
            return tipoRecursoSeleccionado !== null;
        }
        else if (accionSeleccionada === "ELIMINAR") {
            return tipoRecursoSeleccionado !== null || recursoSeleccionado !== null;
        }
        else if (accionSeleccionada === "ACTUALIZAR") {
            return recursoSeleccionado !== null;
        }
        return false;
    };
    const getIconoTipoRecurso = (tipo: TipoRecursoType, accion: AccionType) => {
        if (!tipo || !accion)
            return null;
        const tipoLower = tipo.toLowerCase();
        const accionLower = accion.toLowerCase();
        if (accionLower === "añadir") {
            return `/icons/15._LIBRO_AGREGAR-removebg-preview (1).png`;
        }
        else if (accionLower === "eliminar") {
            return `/icons/19._LIBRO_ELIMINAR-removebg-preview (1).png`;
        }
        return null;
    };
    const resetearSeleccion = () => {
        setAccionSeleccionada(null);
        setTipoRecursoSeleccionado(null);
        setMostrarTabla(false);
        setRecursoSeleccionado(null);
        setTerminoBusqueda("");
        setResultadosBusqueda([]);
        setMostrarResultados(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">
      <div className="max-w-6xl mx-auto">

            <div className="flex justify-start mb-6">
              <button onClick={() => {
            setAccionSeleccionada(null);
            setMostrarTabla(false);
            setTerminoBusqueda("");
            setResultadosBusqueda([]);
            setMostrarResultados(false);
        }} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                <span>Volver</span>
              </button>
            </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#B26539] dark:text-white">
            GESTIONAR MATERIAL
          </h1>
        </div>

        {error && (<div className="mb-4 border-2 border-red-500 bg-red-50 p-4 text-red-700 rounded-lg">
            {error}
          </div>)}


        {!accionSeleccionada && (<div className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-8">
              ¿Qué acción deseas realizar?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button onClick={() => handleSeleccionarAccion("AÑADIR")} className="group border-2 border-[#B26539] rounded-lg p-6 hover:bg-[#B26539] hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/15._LIBRO_AGREGAR-removebg-preview (1).png" alt="Añadir recurso" width={60} height={60} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-lg font-bold text-[#B26539] group-hover:text-white">
                    AÑADIR
                  </span>
                </div>
              </button>

              <button onClick={() => handleSeleccionarAccion("ACTUALIZAR")} className="group border-2 border-[#B26539] rounded-lg p-6 hover:bg-[#B26539] hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/23._LIBRO_MODIFICAR-removebg-preview (1).png" alt="Actualizar recurso" width={60} height={60} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-lg font-bold text-[#B26539] group-hover:text-white">
                    ACTUALIZAR
                  </span>
                </div>
              </button>

              <button onClick={() => handleSeleccionarAccion("ELIMINAR")} className="group border-2 border-red-500 rounded-lg p-6 hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/19._LIBRO_ELIMINAR-removebg-preview (1).png" alt="Eliminar recurso" width={60} height={60} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-lg font-bold text-red-500 group-hover:text-white">
                    ELIMINAR
                  </span>
                </div>
              </button>
            </div>
          </div>)}


        {accionSeleccionada === "AÑADIR" && !tipoRecursoSeleccionado && (<div className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-8">
              Selecciona el tipo de recurso a añadir
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <button onClick={() => handleSeleccionarTipoRecurso("LIBRO")} className="group border-2 border-[#B26539] hover:bg-[#B26539] rounded-lg p-6 hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/15._LIBRO_AGREGAR-removebg-preview (1).png" alt="Libro" width={50} height={50} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-sm font-bold group-hover:text-white text-[#B26539]">
                    LIBRO
                  </span>
                </div>
              </button>

              <button onClick={() => handleSeleccionarTipoRecurso("REVISTA")} className="group border-2 border-[#B26539] hover:bg-[#B26539] rounded-lg p-6 hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/13._REVISTA_AGREGAR-removebg-preview.png" alt="Revista" width={50} height={50} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-sm font-bold group-hover:text-white text-[#B26539]">
                    REVISTA
                  </span>
                </div>
              </button>

              <button onClick={() => handleSeleccionarTipoRecurso("ARTICULO")} className="group border-2 border-[#B26539] hover:bg-[#B26539] rounded-lg p-6 hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/14._ARTICULO_AGREGAR-removebg-preview.png" alt="Artículo" width={50} height={50} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-sm font-bold group-hover:text-white text-[#B26539]">
                    ARTÍCULO
                  </span>
                </div>
              </button>

              <button onClick={() => handleSeleccionarTipoRecurso("TESIS")} className="group border-2 border-[#B26539] hover:bg-[#B26539] rounded-lg p-6 hover:text-white transition-all duration-200 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <Image src="/icons/9._TESIS_GUARDAR-removebg-preview.png" alt="Tesis" width={50} height={50} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"/>
                  <span className="text-sm font-bold group-hover:text-white text-[#B26539]">
                    TESIS
                  </span>
                </div>
              </button>
            </div>
          </div>)}


        {(accionSeleccionada === "ACTUALIZAR" || accionSeleccionada === "ELIMINAR") && mostrarTabla && (<div className="py-4">


            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {accionSeleccionada === "ACTUALIZAR"
                ? "Busca un recurso para actualizar"
                : "Busca un recurso para eliminar"}
            </h2>


            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <input type="search" value={terminoBusqueda} onChange={handleBusquedaChange} placeholder="Buscar por título, autor, editorial o ISBN..." className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                           bg-white text-gray-700 placeholder-gray-500 text-sm" onKeyPress={(e) => {
                if (e.key === "Enter") {
                }
            }}/>
                <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#B26539] hover:bg-[#8B4513]
                           transition-colors duration-200 rounded-r-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white"/>
                </button>
                {loading && (<div className="absolute right-14 top-3.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B26539]"></div>
                  </div>)}
              </div>
            </div>


            {mostrarResultados && (<div className="space-y-4">
                {resultadosBusqueda.length === 0 ? (<div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.935-6.086-2.455"/>
                    </svg>
                    <p className="text-gray-500 mb-2">No se encontraron resultados para <strong>"{terminoBusqueda}"</strong></p>
                    <p className="text-sm text-gray-400">Intenta con términos más generales o revisa la ortografía</p>
                  </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resultadosBusqueda.map((recurso) => (<div key={recurso.id_recurso} className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${recursoSeleccionado === recurso.id_recurso
                            ? 'border-[#B26539] bg-[#F9A232]/10'
                            : 'border-gray-200 hover:border-[#B26539]'}`} onClick={() => handleSeleccionarRecursoCard(recurso)}>
                        <div className="flex items-start space-x-4">

                          <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded overflow-hidden">
                            {recurso.portada_base64 ? (<img src={`data:image/jpeg;base64,${recurso.portada_base64}`} alt={recurso.titulo} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                </svg>
                              </div>)}
                          </div>


                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate mb-1">
                              {recurso.titulo}
                            </h3>
                            <p className="text-sm text-gray-600 truncate mb-1">
                              {recurso.autor || "Autor desconocido"}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-[#B26539] text-white rounded">
                                {recurso.nombre_tipo_recurso}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {recurso.nombre_formato}
                              </span>
                            </div>
                          </div>


                          {recursoSeleccionado === recurso.id_recurso && (<div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-[#B26539] rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                              </div>
                            </div>)}
                        </div>
                      </div>))}
                  </div>)}
              </div>)}


            {!mostrarResultados && !buscando && (<div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <p className="text-lg font-medium text-gray-700 mb-2">Busca recursos bibliográficos</p>
                <p className="text-sm text-gray-500">Escribe al menos 2 caracteres para comenzar la búsqueda</p>
                <p className="text-xs text-gray-400 mt-2">Puedes buscar por título, autor, editorial o ISBN</p>
              </div>)}
          </div>)}
      </div>
    </div>);
}
