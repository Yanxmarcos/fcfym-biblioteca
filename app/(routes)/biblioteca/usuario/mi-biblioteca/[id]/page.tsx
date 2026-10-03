"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, Copy, Trash2, AlertCircle, Monitor, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthContext } from '@/contexts/authContext';
import Image from 'next/image';
import React from "react";
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
interface BookDetails {
    id_recurso: number;
    titulo: string;
    autor?: string | null;
    editorial?: string | null;
    anio_publicacion?: number | null;
    idioma?: string | null;
    categoria?: string | null;
    num_paginas?: number | null;
    palabras_clave?: string | null;
    isbn_issn?: string | null;
    formato?: string | null;
    tipo_recurso?: string | null;
    url_archivo?: string | null;
    portada?: string | null;
    mi_porcentaje?: number;
    fecha_agregado_biblioteca?: string | null;
    descripcion?: string | null;
    edicion?: string | null;
}
declare global {
    interface Window {
        pdfjsLib: any;
    }
}
export default function BookDetailsPage() {
    const [book, setBook] = useState<BookDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [readingMode, setReadingMode] = useState(false);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const params = useParams();
    const { userData } = useAuthContext();
    const [showCiteModal, setShowCiteModal] = useState(false);
    const [citationFormat, setCitationFormat] = useState('APA 7');
    const [citationText, setCitationText] = useState('');
    const [exportBibTeX, setExportBibTeX] = useState(false);
    const [exportRIS, setExportRIS] = useState(false);
    const bookId = params.id as string;
    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!userData?.id || !bookId)
                return;
            try {
                setIsLoading(true);
                const res = await fetch(`/api/mi-biblioteca/details?userId=${userData.id}&bookId=${bookId}`);
                if (!res.ok) {
                    throw new Error('Error al obtener los detalles del libro');
                }
                const data = await res.json();
                setBook(data.book);
                setReadingProgress(data.book.mi_porcentaje || 0);
                setError(null);
            }
            catch (err) {
                setError('Error al cargar los detalles del libro');
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchBookDetails();
    }, [userData, bookId]);
    useEffect(() => {
        if (readingMode && !window.pdfjsLib) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                if (book?.url_archivo) {
                    loadPDF(book.url_archivo);
                }
            };
            document.head.appendChild(script);
        }
        else if (readingMode && window.pdfjsLib && book?.url_archivo) {
            loadPDF(book.url_archivo);
        }
    }, [readingMode, book?.url_archivo]);
    const loadPDF = async (url: string) => {
        try {
            setIsLoadingPdf(true);
            const pdf = await window.pdfjsLib.getDocument(url).promise;
            setPdfDoc(pdf);
            setTotalPages(pdf.numPages);
            setCurrentPage(1);
            renderPage(1, pdf);
        }
        catch (error) {
            console.error('Error loading PDF:', error);
            setError('Error al cargar el PDF');
        }
        finally {
            setIsLoadingPdf(false);
        }
    };
    const renderPage = async (pageNumber: number, pdf?: any) => {
        const pdfDocument = pdf || pdfDoc;
        if (!pdfDocument || !canvasRef.current)
            return;
        try {
            const page = await pdfDocument.getPage(pageNumber);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            updateReadingProgress(pageNumber);
        }
        catch (error) {
            console.error('Error rendering page:', error);
        }
    };
    const updateReadingProgress = (pageNumber: number) => {
        if (totalPages > 0) {
            const newProgress = Math.round((pageNumber / totalPages) * 100);
            setReadingProgress(newProgress);
        }
    };
    const saveProgressToDatabase = async (progress: number) => {
        if (!userData?.id || !book?.id_recurso || isUpdatingProgress)
            return;
        try {
            setIsUpdatingProgress(true);
            const response = await fetch('/api/mi-biblioteca/update-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: book.id_recurso,
                    porcentaje_lectura: progress
                })
            });
            if (!response.ok) {
                throw new Error('Error al actualizar progreso');
            }
            setBook(prev => prev ? { ...prev, mi_porcentaje: progress } : null);
        }
        catch (error) {
            console.error('Error saving progress:', error);
        }
        finally {
            setIsUpdatingProgress(false);
        }
    };
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            renderPage(newPage);
        }
    };
    const handleZoomIn = () => {
        const newScale = Math.min(scale + 0.25, 3);
        setScale(newScale);
        renderPage(currentPage);
    };
    const handleZoomOut = () => {
        const newScale = Math.max(scale - 0.25, 0.5);
        setScale(newScale);
        renderPage(currentPage);
    };
    const handleGoBack = () => {
        router.push('/biblioteca/usuario/mi-biblioteca');
    };
    const handleDownload = () => {
        if (book?.url_archivo) {
            window.open(book.url_archivo, '_blank');
        }
    };
    const handleCite = () => {
        if (!book)
            return;
        const citation = generateCitation(book, citationFormat);
        setCitationText(citation);
        setShowCiteModal(true);
    };
    const generateCitation = (recurso: BookDetails, format: string) => {
        const autor = recurso.autor || 'Autor desconocido';
        const titulo = recurso.titulo;
        const año = recurso.anio_publicacion || 'n.d.';
        const editorial = recurso.editorial || 'Editorial desconocida';
        switch (format) {
            case 'APA 7':
                return `${autor} (${año}). ${titulo}. ${editorial}.`;
            case 'MLA':
                return `${autor}. "${titulo}." ${editorial}, ${año}.`;
            case 'Chicago':
                return `${autor}. ${titulo}. ${editorial}, ${año}.`;
            case 'Harvard':
                return `${autor} ${año}, ${titulo}, ${editorial}.`;
            case 'IEEE':
                return `${autor}, "${titulo}," ${editorial}, ${año}.`;
            default:
                return `${autor} (${año}). ${titulo}. ${editorial}.`;
        }
    };
    const downloadCitation = () => {
        if (!book)
            return;
        let content = citationText;
        let filename = 'cita.txt';
        if (exportBibTeX && exportRIS) {
            const bibTeX = generateBibTeX(book);
            const ris = generateRIS(book);
            content = `CITA APA7:\n${citationText}\n\nBIBTEX:\n${bibTeX}\n\nRIS:\n${ris}`;
            filename = 'cita_completa.txt';
        }
        else if (exportBibTeX) {
            content = generateBibTeX(book);
            filename = 'cita.bib';
        }
        else if (exportRIS) {
            content = generateRIS(book);
            filename = 'cita.ris';
        }
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(citationText);
            alert('Cita copiada al portapapeles');
        }
        catch (err) {
            console.error('Error al copiar:', err);
            alert('Error al copiar la cita');
        }
    };
    const handleFormatChange = (format: string) => {
        setCitationFormat(format);
        if (book) {
            const newCitation = generateCitation(book, format);
            setCitationText(newCitation);
        }
    };
    const generateBibTeX = (recurso: BookDetails | null) => {
        if (!recurso)
            return '';
        const autor = recurso.autor || 'Autor desconocido';
        const titulo = recurso.titulo;
        const año = recurso.anio_publicacion || 'n.d.';
        const editorial = recurso.editorial || 'Editorial desconocida';
        return `@book{${autor.split(' ')[0].toLowerCase()}${año},
  author = {${autor}},
  title = {${titulo}},
  publisher = {${editorial}},
  year = {${año}}
}`;
    };
    const generateRIS = (recurso: BookDetails | null) => {
        if (!recurso)
            return '';
        const autor = recurso.autor || 'Autor desconocido';
        const titulo = recurso.titulo;
        const año = recurso.anio_publicacion || 'n.d.';
        const editorial = recurso.editorial || 'Editorial desconocida';
        return `TY  - BOOK
AU  - ${autor}
TI  - ${titulo}
PY  - ${año}
PB  - ${editorial}
ER  -`;
    };
    const handleDelete = async () => {
        if (!userData || !book)
            return;
        try {
            const res = await fetch('/api/mi-biblioteca/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: book.id_recurso
                })
            });
            if (res.ok) {
                router.push('/biblioteca/usuario/mi-biblioteca');
            }
        }
        catch (error) {
            console.error('Error removing book:', error);
        }
    };
    const toggleReadingMode = () => {
        if (readingMode) {
            saveProgressToDatabase(readingProgress);
        }
        setReadingMode(!readingMode);
    };
    if (isLoading) {
        return (<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539] mx-auto mb-4"></div>
                    <p className="text-[#B26539] font-medium">Cargando detalles...</p>
                </div>
            </div>);
    }
    if (error || !book) {
        return (<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'Libro no encontrado'}</p>
                    <button onClick={handleGoBack} className="px-6 py-3 bg-[#F9A232] hover:bg-[#E8921C] text-white font-semibold rounded-lg">
                        Volver a Mi Biblioteca
                    </button>
                </div>
            </div>);
    }
    return (<div className="min-h-screen bg-white dark:bg-gray-900">

            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button onClick={handleGoBack} className="flex items-center text-gray-600 hover:text-[#B26539] transition-colors duration-200">
                        <ArrowLeft className="w-5 h-5 mr-2"/>
                        Regresar a "Mi Biblioteca"
                    </button>
                </div>
            </div>


            {readingMode && (<div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col">

                    <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl mr-10 mb-1 font-bold text-coral truncate">MODO LECTURA</div>
                            <h2 className="text-lg font-semibold truncate">{book.titulo}</h2>
                            <div className="text-sm text-gray-300">
                                (Página {currentPage} de {totalPages})
                            </div>

                        </div>

                        <div className="flex items-center space-x-4">

                            <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Reducir zoom">
                                <ZoomOut className="w-5 h-5"/>
                            </button>
                            <span className="text-sm text-gray-300 min-w-[60px] text-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Aumentar zoom">
                                <ZoomIn className="w-5 h-5"/>
                            </button>


                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Página anterior">
                                <ChevronLeft className="w-5 h-5"/>
                            </button>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Página siguiente">
                                <ChevronRight className="w-5 h-5"/>
                            </button>


                            <button onClick={toggleReadingMode} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400 hover:text-red-300" title="Salir del modo lectura">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>


                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                            <span>Progreso de lectura: {readingProgress}%</span>
                            {isUpdatingProgress && (<span className="text-blue-400">Guardando progreso...</span>)}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-[#F9A232] h-2 rounded-full transition-all duration-300" style={{ width: `${readingProgress}%` }}></div>
                        </div>
                    </div>


                    <div className="flex-1 overflow-auto bg-gray-600 p-4" ref={containerRef}>
                        <div className="flex justify-center">
                            {isLoadingPdf ? (<div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A232] mb-4"></div>
                                    <p className="text-gray-300 ml-4">Cargando PDF...</p>
                                </div>) : (<canvas ref={canvasRef} className="shadow-lg border border-gray-500 bg-white" style={{ maxWidth: '100%', height: 'auto' }}/>)}
                        </div>
                    </div>


                    <div className="bg-gray-800 p-4 border-t border-gray-700">
                        <div className="flex items-center justify-center space-x-4">
                            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Primera
                            </button>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Anterior
                            </button>
                            <input type="number" value={currentPage} onChange={(e) => {
                const newPage = parseInt(e.target.value);
                if (!isNaN(newPage)) {
                    handlePageChange(newPage);
                }
            }} className="w-16 px-2 py-1 bg-gray-700 text-white text-center rounded border border-gray-600 focus:border-[#F9A232] focus:outline-none text-sm" min="1" max={totalPages}/>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Siguiente
                            </button>
                            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Última
                            </button>
                        </div>
                    </div>
                </div>)}


            {!readingMode && (<div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                    {book.portada ? (<img src={book.portada} alt={book.titulo} className="w-full h-full object-cover rounded-lg"/>) : (<div className="text-center text-gray-500">
                                            <div className="w-16 h-16 border-2 border-gray-400 transform rotate-45 mx-auto mb-2"></div>
                                            <p className="text-sm">Imagen del libro</p>
                                        </div>)}
                                </div>

                                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {book.titulo}
                                </h1>

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    <p><span className="font-semibold">Autor:</span> {book.autor || 'No especificado'}</p>
                                    <p><span className="font-semibold">Fecha de publicación:</span> {book.anio_publicacion || 'No especificada'}</p>
                                    <p><span className="font-semibold">Edición:</span> {book.edicion || 'No especificada'}</p>
                                    <p><span className="font-semibold">ISBN:</span> {book.isbn_issn || 'No disponible'}</p>
                                </div>
                            </div>
                        </div>


                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Tabla de contenidos</h2>
                                <div className="text-sm text-gray-700 space-y-2">
                                    <p>Introducción: materia y medición ---- El método científico ---- Unidades y medidas ---- Incertidumbre y cifras significativas -- Átomos, moléculas e iones ---- alanceo de ecuaciones químicas -- Reacciones acuosas ---- Electrolitos y no electrolitos ---- Reacciones de precipitación ---- Reacciones ácido-base -- Propiedades periódicas ---- Radio atómico e iónico ---- Energía de ionización ---- Enlace iónico ---- Enlace covalente ---- Enlace metálico ---- Geometría molecular -- Bibliografía</p>
                                </div>
                            </div>


                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <table className="w-full border-collapse border border-gray-300">
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">Tipo de recurso</td>
                                            <td className="border border-gray-300 px-4 py-2">{book.tipo_recurso || 'Libro'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">Formato</td>
                                            <td className="border border-gray-300 px-4 py-2">{book.formato || 'Digital'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">Idioma(s)</td>
                                            <td className="border border-gray-300 px-4 py-2">{book.idioma || 'No especificado'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">

                                <div className="flex gap-4 mt-6 w-full">

                                    <button className="w-full flex bg-[#3498db] text-white px-3 py-1 rounded hover:bg-[#2874a6] transition-colors" onClick={handleCite}>
                                        <div className="w-8 h-8 mr-3 mt-2">
                                            <Image src="/citar.webp" alt="Imagen de citar" width={60} height={60} className="object-cover"/>
                                        </div>
                                        <div className='pt-2 text-lg font-semibold items-center pr-2'>Citar</div>
                                    </button>
                                    <button className="flex bg-[#1abc9c] text-white px-3 py-1 rounded hover:bg-[#148f77] transition-colors">
                                        <div className="w-12 h-12 mr-3">
                                            <Image src="/descargar-archivo.webp" alt="Imagen de buscar en catálogo." width={80} height={80} className="object-cover"/>
                                        </div>
                                        <div className='pt-2 text-lg font-semibold items-center pr-2'>Descargar</div>
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="border-2 border-gray-300 rounded-lg p-4">
                                        <Monitor className="w-8 h-8 text-gray-600"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-bold text-gray-900">Modo</h3>
                                        <h3 className="text-lg font-bold text-gray-900">Lectura</h3>
                                    </div>
                                </div>

                                <button onClick={toggleReadingMode} disabled={!book.url_archivo} className="w-full py-3 bg-[#F9A232] hover:bg-[#E8921C] text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {!book.url_archivo ? 'PDF No Disponible' : 'Activar Modo Lectura'}
                                </button>
                            </div>


                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Progreso de lectura: {readingProgress}%
                                </h3>
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                    <div className="bg-[#F9A232] h-4 rounded-full transition-all duration-300" style={{ width: `${readingProgress}%` }}></div>
                                </div>
                            </div>


                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex">
                                <p className='text-justify mr-6'><span className='font-bold mr-2'>¿No desea tener el libro en su biblioteca?</span>
                                    Presione en el botón para eliminarlo  </p>
                                <button disabled title="Deshabilitado en la demo de solo lectura" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-lg border-2 border-gray-400 cursor-not-allowed transition-all duration-200">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showDeleteModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                        <div className="text-center">
                            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Confirmar eliminación
                            </h3>
                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro que deseas eliminar "{book.titulo}" de tu biblioteca?
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)}



            {showCiteModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl border-2 border-gray-300 transform transition-all duration-300">

                        <div className="flex items-center justify-between p-4 border-b bg-gray-100 rounded-t-lg">
                            <h3 className="text-lg font-bold text-gray-800">
                                CITAR: {book.titulo}
                            </h3>
                            <button onClick={() => setShowCiteModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5 text-gray-600"/>
                            </button>
                        </div>


                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                <div>
                                    <h4 className="text-base font-bold text-gray-800 mb-4">Opciones de formato:</h4>

                                    <select value={citationFormat} onChange={(e) => handleFormatChange(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="APA 7">APA 7</option>
                                        <option value="MLA">MLA</option>
                                        <option value="Chicago">Chicago</option>
                                        <option value="Harvard">Harvard</option>
                                        <option value="IEEE">IEEE</option>
                                    </select>

                                    <div className="mt-6">
                                        <h4 className="text-base font-bold text-gray-800 mb-3">Vista previa:</h4>
                                        <div className="bg-gray-50 border-2 border-gray-300 rounded-md p-4 min-h-[100px]">
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {citationText}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex justify-center">
                                            <button onClick={copyToClipboard} className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                                                Copiar al portapapeles
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <h4 className="text-base font-bold text-gray-800 mb-4">Opciones adicionales:</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-3">Exportar como:</p>

                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <div className="relative">
                                                        <input type="checkbox" checked={exportBibTeX} onChange={(e) => setExportBibTeX(e.target.checked)} className="sr-only"/>
                                                        <div className={`w-12 h-6 rounded-full border-2 transition-colors ${exportBibTeX ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}`}>
                                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${exportBibTeX ? 'translate-x-6' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">BibTeX</span>
                                                </label>

                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <div className="relative">
                                                        <input type="checkbox" checked={exportRIS} onChange={(e) => setExportRIS(e.target.checked)} className="sr-only"/>
                                                        <div className={`w-12 h-6 rounded-full border-2 transition-colors ${exportRIS ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}`}>
                                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${exportRIS ? 'translate-x-6' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">RIS</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button onClick={downloadCitation} className="w-full px-6 py-3 bg-coral text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium">
                                                Descargar Cita
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>);
}
