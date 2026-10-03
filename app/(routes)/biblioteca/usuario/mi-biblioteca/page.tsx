"use client";
import { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { useAuthContext } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
interface Book {
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
}
export default function PregradoBiblioteca() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const { isAuthenticated, userData, logout } = useAuthContext();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [modalMessage, setModalMessage] = useState('');
    useEffect(() => {
        const loadBooks = async () => {
            try {
                setIsLoading(true);
                const data = await fetchMiBiblioteca();
                setBooks(Array.isArray(data) ? data : []);
                setError(null);
            }
            catch (err) {
                setError('Error al cargar la biblioteca');
                console.error(err);
                setBooks([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        if (userData?.id) {
            loadBooks();
        }
    }, [userData]);
    const fetchMiBiblioteca = async (): Promise<Book[]> => {
        if (!userData?.id)
            return [];
        try {
            const res = await fetch(`/api/mi-biblioteca/list?userId=${userData.id}`);
            if (!res.ok) {
                throw new Error('Error al obtener la biblioteca');
            }
            const responseData = await res.json();
            console.log("Response completa:", responseData);
            return responseData.miBiblioteca || [];
        }
        catch (error) {
            console.error('Error fetching library:', error);
            return [];
        }
    };
    const handleRemoveBook = async (book: Book) => {
        setBookToDelete(book);
        setModalMessage(`¿Estás seguro que deseas eliminar "${book.titulo}" de tu biblioteca?`);
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        if (!userData || !bookToDelete)
            return;
        try {
            const res = await fetch('/api/mi-biblioteca/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: bookToDelete.id_recurso
                })
            });
            if (res.ok) {
                setBooks(books.filter(book => book.id_recurso !== bookToDelete.id_recurso));
                setShowDeleteModal(false);
                setModalMessage(`"${bookToDelete.titulo}" se eliminó exitosamente de tu biblioteca`);
            }
            else {
                setModalMessage('Error al eliminar el libro de tu biblioteca');
            }
        }
        catch (error) {
            console.error('Error removing book from library:', error);
            setModalMessage('Error al eliminar el libro de tu biblioteca');
        }
        finally {
            setShowDeleteModal(false);
        }
    };
    const handleViewSummary = (book: Book) => {
        router.push(`/biblioteca/usuario/mi-biblioteca/${book.id_recurso}`);
    };
    if (isLoading) {
        return (<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539] mx-auto mb-4"></div>
                    <p className="text-[#B26539] font-medium">Cargando tu biblioteca...</p>
                </div>
            </div>);
    }
    if (error) {
        return (<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <X className="w-16 h-16 mx-auto mb-2"/>
                        <p className="text-lg font-semibold">Error al cargar biblioteca</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-[#F9A232] hover:bg-[#E8921C] text-white font-semibold rounded-lg transition-colors duration-200">
                        Reintentar
                    </button>
                </div>
            </div>);
    }
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-[#B26539] mb-6 dark:text-white">MI BIBLIOTECA</h1>

                    <div className="mb-3 w-full">
                        <div className="relative">
                            <input type="search" className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                         bg-white text-gray-700 placeholder-gray-500 text-sm" placeholder="Busca libros, revistas, artículos y tesis."/>
                            <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#B26539] hover:bg-[#8B4513]
                                         transition-colors duration-200 rounded-r-lg flex items-center justify-center">
                                <Search className="w-5 h-5 text-white"/>
                            </button>
                        </div>
                    </div>



                    <p className="text-gray-600 mb-1 dark:text-white">
                        Tienes <span className='font-bold'>{books.length} {books.length === 1 ? 'libro' : 'libros'}</span> en tu biblioteca.
                    </p>
                </div>

                {books.length > 0 ? (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {books.map((book) => (<div key={book.id_recurso} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
                                         transform hover:-translate-y-1 group border border-gray-200">
                                <div className="relative">
                                    <button disabled title="Deshabilitado en la demo de solo lectura" onClick={() => handleRemoveBook(book)} className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 cursor-not-allowed
             text-white rounded-full flex items-center justify-center z-10
             opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        <X className="w-3 h-3"/>
                                    </button>

                                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200
             rounded-t-lg flex items-center justify-center relative overflow-hidden">
                                        {book.portada ? (<img src={book.portada} alt={book.titulo} className="w-full h-full object-cover"/>) : (<>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 border-2 border-gray-400 transform rotate-45"></div>
                                                    <div className="absolute w-8 h-8 border-2 border-gray-400 transform rotate-45"></div>
                                                </div>
                                                <span className="text-gray-600 font-medium text-sm z-10 bg-white/80 px-2 py-1 rounded">
                                                    {book.titulo.substring(0, 20)}
                                                    {book.titulo.length > 20 ? "..." : ""}
                                                </span>
                                            </>)}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 h-10">
                                        {book.titulo}
                                    </h3>
                                    {book.autor && (<p className="text-xs text-gray-600 mb-2 truncate">
                                            {book.autor}
                                        </p>)}
                                    <div className="flex gap-1 mb-3">
                                        {book.categoria && (<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {book.categoria}
                                            </span>)}
                                        {book.formato && (<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                {book.formato}
                                            </span>)}
                                    </div>
                                    <button onClick={() => handleViewSummary(book)} className="w-full py-2 bg-[#F9A232] hover:bg-[#E8921C] text-white
                                                 font-semibold rounded-md transition-all duration-200 text-sm">
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>))}
                    </div>) : (<div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-12 h-12 text-gray-400"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No hay libros en tu biblioteca
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Comienza añadiendo algunos libros a tu colección personal
                        </p>
                        <button className="px-6 py-3 bg-[#F9A232] hover:bg-[#E8921C] text-white font-semibold rounded-lg transition-colors duration-200" onClick={() => router.push('/biblioteca/usuario/busqueda')}>
                            Añadir primer libro
                        </button>
                    </div>)}

                <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#F9A232] hover:bg-[#E8921C]
                             text-white rounded-full shadow-lg hover:shadow-xl
                             flex items-center justify-center transition-all duration-300
                             transform hover:-translate-y-1 z-50" title="Añadir a mi biblioteca" onClick={() => router.push('/biblioteca/usuario/busqueda')}>
                    <Plus className="w-6 h-6"/>
                </button>
            </div>

            {showDeleteModal && bookToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/80">
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
}
