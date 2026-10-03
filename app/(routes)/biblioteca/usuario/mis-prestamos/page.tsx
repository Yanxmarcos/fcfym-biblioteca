"use client";
import { useState, useEffect } from 'react';
import { Library, CircleEllipsis, CircleCheckBig, Search, Calendar, User, Clock, AlertCircle, Trash2, BookOpen, Hash, Globe, FileText, BookCopy, CalendarArrowUp, CalendarArrowDown, CalendarDays, BriefcaseBusiness, Weight, Briefcase } from 'lucide-react';
import { X, AlertTriangle, Book, ChevronDown } from 'lucide-react';
import { useAuthContext } from '@/contexts/authContext';
import { Button } from '@/components/ui/button';
interface Prestamos {
    id_prestamo: number;
    id_usuario: number;
    id_recurso: number;
    fecha_prestamo: string;
    fecha_devolucion_prevista: string;
    fecha_devolucion_real: string | null;
    estado: 'activo' | 'solicitado' | 'devuelto' | 'atrasado' | 'perdido';
    renovaciones: number;
    titulo: string;
    autor: string;
    editorial: string;
    anio_publicacion: number;
    idioma: string;
    id_categoria: number;
    num_paginas: number;
    palabras_clave: string;
    isbn_issn: string;
    id_formato: number;
    id_tipo_recurso: number;
    url_archivo: string | null;
    portada: string | null;
    categoria: string;
    formato: string;
    tipo_recurso: string;
    dias_restantes?: number;
}
export default function MisPrestamos() {
    const { isAuthenticated, userData, logout } = useAuthContext();
    const [prestamos, setPrestamos] = useState<Prestamos[]>([]);
    const [prestamosFiltradas, setPrestamosFiltradas] = useState<Prestamos[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [PrestamoToDelete, setPrestamoToDelete] = useState<Prestamos | null>(null);
    const [modalMessage, setModalMessage] = useState('');
    const problemOptions = [
        { value: 'fecha_incoherente', label: 'La fecha de inicio o devolución es incoherente' },
        { value: 'no_procesado', label: 'Mi solicitud de préstamo no fue procesada' },
        { value: 'info_incorrecta', label: 'Información incorrecta del libro o préstamo' },
        { value: 'libro_no_disponible', label: 'El libro indicado no está disponible realmente' },
        { value: 'otro', label: 'Otro problema' }
    ];
    useEffect(() => {
        if (userData?.id) {
            fetchPrestamos();
        }
    }, [userData]);
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setPrestamosFiltradas(prestamos);
        }
        else {
            const filtered = prestamos.filter(prestamo => prestamo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prestamo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prestamo.editorial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prestamo.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prestamo.tipo_recurso.toLowerCase().includes(searchTerm.toLowerCase()));
            setPrestamosFiltradas(filtered);
        }
    }, [searchTerm, prestamos]);
    const fetchPrestamos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/usuario-prestamo/listar?userId=${userData?.id}`);
            if (!response.ok) {
                throw new Error('Error al cargar los prestamos');
            }
            const data = await response.json();
            if (data.success) {
                setPrestamos(data.prestamos);
                setPrestamosFiltradas(data.prestamos);
            }
            else {
                setError(data.error || 'Error al cargar los prestamos');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const getEstadoConfig = (estado: string) => {
        switch (estado) {
            case 'activo':
                return {
                    color: 'bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-800',
                    icon: BookOpen,
                    text: 'Activo: El recurso está en tu posesión'
                };
            case 'solicitado':
                return {
                    color: 'bg-gradient-to-r from-blue-100 to-blue-50 text-yellow-800 border-yellow-200',
                    icon: BookOpen,
                    text: 'Préstamo solicitado: Espere notificación de entrega.'
                };
            case 'devuelto':
                return {
                    color: 'bg-gray-200 text-gray-700 border-gray-700',
                    icon: BookOpen,
                    text: 'Inactivo: El recurso fue devuelto a la biblioteca'
                };
            case 'atrasado':
                return {
                    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-200',
                    icon: AlertCircle,
                    text: 'Atrasado: El recurso no fue devuelto en la fecha indicada'
                };
            case 'perdido':
                return {
                    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200',
                    icon: AlertCircle,
                    text: 'Perdido: El recurso no fue entregado'
                };
            default:
                return {
                    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200',
                    icon: AlertCircle,
                    text: 'Desconocido'
                };
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-br from-white to-gray-50 px-4 pt-5 pb-3">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#B26539] mb-8 tracking-tight">MIS PRÉSTAMOS</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539]"></div>
                    </div>
                </div>
            </div>);
    }
    if (error) {
        return (<div className="min-h-screen bg-gradient-to-br from-white to-gray-50 px-4 pt-5 pb-3">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#B26539] mb-8 tracking-tight">MIS PRÉSTAMOS</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500 text-center bg-white p-8 rounded-xl shadow-lg">
                            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400"/>
                            <p className="text-lg font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            </div>);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProblem) {
            alert('Por favor selecciona un motivo del reporte');
            return;
        }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => {
            setShowModal(false);
            setShowSuccess(false);
            setSelectedProblem('');
            setAdditionalDetails('');
        }, 5000);
    };
    const handleClose = () => {
        if (!isSubmitting) {
            setShowModal(false);
            setSelectedProblem('');
            setAdditionalDetails('');
            setShowSuccess(false);
        }
    };
    const handleRemovePrestamo = async (prestamo: Prestamos) => {
        setPrestamoToDelete(prestamo);
        setModalMessage(`¿Estás seguro que deseas eliminar "${prestamo.titulo}" de sus solicitudes?`);
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        if (!userData || !PrestamoToDelete)
            return;
        try {
            const res = await fetch('/api/usuario-prestamo/eliminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: PrestamoToDelete.id_recurso
                })
            });
            if (res.ok) {
                setShowDeleteModal(false);
                setModalMessage(`"${PrestamoToDelete.titulo}" se eliminó exitosamente de tus préstamos`);
                window.location.reload();
            }
            else {
                setModalMessage('Error al eliminar el recurso de tus préstamos');
            }
        }
        catch (error) {
            console.error('Error al eliminar préstamo:', error);
            setModalMessage('Error al eliminar el recurso de tus préstamos');
        }
        finally {
            setShowDeleteModal(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-white to-gray-50 px-4 pt-5 pb-3">
            <div className="max-w-6xl mx-auto">

                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-[#B26539] mb-2 tracking-tight">MIS PRÉSTAMOS</h1>
                </div>


                <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                         bg-white text-gray-700 placeholder-gray-500 text-sm" placeholder="Busca una préstamo por título, autor, editorial, categoría o tipo de recurso..."/>
                            <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#B26539] hover:bg-[#8B4513]
                                         transition-colors duration-200 rounded-r-lg flex items-center justify-center" onClick={handleSearch}>
                                <Search className="w-5 h-5 text-white"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex space-x-2 w-full mb-5'>

                    <div className="mb-4 w-full">
                        <div className="flex bg-[#fff3eb] to-primary/10 shadow-md border rounded-lg p-4 border-l-5 border-[#B26539]">
                            <Library className='text-[#B26539] mr-1'/>
                            <p className="text-[#B26539] font-medium">
                                Total de préstamos encontrados: <span className="font-bold">{prestamos.length}</span>
                            </p>
                        </div>
                    </div>

                    <div className="mb-4 w-full">
                        <div className="flex bg-green-50 border border-green-200 rounded-lg p-4 border-l-5 border-l-[#00ae26] shadow-md">
                            <CircleCheckBig className='text-[#047f00] mr-1'/>
                            <p className="text-[#047f00] font-medium">
                                Préstamos activos: <span className="font-bold">{prestamos.filter(prestamos => prestamos.estado === 'activo').length} </span>
                            </p>
                        </div>
                    </div>

                    <div className="mb-4 w-full">
                        <div className="flex bg-[#cbe9ff] border rounded-lg p-4 border-l-5 border-[#0091f9] shadow-md">
                            <CircleEllipsis className='text-[#005b9c] mr-1'/>
                            <p className="text-[#005b9c] font-medium">
                                Préstamos solicitados: <span className="font-bold">{prestamos.filter(prestamos => prestamos.estado === 'solicitado').length} </span>
                            </p>
                        </div>
                    </div>
                </div>


                <div className="space-y-6">
                    {prestamosFiltradas.length === 0 ? (<div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <div className="text-gray-300 mb-4">
                                <BookOpen className="w-16 h-16 mx-auto"/>
                            </div>
                            <p className="text-gray-600 text-xl font-medium mb-2">No se encontraron préstamos</p>
                            <p className="text-gray-400">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no has realizado ningún préstamo'}
                            </p>
                        </div>) : (prestamosFiltradas.map((prestamo) => {
            const estadoConfig = getEstadoConfig(prestamo.estado);
            const IconoEstado = estadoConfig.icon;
            return (<div key={prestamo.id_prestamo} className={prestamo.estado === "activo" ?
                    "bg-white rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border-l-5 border-[#00ae26] mb-10"
                    : prestamo.estado === "solicitado" ?
                        "bg-white rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border-l-5 border-blue-500 mb-10"
                        : "bg-white rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border-l-5 border-gray-500 mb-10"}>

                                    <div className={`${estadoConfig.color} px-6 py-4 border-b border-opacity-20`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {prestamo.estado === "activo" ?
                    <CircleCheckBig />
                    : prestamo.estado === "solicitado" ?
                        <CircleEllipsis /> :
                        <Library />}
                                                <h2 className="text-lg font-semibold truncate">{prestamo.titulo}</h2>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">{estadoConfig.text}</span>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 flex w-full">
                                        <div className="flex flex-col lg:flex-row gap-6 w-full">

                                            <div className="lg:w-72 w-full justify-center lg:justify-start">
                                                <div className="w-auto h-auto bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                                                    {prestamo.portada ? (<img src={prestamo.portada} alt={`Portada de ${prestamo.titulo}`} className="w-72 h-auto object-cover rounded-lg"/>) : (<div className="text-center text-gray-400">
                                                            <BookOpen className="w-8 h-8 mx-auto mb-2"/>
                                                            <span className="text-xs">Sin imagen</span>
                                                        </div>)}
                                                </div>
                                            </div>


                                            <div className="flex-1 space-y-3">

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className={prestamo.estado === "activo" ?
                    "bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                    : prestamo.estado === "solicitado" ?
                        "bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
                        : "bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"}>
                                                        <CalendarArrowDown className={prestamo.estado === "activo" ?
                    "w-5 h-5 mx-auto text-green-600 mb-2"
                    : prestamo.estado === "solicitado" ?
                        "w-5 h-5 mx-auto text-blue-600 mb-2"
                        : "w-5 h-5 mx-auto text-gray-600 mb-2"}/>
                                                        <div className={prestamo.estado === "activo" ?
                    "text-sm text-green-700 font-medium"
                    : prestamo.estado === "solicitado" ?
                        "text-sm text-blue-700 font-medium"
                        : "text-sm text-gray-700 font-medium"}>Fecha de préstamo</div>
                                                        <div className={prestamo.estado === "activo" ?
                    "text-green-800 font-bold"
                    : prestamo.estado === "solicitado" ?
                        "text-blue-800 font-bold"
                        : "text-gray-800 font-bold"}>{formatearFecha(prestamo.fecha_prestamo)}</div>
                                                    </div>
                                                    <div className={prestamo.estado === "activo" ?
                    "bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                    : prestamo.estado === "solicitado" ?
                        "bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
                        : "bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"}>
                                                        <CalendarArrowUp className={prestamo.estado === "activo" ?
                    "w-5 h-5 mx-auto text-green-600 mb-2"
                    : prestamo.estado === "solicitado" ?
                        "w-5 h-5 mx-auto text-blue-600 mb-2"
                        : "w-5 h-5 mx-auto text-gray-600 mb-2"}/>
                                                        <div className={prestamo.estado === "activo" ?
                    "text-sm text-green-700 font-medium"
                    : prestamo.estado === "solicitado" ?
                        "text-sm text-blue-700 font-medium"
                        : "text-sm text-gray-700 font-medium"}>Fecha de devolución</div>
                                                        <div className={prestamo.estado === "activo" ?
                    "text-green-800 font-bold"
                    : prestamo.estado === "solicitado" ?
                        "text-blue-800 font-bold"
                        : "text-gray-800 font-bold"}>{formatearFecha(prestamo.fecha_devolucion_prevista)}</div>
                                                    </div>
                                                    <div className={prestamo.estado === "activo" ?
                    "bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                    : prestamo.estado === "solicitado" ?
                        "bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
                        : "bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"}>
                                                        <CalendarDays className={prestamo.estado === "activo" ?
                    "w-5 h-5 mx-auto text-green-600 mb-2"
                    : prestamo.estado === "solicitado" ?
                        "w-5 h-5 mx-auto text-blue-600 mb-2"
                        : "w-5 h-5 mx-auto text-gray-600 mb-2"}/>
                                                        <div className={prestamo.estado === "activo" ?
                    "text-sm text-green-700 font-medium"
                    : prestamo.estado === "solicitado" ?
                        "text-sm text-blue-700 font-medium"
                        : "text-sm text-gray-700 font-medium"}>Dias restantes con recurso</div>
                                                        <div className={prestamo.estado === "activo" ?
                    "text-green-800 font-bold"
                    : prestamo.estado === "solicitado" ?
                        "text-blue-800 font-bold"
                        : "text-gray-800 font-bold"}>
                                                            {prestamo.estado === "devuelto" ? 0 : prestamo.dias_restantes}
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                        <BookOpen className="w-5 h-5 mr-2 text-[#B26539]"/>
                                                        Detalles del recurso
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0 border border-gray-200 rounded-lg p-4 shadow-sm">

                                                        <div className="space-y-3">
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Autor(es):</span>
                                                                    <p className="text-gray-800">{prestamo.autor || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Año de publicación:</span>
                                                                    <p className="text-gray-800">{prestamo.anio_publicacion || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Editorial:</span>
                                                                    <p className="text-gray-800">{prestamo.editorial || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <BookCopy className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Tipo de recurso:</span>
                                                                    <p className="text-gray-800">{prestamo.tipo_recurso || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="space-y-3">
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <Hash className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">ISBN/ISSN:</span>
                                                                    <p className="text-gray-800">{prestamo.isbn_issn || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Páginas:</span>
                                                                    <p className="text-gray-800">{prestamo.num_paginas || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <Globe className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Idioma:</span>
                                                                    <p className="text-gray-800">{prestamo.idioma || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md border-1">
                                                                <Book className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                                <div>
                                                                    <span className="text-sm font-bold text-gray-600">Formato:</span>
                                                                    <p className="text-gray-800">{prestamo.formato || 'No especificado'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {prestamo.estado !== "devuelto" && (<div className="flex space-x-2 justify-end mr-6 mb-5">
                                            {prestamo.estado === "activo" ?
                        <Button disabled title="Deshabilitado en la demo de solo lectura" className="flex items-center space-x-2 bg-gray-400 cursor-not-allowed text-white border-0 px-6 py-2.5 rounded-lg font-semibold">
                                                    <AlertCircle className="w-5 h-5" aria-hidden="true"/>
                                                    <span>Reportar problema</span>
                                                </Button>
                        : prestamo.estado === "solicitado" ? (<>
                                                        <Button disabled title="Deshabilitado en la demo de solo lectura" className="flex items-center space-x-2 bg-gray-400 cursor-not-allowed text-white border-0 px-6 py-2.5 rounded-lg font-semibold">
                                                            <AlertCircle className="w-5 h-5" aria-hidden="true"/>
                                                            <span>Reportar problema</span>
                                                        </Button>
                                                        <Button disabled title="Deshabilitado en la demo de solo lectura" className="flex items-center space-x-2 bg-gray-400 cursor-not-allowed text-white border-0 px-6 py-2.5 rounded-lg font-semibold">
                                                            <Trash2 className="w-5 h-5" aria-hidden="true"/>
                                                            <span>Eliminar solicitud de préstamo</span>
                                                        </Button>
                                                    </>) : null}
                                        </div>)}



                                    {showModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                            <div className="bg-white rounded-xl  max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200">


                                                <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-4 rounded-t-xl">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-white/20 p-2 rounded-lg">
                                                                <AlertTriangle className="text-white" size={24}/>
                                                            </div>
                                                            <div>
                                                                <h2 className="text-xl font-bold text-white">
                                                                    Reportar un problema con el Préstamo
                                                                </h2>
                                                                <p className="text-orange-100 text-sm">
                                                                    Ayúdanos a mejorar nuestro servicio
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button onClick={handleClose} disabled={isSubmitting} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50" aria-label="Cerrar modal">
                                                            <X size={20}/>
                                                        </button>
                                                    </div>
                                                </div>


                                                <div className="p-6">
                                                    {showSuccess ? (<div className="text-center py-8">
                                                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                ¡Reporte enviado exitosamente!
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                Nuestro equipo revisará tu reporte y se pondrá en contacto contigo pronto.
                                                            </p>
                                                        </div>) : (<div className="space-y-6">

                                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                                    <Book className="text-orange-500" size={20}/>
                                                                    Datos del Préstamo (solo lectura)
                                                                </h3>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <span className="font-medium text-gray-700">a) Título del libro:</span>
                                                                        <p className="text-gray-900 mt-1">{prestamo.titulo}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-gray-700">b) Autor:</span>
                                                                        <p className="text-gray-900 mt-1">{prestamo.autor}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-gray-700">c) Fecha del préstamo:</span>
                                                                        <p className="text-gray-900 mt-1 flex items-center gap-1">
                                                                            <Calendar size={16} className="text-gray-500"/>
                                                                            {prestamo.fecha_prestamo}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-gray-700">d) ID de préstamo:</span>
                                                                        <p className="text-gray-900 mt-1">#{prestamo.id_prestamo}</p>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div key={`radio-section-${Date.now()}`}>
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                    Motivo del reporte: <span className="text-red-500">*</span> (Escoje solo uno)
                                                                </label>
                                                                <div className="space-y-2">
                                                                    {problemOptions.map((option) => (<label key={option.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                                                            <input type="radio" name="problem" value={option.value} checked={selectedProblem === option.value} onChange={(e) => setSelectedProblem(e.target.value)} className="h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500" style={{ accentColor: selectedProblem === option.value ? "#f97316" : "" }} disabled={isSubmitting}/>
                                                                            <span className="text-gray-700 text-sm leading-relaxed">
                                                                                {option.label}
                                                                            </span>
                                                                        </label>))}
                                                                </div>
                                                            </div>


                                                            <div>
                                                                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Detalles adicionales (opcional)
                                                                </label>
                                                                <textarea id="details" value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} placeholder="Escribe aquí por favor cualquier información adicional que nos ayude a resolver el problema..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors" rows={4} maxLength={500} disabled={isSubmitting}/>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {additionalDetails.length}/500 caracteres
                                                                </p>
                                                            </div>


                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-blue-800">
                                                                            <strong>Importante:</strong> Tu reporte será revisado por nuestro equipo en un plazo máximo de 24 horas.
                                                                            Te contactaremos a través de la plataforma para informarte sobre las acciones tomadas.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                                                <button type="button" onClick={handleClose} disabled={isSubmitting} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                                                                    Cancelar
                                                                </button>
                                                                <button type="button" onClick={handleSubmit} disabled={isSubmitting || !selectedProblem} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
                                                                    {isSubmitting ? (<>
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                                            Enviando...
                                                                        </>) : ('Enviar reporte')}
                                                                </button>
                                                            </div>
                                                        </div>)}
                                                </div>
                                            </div>
                                        </div>)}


                                    {showDeleteModal && PrestamoToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-red-500/20 transform transition-all duration-300">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-center text-red-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                                        Confirmar eliminación
                                                    </h3>
                                                    <p className="text-gray-700 dark:text-gray-300 text-center">
                                                        {modalMessage}
                                                    </p>
                                                    <div className="flex space-x-4 pt-4">
                                                        <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                                            Cancelar
                                                        </button>
                                                        <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)}

                                </div>);
        }))}
                </div>
            </div>
        </div>);
}
