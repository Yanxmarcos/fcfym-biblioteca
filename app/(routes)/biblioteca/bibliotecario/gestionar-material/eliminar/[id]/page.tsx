"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
export default function EliminarRecursoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [recurso, setRecurso] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const cargarRecurso = async () => {
            try {
                const response = await fetch(`/api/recurso/${id}`);
                if (!response.ok) {
                    throw new Error("No se pudo cargar el recurso");
                }
                const data = await response.json();
                setRecurso(data);
            }
            catch (error) {
                console.error("Error al cargar el recurso:", error);
                setError("No se pudo cargar la información del recurso");
            }
            finally {
                setLoading(false);
            }
        };
        cargarRecurso();
    }, [id]);
    const handleEliminar = async () => {
        try {
            setEliminando(true);
            const response = await fetch(`/api/recurso/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar el recurso");
            }
            alert("Recurso eliminado correctamente");
            router.push("/biblioteca/bibliotecario/gestionar-material");
        }
        catch (error: any) {
            setError(error.message || "Error al eliminar el recurso");
            setEliminando(false);
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539] mx-auto mb-4"></div>
          <p className="text-lg text-[#B26539] font-medium">Cargando información del recurso...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">

      <div className="border-b-2 border-[#B26539] w-full pb-4 mb-6">
        <div className="flex items-center">
          <Link href="/biblioteca/bibliotecario/gestionar-material" className="border-2 border-[#B26539] text-[#B26539] hover:bg-[#B26539] hover:text-white transition-colors duration-200 inline-flex items-center px-4 py-2 mr-4 rounded-lg font-medium">
            ← Regresar
          </Link>
          <h1 className="text-2xl font-bold text-[#B26539] dark:text-white">ELIMINAR MATERIAL BIBLIOGRÁFICO</h1>
        </div>
      </div>

      {error && (<div className="mb-6 border-2 border-red-500 bg-red-50 p-4 text-red-700 rounded-lg">
          {error}
        </div>)}

      <div className="border-2 border-[#B26539] mb-6 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
        <div className="px-4 py-3 bg-[#B26539] text-white">
          <h2 className="font-semibold text-lg">Confirmar eliminación</h2>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-300 p-4 mb-6 text-red-800 rounded-lg">
            <p className="font-bold mb-2">⚠️ Advertencia</p>
            <p>Está a punto de eliminar permanentemente este recurso de la biblioteca. Esta acción no se puede deshacer.</p>
          </div>
          {recurso && (<div className="border border-[#B26539] p-4 mb-4 rounded-lg bg-[#FFF7F0]">
              <h3 className="font-bold text-lg mb-2 text-[#B26539]">{recurso.titulo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><span className="font-semibold">Autor:</span> {recurso.autor || "No especificado"}</p>
                <p><span className="font-semibold">Editorial:</span> {recurso.editorial || "No especificada"}</p>
                <p><span className="font-semibold">Tipo:</span> {recurso.nombre_tipo_recurso}</p>
                <p><span className="font-semibold">Formato:</span> {recurso.nombre_formato}</p>
                <p><span className="font-semibold">Categoría:</span> {recurso.nombre_categoria || "No especificada"}</p>
                <p><span className="font-semibold">ISBN/ISSN:</span> {recurso.isbn_issn || "No especificado"}</p>
                <p><span className="font-semibold">Año:</span> {recurso.anio_publicacion || "No especificado"}</p>
                <p><span className="font-semibold">Idioma:</span> {recurso.idioma || "No especificado"}</p>
                {recurso.num_paginas && <p><span className="font-semibold">Páginas:</span> {recurso.num_paginas}</p>}
              </div>
            </div>)}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/biblioteca/bibliotecario/gestionar-material" className="border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white transition-colors duration-200 p-4 w-32 flex items-center justify-center rounded-lg font-bold">
          CANCELAR
        </Link>
        <button onClick={handleEliminar} disabled={eliminando} className="border-2 border-[#B26539] bg-[#B26539] text-white hover:bg-[#8B4513] transition-colors duration-200 px-8 py-4 flex items-center justify-center rounded-lg font-bold shadow-md gap-2">
          <img src="/icons/19._LIBRO_ELIMINAR-removebg-preview (1).png" alt="Eliminar" className="w-6 h-6"/>
          {eliminando ? "ELIMINANDO..." : "ELIMINAR"}
        </button>
      </div>
    </div>);
}
