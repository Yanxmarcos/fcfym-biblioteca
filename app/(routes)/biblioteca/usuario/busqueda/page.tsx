"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from 'next/image';
import { Search, X, Plus } from 'lucide-react';
import { useAuthContext } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
interface RecursoBibliografico {
    id_recurso: number;
    titulo: string;
    autor?: string;
    editorial?: string;
    anio_publicacion?: string;
    idioma?: string;
    id_categoria?: number;
    num_paginas?: number;
    palabras_clave?: string;
    isbn_issn?: string;
    id_formato: number;
    id_tipo_recurso: number;
    url_archivo?: string;
    nombre_categoria?: string;
    nombre_formato?: string;
    nombre_tipo_recurso?: string;
    portada?: string;
}
export default function BusquedaPage() {
    const [isChecked, setIsChecked] = useState(false);
    const [searchResults, setSearchResults] = useState<RecursoBibliografico[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState(false);
    const { userData } = useAuthContext();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showFormatModal, setShowFormatModal] = useState(false);
    const [currentBook, setCurrentBook] = useState<RecursoBibliografico | null>(null);
    const [modalMessage, setModalMessage] = useState('');
    const router = useRouter();
    const [booksInLibrary, setBooksInLibrary] = useState<number[]>([]);
    const [showCiteModal, setShowCiteModal] = useState(false);
    const [citationFormat, setCitationFormat] = useState('APA 7');
    const [citationText, setCitationText] = useState('');
    const [exportBibTeX, setExportBibTeX] = useState(false);
    const [exportRIS, setExportRIS] = useState(false);
    const [booksInReserves, setBooksInReserves] = useState<number[]>([]);
    const [booksInLoans, setBooksInLoans] = useState<number[]>([]);
    const [showReserveSuccessModal, setShowReserveSuccessModal] = useState(false);
    const [showLoanSuccessModal, setShowLoanSuccessModal] = useState(false);
    const [showReserveErrorModal, setShowReserveErrorModal] = useState(false);
    const [showLoanErrorModal, setShowLoanErrorModal] = useState(false);
    const [expandedBooks, setExpandedBooks] = useState<Record<number, boolean>>({});
    const toggleBookExpansion = (bookId: number) => {
        setExpandedBooks(prev => ({
            ...prev,
            [bookId]: !prev[bookId]
        }));
    };
    const contenidoCompleto = "Introducción: materia y medición ---- El método científico ---- Unidades y medidas ---- Incertidumbre y cifras significativas -- Átomos, moléculas e iones ---- Estructura atómica ---- Número atómico y masa atómica ---- Iones y compuestos iónicos ---- Nomenclatura química -- Estequiometría: cálculos con fórmulas químicas ---- Leyes de las combinaciones químicas ---- El concepto de mol ---- Fórmulas empíricas y moleculares ---- Balanceo de ecuaciones químicas -- Reacciones acuosas ---- Electrolitos y no electrolitos ---- Reacciones de precipitación ---- Reacciones ácido-base ---- Reacciones redox -- Termoquímica ---- Energía y cambios químicos ---- Entalpía y calor de reacción ---- Leyes de la termodinámica ---- Entropía y espontaneidad -- Estructura electrónica de los átomos ---- Teoría cuántica y orbitales atómicos ---- Configuración electrónica ---- Principio de exclusión de Pauli ---- Tabla periódica y niveles de energía -- Propiedades periódicas ---- Radio atómico e iónico ---- Energía de ionización ---- Afinidad electrónica ---- Electronegatividad -- Enlaces químicos ---- Enlace iónico ---- Enlace covalente ---- Enlace metálico ---- Geometría molecular -- Bibliografía";
    const contenidoReducido = contenidoCompleto.split('----').slice(0, 2).join('----') + '...';
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert("Por favor ingresa un término de búsqueda");
            return;
        }
        setHasSearched(true);
        setIsLoading(true);
        try {
            const response = await fetch(`/api/pregrado-busqueda?query=${encodeURIComponent(searchQuery)}&advanced=${isChecked}`);
            const data = await response.json();
            setSearchResults(data.recursos || []);
        }
        catch (error) {
            console.error("Error en la búsqueda:", error);
            setSearchResults([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAddToLibrary = async (recurso: RecursoBibliografico) => {
        setCurrentBook(recurso);
        if (!userData) {
            setModalMessage("Debes iniciar sesión para añadir libros a tu biblioteca");
            setShowLoginModal(true);
            return;
        }
        if (recurso.nombre_formato !== 'Digital PDF' && recurso.nombre_formato !== 'Digital EPUB' && !recurso.url_archivo) {
            setModalMessage("Solo se pueden añadir recursos digitales a tu biblioteca");
            setShowFormatModal(true);
            return;
        }
        try {
            const response = await fetch('/api/mi-biblioteca/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: recurso.id_recurso
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setModalMessage(`"${recurso.titulo}" se añadió exitosamente a tu biblioteca`);
                setShowSuccessModal(true);
                setBooksInLibrary(prev => [...prev, recurso.id_recurso]);
            }
            else {
                setModalMessage(data.message || 'Error al añadir el libro a tu biblioteca');
                setShowErrorModal(true);
            }
        }
        catch (error) {
            console.error('Error adding book to library:', error);
            setModalMessage('Error al añadir el libro a tu biblioteca');
            setShowErrorModal(true);
        }
    };
    const fetchUserLibrary = async () => {
        if (!userData?.id)
            return;
        try {
            const response = await fetch(`/api/mi-biblioteca/list?userId=${userData.id}`);
            const data = await response.json();
            if (response.ok && data.miBiblioteca) {
                const bookIds = data.miBiblioteca.map((book: any) => book.id_recurso);
                setBooksInLibrary(bookIds);
            }
        }
        catch (error) {
            console.error('Error fetching user library:', error);
        }
    };
    useEffect(() => {
        if (userData) {
            fetchUserLibrary();
            fetchUserReserves();
            fetchUserLoans();
        }
    }, [userData]);
    const generateCitation = (recurso: RecursoBibliografico, format: string) => {
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
    const handleCite = (recurso: RecursoBibliografico) => {
        setCurrentBook(recurso);
        const citation = generateCitation(recurso, citationFormat);
        setCitationText(citation);
        setShowCiteModal(true);
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
    const downloadCitation = () => {
        if (!currentBook)
            return;
        let content = citationText;
        let filename = 'cita.txt';
        if (exportBibTeX && exportRIS) {
            const bibTeX = generateBibTeX(currentBook);
            const ris = generateRIS(currentBook);
            content = `CITA APA7:\n${citationText}\n\nBIBTEX:\n${bibTeX}\n\nRIS:\n${ris}`;
            filename = 'cita_completa.txt';
        }
        else if (exportBibTeX) {
            content = generateBibTeX(currentBook);
            filename = 'cita.bib';
        }
        else if (exportRIS) {
            content = generateRIS(currentBook);
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
    const generateBibTeX = (recurso: RecursoBibliografico | null) => {
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
    const generateRIS = (recurso: RecursoBibliografico | null) => {
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
    const handleFormatChange = (format: string) => {
        setCitationFormat(format);
        if (currentBook) {
            const newCitation = generateCitation(currentBook, format);
            setCitationText(newCitation);
        }
    };
    const handleAddToReserves = async (recurso: RecursoBibliografico) => {
        setCurrentBook(recurso);
        if (!userData) {
            setModalMessage("Debes iniciar sesión para reservar libros");
            setShowLoginModal(true);
            return;
        }
        try {
            const response = await fetch('/api/usuario-reservas/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: recurso.id_recurso
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setModalMessage(`"${recurso.titulo}" se reservó exitosamente`);
                setShowReserveSuccessModal(true);
                setBooksInReserves(prev => [...prev, recurso.id_recurso]);
            }
            else {
                setModalMessage(data.message || 'Error al reservar el libro');
                setShowReserveErrorModal(true);
            }
        }
        catch (error) {
            console.error('Error reserving book:', error);
            setModalMessage('Error al reservar el libro');
            setShowReserveErrorModal(true);
        }
    };
    const handleAddToLoans = async (recurso: RecursoBibliografico) => {
        setCurrentBook(recurso);
        if (!userData) {
            setModalMessage("Debes iniciar sesión para solicitar préstamos");
            setShowLoginModal(true);
            return;
        }
        try {
            const response = await fetch('/api/usuario-prestamo/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userData.id,
                    id_recurso: recurso.id_recurso
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setModalMessage(`"${recurso.titulo}" - préstamo solicitado exitosamente`);
                setShowLoanSuccessModal(true);
                setBooksInLoans(prev => [...prev, recurso.id_recurso]);
            }
            else {
                setModalMessage(data.message || 'Error al solicitar el préstamo');
                setShowLoanErrorModal(true);
            }
        }
        catch (error) {
            console.error('Error requesting loan:', error);
            setModalMessage('Error al solicitar el préstamo');
            setShowLoanErrorModal(true);
        }
    };
    const fetchUserReserves = async () => {
        if (!userData?.id)
            return;
        try {
            const response = await fetch(`/api/usuario-reservas/listarIDS?userId=${userData.id}`);
            const data = await response.json();
            if (response.ok && data.reservas) {
                const reserveIds = data.reservas.map((reserve: any) => reserve.id_recurso);
                setBooksInReserves(reserveIds);
            }
        }
        catch (error) {
            console.error('Error fetching user reserves:', error);
        }
    };
    const fetchUserLoans = async () => {
        if (!userData?.id)
            return;
        try {
            const response = await fetch(`/api/usuario-prestamo/listarIDS?userId=${userData.id}`);
            const data = await response.json();
            if (response.ok && data.prestamos) {
                const loanIds = data.prestamos.map((loan: any) => loan.id_recurso);
                setBooksInLoans(loanIds);
            }
        }
        catch (error) {
            console.error('Error fetching user loans:', error);
        }
    };
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">
            <h1 className="text-2xl font-bold text-[#B26539] mb-6 dark:text-white">
                BÚSQUEDA DE RECURSO BIBLIOGRÁFICO
            </h1>

            <div className="mb-3 w-full">
                <div className="relative flex-1">
                    <input type="search" className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                             bg-white text-gray-700 placeholder-gray-500 text-sm" placeholder="Busca libros, revistas, artículos y tesis." value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
            setHasSearched(false);
        }} onKeyPress={(e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        }}/>

                    <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-[#B26539] hover:bg-[#8B4513]
                                             transition-colors duration-200 rounded-r-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-white"/>
                    </button>
                </div>
            </div>


            <div className={`transition-all duration-500 ease-in-out mb-4 ${isChecked ? "flex flex-col" : ""}`}>
                <div className={`${isChecked ? "" : "flex justify-between items-center"}`}>

                    <div className="flex items-center">
                        <label className="flex cursor-pointer select-none items-center">
                            <div className="relative">
                                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="sr-only"/>
                                <div className={` border-2 border-[#B26539] block h-8 w-14 rounded-full transition-colors ${isChecked ? "bg-coral" : "bg-[#E5E7EB]"}`}></div>
                                <div className={`border-2 border-[#B26539] dot absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${isChecked ? "translate-x-6 left-1" : "left-1"}`}></div>
                            </div>
                        </label>
                        <label htmlFor="advanced" className="mx-3 text-black dark:text-gray-300">
                            Búsqueda avanzada
                        </label>
                    </div>

                    {!isChecked && (<button className="px-8 py-3 bg-[#F9A232] hover:bg-[#E8921C] text-white font-semibold
                                     rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                                     transform hover:-translate-y-0.5" onClick={handleSearch}>
                            Buscar
                        </button>)}
                </div>


                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${isChecked
            ? "max-h-[500px] opacity-100 mt-4 w-full"
            : "max-h-0 opacity-0 w-full"}`}>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Orientado a carrera</label>
                        <select className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                             bg-white text-gray-700 placeholder-gray-500 text-sm" defaultValue="Seleccione">
                            <option disabled>Seleccione</option>
                            <option>Matemática</option>
                            <option>Informática</option>
                            <option>Estadística</option>
                            <option>Física</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                        <select className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                             bg-white text-gray-700 placeholder-gray-500 text-sm" defaultValue="Seleccione">
                            <option disabled>Seleccione</option>
                            <option>Español</option>
                            <option>Inglés</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Autor(es)</label>
                        <input type="text" placeholder="Ingrese autor o autores..." className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                             bg-white text-gray-700 placeholder-gray-500 text-sm" onKeyDown={(e) => {
            const allowedKeys = [
                'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete',
                ',', '.', "'", '-', ' '
            ];
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/.test(e.key) &&
                !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                        <input type="text" placeholder="Ingrese ISBN..." className="w-full px-4 py-3 pr-12 border-2 border-[#B26539] rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-[#F9A232] focus:border-[#F9A232]
                                             bg-white text-gray-700 placeholder-gray-500 text-sm" onKeyDown={(e) => {
            const allowedKeys = [
                'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '-'
            ];
            if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }} onPaste={(e) => {
            const pasteData = e.clipboardData.getData('text');
            if (!/^[0-9-]*$/.test(pasteData)) {
                e.preventDefault();
            }
        }}/>
                    </div>
                </div>

                {isChecked && (<div className="flex justify-end mt-4">
                        <button className="px-8 py-3 bg-[#F9A232] hover:bg-[#E8921C] text-white font-semibold
                                     rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                                     transform hover:-translate-y-0.5" onClick={handleSearch}>
                            Buscar
                        </button>
                    </div>)}

                <hr className="border-t-3 border-coral my-4 dark:border-gray-700 transition-all duration-500 ease-in-out w-full"/>
            </div>



            <div className="mt-8">
                {isLoading ? (<div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
                    </div>) : searchResults.length > 0 ? (<div className="flex gap-6">

                        <div className="w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-lg border">

                                <div className="p-4 border-b bg-[#abb2b9] rounded-t">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {searchResults.length} Resultados
                                    </h3>
                                </div>


                                <div className="p-4">
                                    <h4 className="text-lg font-bold text-gray-800 mb-4">Filtros</h4>


                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de recurso:
                                        </label>
                                        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                                            <option disabled>Seleccione</option>
                                            <option>Libro</option>
                                            <option>Revista</option>
                                            <option>Artículo</option>
                                            <option>Tesis</option>
                                        </select>
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Formato de recurso:
                                        </label>
                                        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                                            <option disabled>Seleccione</option>
                                            <option>Digital PDF</option>
                                            <option>Digital EPUB</option>
                                            <option>Físico</option>
                                        </select>
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Año de publicación:
                                        </label>
                                        <label className="block text-sm text-gray-700 mb-2">
                                            Ingrese el rango:
                                        </label>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Desde" className="w-full p-2 border border-gray-300 rounded-md text-sm" min="1500" max="2025"/>

                                            <input type="number" placeholder="Hasta" className="w-full p-2 border border-gray-300 rounded-md text-sm" min="1500" max="2025"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex-1">
                            <div className="space-y-6">
                                {searchResults.map((recurso: RecursoBibliografico) => (<div key={recurso.id_recurso} className="bg-white rounded-lg shadow-lg overflow-hidden border-3">
                                        <div className="p-6">
                                            <div className="flex gap-6">

                                                <div className="w-32 h-40 bg-gray-100 rounded border-2 border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                    {recurso.portada ? (<img src={recurso.portada} alt={`Portada de ${recurso.titulo}`} className="w-full h-full object-cover"/>) : (<div className="text-gray-400 text-center">
                                                            <div className="w-16 h-16 mx-auto mb-2">
                                                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                                                    <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="2"/>
                                                                    <path d="M8 10L16 14M16 10L8 14" stroke="currentColor" strokeWidth="2"/>
                                                                </svg>
                                                            </div>
                                                            <span className="text-xs">Imagen del libro</span>
                                                        </div>)}
                                                </div>


                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{recurso.titulo}</h3>

                                                    <div className="mb-4 border p-2">
                                                        <p className="text-gray-700 mb-1 border-b pb-1">
                                                            <span className="font-semibold">Autor(es):</span> {recurso.autor || 'No especificado'}
                                                        </p>
                                                        <p className="text-gray-700 mb-1 border-b pb-1">
                                                            <span className="font-semibold">Fecha de publicación:</span> {recurso.anio_publicacion || 'No especificado'}
                                                        </p>
                                                        <p className="text-gray-700 mb-1 border-b pb-1">
                                                            <span className="font-semibold">Edición:</span> {recurso.editorial || 'No especificado'}
                                                        </p>
                                                        <p className="text-gray-700 mb-1 border-b pb-1">
                                                            <span className="font-semibold">ISBN:</span> 2233-1233-12333
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Nº Páginas:</span> 180
                                                        </p>
                                                    </div>


                                                    <div className="mb-4">
                                                        <h4 className="font-semibold text-gray-800 mb-2">Tabla de contenidos</h4>
                                                        <p className="text-sm text-gray-600 text-justify">
                                                            {expandedBooks[recurso.id_recurso] ? contenidoCompleto : contenidoReducido}
                                                        </p>
                                                        <button onClick={() => toggleBookExpansion(recurso.id_recurso)} className="text-blue-600 text-sm hover:underline flex items-center">
                                                            {expandedBooks[recurso.id_recurso] ? 'Ver menos ▲' : 'Ver más ▼'}
                                                        </button>
                                                    </div>


                                                    <div className="mb-4 border p-2">
                                                        <div className="grid grid-cols-4 gap-4 text-sm">
                                                            <div>
                                                                <div className="font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-1">
                                                                    Tipo de recurso
                                                                </div>
                                                                <div className="text-gray-600">{recurso.nombre_tipo_recurso || 'Libro'}</div>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-1">
                                                                    Formato
                                                                </div>
                                                                <div className="text-gray-600">{recurso.nombre_formato || 'Digital'}</div>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-1">
                                                                    Idioma(s)
                                                                </div>
                                                                <div className="text-gray-600">{recurso.idioma}</div>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-1">
                                                                    Estado
                                                                </div>
                                                                <div className="text-gray-600">
                                                                    {recurso.nombre_formato === 'Digital PDF' || recurso.nombre_formato === 'Digital EPUB' || recurso.id_tipo_recurso === 2 ? 'Disponible' : 'No disponible'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="flex gap-3">

                                                        {recurso.nombre_formato === 'Digital PDF' || recurso.nombre_formato === 'Digital EPUB' ? (<>
                                                                <button disabled={!booksInLibrary.includes(recurso.id_recurso)} title={!booksInLibrary.includes(recurso.id_recurso) ? "Deshabilitado en la demo de solo lectura" : undefined} className={`flex ${booksInLibrary.includes(recurso.id_recurso) ? 'bg-coral hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-3 py-1 rounded transition-colors`} onClick={booksInLibrary.includes(recurso.id_recurso) ? () => { router.push('/biblioteca/usuario/mi-biblioteca'); } : () => handleAddToLibrary(recurso)}>
                                                                    <div className="w-12 h-12 mr-3">
                                                                        <Image src={booksInLibrary.includes(recurso.id_recurso) ? "/mi-biblioteca.webp" : "/agregar-a-biblioteca.webp"} alt={booksInLibrary.includes(recurso.id_recurso) ? "Libro en biblioteca" : "Añadir a biblioteca"} width={80} height={80} className="object-cover"/>
                                                                    </div>
                                                                    <div className='pt-2 text-lg font-semibold items-center pr-2'>
                                                                        {booksInLibrary.includes(recurso.id_recurso) ? 'Está en mi biblioteca' : 'Añadir a mi biblioteca'}
                                                                    </div>
                                                                </button>
                                                                <button className="flex bg-[#1abc9c] text-white px-3 py-1 rounded hover:bg-[#148f77] transition-colors">
                                                                    <div className="w-12 h-12 mr-3">
                                                                        <Image src="/descargar-archivo.webp" alt="Imagen de buscar en catálogo." width={80} height={80} className="object-cover"/>
                                                                    </div>
                                                                    <div className='pt-2 text-lg font-semibold items-center pr-2'>Descargar</div>
                                                                </button>
                                                            </>) : (recurso.id_tipo_recurso === 2 ? (<>

                                                                <button disabled={!booksInLoans.includes(recurso.id_recurso)} title={!booksInLoans.includes(recurso.id_recurso) ? "Deshabilitado en la demo de solo lectura" : undefined} className={`flex ${booksInLoans.includes(recurso.id_recurso) ? 'bg-coral hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-3 py-1 rounded transition-colors`} onClick={booksInLoans.includes(recurso.id_recurso) ? () => { router.push('/biblioteca/usuario/mis-prestamos'); } : () => handleAddToLoans(recurso)}>
                                                                    <div className="w-12 h-12 mr-3">
                                                                        <Image src={booksInLoans.includes(recurso.id_recurso) ? "/mi-biblioteca.webp" : "/solicitar-prestamo.webp"} alt={booksInLoans.includes(recurso.id_recurso) ? "Préstamo en proceso" : "Solicitar préstamo"} width={80} height={80} className="object-cover"/>
                                                                    </div>
                                                                    <div className='pt-2 text-lg font-semibold items-center pr-2'>
                                                                        {booksInLoans.includes(recurso.id_recurso) ? 'Préstamo solicitado' : 'Solicitar préstamo'}
                                                                    </div>
                                                                </button>
                                                            </>) : (<button disabled={!booksInReserves.includes(recurso.id_recurso)} title={!booksInReserves.includes(recurso.id_recurso) ? "Deshabilitado en la demo de solo lectura" : undefined} className={`flex ${booksInReserves.includes(recurso.id_recurso) ? 'bg-coral hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-3 py-1 rounded transition-colors`} onClick={booksInReserves.includes(recurso.id_recurso) ? () => { router.push('/biblioteca/usuario/mis-reservas'); } : () => handleAddToReserves(recurso)}>
                                                                <div className="w-12 h-12 mr-3">
                                                                    <Image src={booksInReserves.includes(recurso.id_recurso) ? "/mi-biblioteca.webp" : "/solicitar-reserva.png"} alt={booksInReserves.includes(recurso.id_recurso) ? "Reserva activa" : "Reservar"} width={80} height={80} className="object-cover"/>
                                                                </div>
                                                                <div className='pt-2 text-lg font-semibold items-center pr-2'>
                                                                    {booksInReserves.includes(recurso.id_recurso) ? 'Está en mis reservas' : 'Reservar'}
                                                                </div>
                                                            </button>))}


                                                        <button className="flex bg-[#3498db] text-white px-3 py-1 rounded hover:bg-[#2874a6] transition-colors" onClick={() => handleCite(recurso)}>
                                                            <div className="w-8 h-8 mr-3 mt-2">
                                                                <Image src="/citar.webp" alt="Imagen de citar" width={60} height={60} className="object-cover"/>
                                                            </div>
                                                            <div className='pt-2 text-lg font-semibold items-center pr-2'>Citar</div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>))}
                            </div>
                        </div>
                    </div>) : searchQuery && hasSearched ? (<div className="text-center py-12">
                        <p className="text-gray-600 text-lg dark:text-white">
                            No se encontraron resultados para "{searchQuery}"
                        </p>
                    </div>) : (<div className="text-center py-12">
                        <p className="text-gray-600 dark:text-white text-lg">No se ah realizado una búsqueda.</p>
                    </div>)}
            </div>

            {showSuccessModal && currentBook && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-green-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                ¡Libro añadido!
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                "{currentBook.titulo}" se añadió exitosamente a tu biblioteca
                            </p>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button onClick={() => {
                setShowSuccessModal(false);
                router.push('/biblioteca/usuario/mi-biblioteca');
            }} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Ver en mi biblioteca
                                </Button>
                                <Button variant="outline" onClick={() => setShowSuccessModal(false)} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                    Seguir explorando
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showErrorModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-red-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                Ocurrió un error
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                {modalMessage}
                            </p>
                            <div className="flex justify-center pt-4">
                                <Button onClick={() => setShowErrorModal(false)} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showLoginModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-[#F9A232]/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-[#F9A232]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                Acción requerida
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                {modalMessage}
                            </p>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button onClick={() => {
                setShowLoginModal(false);
            }} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Iniciar sesión
                                </Button>
                                <Button variant="outline" onClick={() => setShowLoginModal(false)} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showFormatModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-orange-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                Formato no soportado
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                {modalMessage}
                            </p>
                            <div className="flex justify-center pt-4">
                                <Button onClick={() => setShowFormatModal(false)} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showCiteModal && currentBook && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl border-2 border-gray-300 transform transition-all duration-300">

                        <div className="flex items-center justify-between p-4 border-b bg-gray-100 rounded-t-lg">
                            <h3 className="text-lg font-bold text-gray-800">
                                CITAR: {currentBook.titulo}
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



            {showReserveSuccessModal && currentBook && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-green-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                ¡Reserva exitosa!
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                "{currentBook.titulo}" se reservó exitosamente
                            </p>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button onClick={() => {
                setShowReserveSuccessModal(false);
                router.push('/biblioteca/usuario/mis-reservas');
            }} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Ver mis reservas
                                </Button>
                                <Button variant="outline" onClick={() => setShowReserveSuccessModal(false)} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                    Seguir explorando
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showLoanSuccessModal && currentBook && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-green-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                ¡Préstamo solicitado!
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                "{currentBook.titulo}" - préstamo solicitado exitosamente
                            </p>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button onClick={() => {
                setShowLoanSuccessModal(false);
                router.push('/biblioteca/usuario/mis-prestamos');
            }} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Ver mis préstamos
                                </Button>
                                <Button variant="outline" onClick={() => setShowLoanSuccessModal(false)} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                    Seguir explorando
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showReserveErrorModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-red-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                Error en la reserva
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                {modalMessage}
                            </p>
                            <div className="flex justify-center pt-4">
                                <Button onClick={() => setShowReserveErrorModal(false)} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


            {showLoanErrorModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-red-500/20 transform transition-all duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                                Error en el préstamo
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                {modalMessage}
                            </p>
                            <div className="flex justify-center pt-4">
                                <Button onClick={() => setShowLoanErrorModal(false)} className="bg-[#F9A232] hover:bg-[#e69122] text-white">
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}


        </div>);
}
