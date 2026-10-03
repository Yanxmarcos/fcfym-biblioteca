"use client";
import { useState, useEffect, useRef } from "react";
import { Search, User, Book, Mail, Phone, MapPin, Calendar, Hash, Eye, AlertTriangle, Clock, Bookmark, Users, CheckCircle, XCircle } from 'lucide-react';
import Image from "next/image";
interface Usuario {
    id: number;
    email: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    tipo_usuario: string;
    numero_matricula: string;
    dni: string;
    telefono: string;
    domicilio: string;
    activo: boolean;
    fecha_creacion: string;
    prestamos_activos: number;
    reservas_activas: number;
    recursos_biblioteca: number;
    reclamos: number;
}
interface Recurso {
    id_recurso: number;
    titulo: string;
    autor: string;
    editorial: string;
    anio_publicacion: number;
    idioma: string;
    num_paginas: number;
    palabras_clave: string;
    isbn_issn: string;
    url_archivo: string;
    portada: string;
    nombre_categoria: string;
    nombre_formato: string;
    nombre_tipo_recurso: string;
    en_prestamo: boolean;
    usuario_prestamo: string;
    email_usuario_prestamo: string;
    reservas_activas: number;
    fecha_devolucion_prevista: string;
}
export default function BibliotecarioBusquedaPage() {
    const [searchType, setSearchType] = useState("usuarios");
    const [searchQuery, setSearchQuery] = useState("");
    const [resultados, setResultados] = useState<Usuario[] | Recurso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [totalResultados, setTotalResultados] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (searchQuery.trim().length >= 2) {
            timeoutRef.current = setTimeout(() => {
                realizarBusqueda();
            }, 300);
        }
        else {
            setResultados([]);
            setTotalResultados(0);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchQuery, searchType]);
    const realizarBusqueda = async () => {
        if (searchQuery.trim().length < 2)
            return;
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/busqueda?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
            if (!response.ok) {
                throw new Error("Error en la búsqueda");
            }
            const data = await response.json();
            if (data.success) {
                setResultados(data.resultados);
                setTotalResultados(data.total);
            }
            else {
                setError(data.message);
                setResultados([]);
                setTotalResultados(0);
            }
        }
        catch (error) {
            console.error("Error:", error);
            setError("Error al realizar la búsqueda");
            setResultados([]);
            setTotalResultados(0);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
        realizarBusqueda();
    };
    const getTipoUsuarioColor = (tipo: string) => {
        switch (tipo) {
            case 'bibliotecario': return 'bg-purple-100 text-purple-800';
            case 'docente': return 'bg-blue-100 text-blue-800';
            case 'postgrado': return 'bg-green-100 text-green-800';
            case 'pregrado': return 'bg-yellow-100 text-yellow-800';
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
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">
            <h1 className="text-2xl font-bold text-[#B26539] mb-6 dark:text-white">
                BÚSQUEDA EN LA PLATAFORMA
            </h1>

            <div className="mb-6 flex gap-6 items-end">

                <div className="w-64">
                    <label className="block text-sm font-medium text-[#B26539] mb-2">Tipo de búsqueda</label>
                    <select value={searchType} onChange={(e) => {
            setSearchType(e.target.value);
            setResultados([]);
            setTotalResultados(0);
        }} className="w-full px-4 py-3 border-2 border-[#B26539] rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                 bg-white text-gray-700 text-sm h-12">
                        <option value="usuarios">Usuarios</option>
                        <option value="recursos">Contenido bibliográfico</option>
                    </select>
                </div>


                <div className="flex-1">
                    <div className="relative">
                        <input type="search" className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                     focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                     bg-white text-gray-700 placeholder-gray-500 text-sm h-12" placeholder={`Buscar ${searchType === 'usuarios' ? 'usuarios por nombre, email, DNI o matrícula' : 'recursos por título, autor, editorial o palabras clave'}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        }}/>
                        <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#B26539] hover:bg-[#8B4513]
                                     transition-colors duration-200 rounded-r-lg flex items-center justify-center" onClick={handleSearch}>
                            <Search className="w-5 h-5 text-white"/>
                        </button>
                        {loading && (<div className="absolute right-14 top-3.5">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B26539]"></div>
                            </div>)}
                    </div>
                </div>
            </div>


            {error && (<div className="mb-6 border-2 border-red-500 bg-red-50 p-4 text-red-700 rounded-lg">
                    {error}
                </div>)}


            {(resultados.length > 0 || searchQuery.trim().length >= 2) && (<div className="mb-4">
                    <p className="text-gray-600">
                        {loading ? "Buscando..." :
                resultados.length > 0 ?
                    `Se encontraron ${totalResultados} resultado${totalResultados !== 1 ? 's' : ''} para "${searchQuery}"` :
                    searchQuery.trim().length >= 2 ? `No se encontraron resultados para "${searchQuery}"` : ""}
                    </p>
                </div>)}


            {resultados.length > 0 && (<div className="space-y-4">
                    {searchType === 'usuarios' ? (<div className="grid gap-4">
                            {(resultados as Usuario[]).map((usuario) => (<div key={usuario.id} className="border-2 border-[#B26539] rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">

                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-gray-500"/>
                                        </div>


                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-[#B26539]">
                                                    {usuario.nombres} {usuario.apellido_paterno} {usuario.apellido_materno}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoUsuarioColor(usuario.tipo_usuario)}`}>
                                                    {usuario.tipo_usuario.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4"/>
                                                    <span>{usuario.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4"/>
                                                    <span>DNI: {usuario.dni}</span>
                                                </div>
                                                {usuario.numero_matricula && (<div className="flex items-center gap-2">
                                                        <Hash className="w-4 h-4"/>
                                                        <span>Matrícula: {usuario.numero_matricula}</span>
                                                    </div>)}
                                                {usuario.telefono && (<div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4"/>
                                                        <span>{usuario.telefono}</span>
                                                    </div>)}
                                                {usuario.domicilio && (<div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4"/>
                                                        <span>{usuario.domicilio}</span>
                                                    </div>)}
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4"/>
                                                    <span>Registrado: {formatearFecha(usuario.fecha_creacion)}</span>
                                                </div>
                                            </div>


                                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <Book className="w-4 h-4 text-green-600"/>
                                                        <span className="text-xs font-medium text-green-600">Préstamos</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-green-700">{usuario.prestamos_activos}</div>
                                                </div>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <Clock className="w-4 h-4 text-blue-600"/>
                                                        <span className="text-xs font-medium text-blue-600">Reservas</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-700">{usuario.reservas_activas}</div>
                                                </div>
                                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <Bookmark className="w-4 h-4 text-purple-600"/>
                                                        <span className="text-xs font-medium text-purple-600">Mi Biblioteca</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-purple-700">{usuario.recursos_biblioteca}</div>
                                                </div>
                                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <AlertTriangle className="w-4 h-4 text-orange-600"/>
                                                        <span className="text-xs font-medium text-orange-600">Reclamos</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-orange-700">{usuario.reclamos}</div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="flex flex-col gap-2">
                                            <button className="px-4 py-2 bg-[#F9A232] hover:bg-[#E8921C] text-white text-sm rounded-lg transition-colors">
                                                Ver Perfil
                                            </button>
                                            <button className="px-4 py-2 border-2 border-[#B26539] text-[#B26539] hover:bg-[#B26539] hover:text-white text-sm rounded-lg transition-colors">
                                                Enviar Mensaje
                                            </button>
                                        </div>
                                    </div>
                                </div>))}
                        </div>) : (<div className="grid gap-4">
                            {(resultados as Recurso[]).map((recurso) => (<div key={recurso.id_recurso} className="border-2 border-[#B26539] rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">

                                        <div className="w-20 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {recurso.portada ? (<Image src={recurso.portada} alt={recurso.titulo} width={80} height={112} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                                                    <Book className="w-8 h-8 text-gray-500"/>
                                                </div>)}
                                        </div>


                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-[#B26539] line-clamp-2">
                                                    {recurso.titulo}
                                                </h3>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                    {recurso.nombre_tipo_recurso}
                                                </span>

                                                {recurso.en_prestamo ? (<span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <XCircle className="w-3 h-3"/>
                                                        En Préstamo
                                                    </span>) : (<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3"/>
                                                        Disponible
                                                    </span>)}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                                {recurso.autor && (<div>
                                                        <span className="font-semibold">Autor:</span> {recurso.autor}
                                                    </div>)}
                                                {recurso.editorial && (<div>
                                                        <span className="font-semibold">Editorial:</span> {recurso.editorial}
                                                    </div>)}
                                                {recurso.anio_publicacion && (<div>
                                                        <span className="font-semibold">Año:</span> {recurso.anio_publicacion}
                                                    </div>)}
                                                {recurso.nombre_categoria && (<div>
                                                        <span className="font-semibold">Categoría:</span> {recurso.nombre_categoria}
                                                    </div>)}
                                                {recurso.idioma && (<div>
                                                        <span className="font-semibold">Idioma:</span> {recurso.idioma}
                                                    </div>)}
                                                {recurso.nombre_formato && (<div>
                                                        <span className="font-semibold">Formato:</span> {recurso.nombre_formato}
                                                    </div>)}
                                                {recurso.num_paginas && (<div>
                                                        <span className="font-semibold">Páginas:</span> {recurso.num_paginas}
                                                    </div>)}
                                                {recurso.isbn_issn && (<div>
                                                        <span className="font-semibold">ISBN/ISSN:</span> {recurso.isbn_issn}
                                                    </div>)}
                                            </div>

                                            {recurso.palabras_clave && (<div className="text-sm mb-3">
                                                    <span className="font-semibold text-gray-700">Palabras clave:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {recurso.palabras_clave.split(',').map((palabra, index) => (<span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                                {palabra.trim()}
                                                            </span>))}
                                                    </div>
                                                </div>)}


                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {recurso.en_prestamo ? (<div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <User className="w-4 h-4 text-red-600"/>
                                                                <span className="font-semibold text-red-600">En préstamo a:</span>
                                                            </div>
                                                            <div className="pl-6 text-sm text-gray-700">
                                                                <div>{recurso.usuario_prestamo}</div>
                                                                <div className="text-xs text-gray-500">{recurso.email_usuario_prestamo}</div>
                                                                {recurso.fecha_devolucion_prevista && (<div className="text-xs text-gray-500 mt-1">
                                                                        Devolución: {new Date(recurso.fecha_devolucion_prevista).toLocaleDateString('es-ES')}
                                                                    </div>)}
                                                            </div>
                                                        </div>) : (<div className="flex items-center gap-2 text-sm text-green-600">
                                                            <CheckCircle className="w-4 h-4"/>
                                                            <span className="font-semibold">Disponible para préstamo</span>
                                                        </div>)}

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Users className="w-4 h-4 text-blue-600"/>
                                                        <span className="font-semibold text-blue-600">Reservas activas:</span>
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                            {recurso.reservas_activas}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>))}
                        </div>)}
                </div>)}


            {searchQuery.trim().length < 2 && (<div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search className="w-16 h-16 mx-auto mb-4"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Busca {searchType === 'usuarios' ? 'usuarios' : 'recursos bibliográficos'}
                    </h3>
                    <p className="text-gray-500">
                        Escribe al menos 2 caracteres para comenzar la búsqueda
                    </p>
                </div>)}
        </div>);
}
