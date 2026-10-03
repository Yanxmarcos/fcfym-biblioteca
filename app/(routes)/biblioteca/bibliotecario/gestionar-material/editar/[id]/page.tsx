"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
interface FormDataType {
    titulo: string;
    autor: string;
    editorial: string;
    isbn_issn: string;
    anio_publicacion: string;
    id_categoria: number | "";
    idioma: string;
    num_paginas: string;
    palabras_clave: string;
    id_formato: number | "";
    id_tipo_recurso: number | "";
    url_archivo: string;
    portada: string;
}
interface CategoriaType {
    id_categoria: number;
    nombre: string;
}
interface FormatoType {
    id_formato: number;
    nombre: string;
}
interface TipoRecursoType {
    id_tipo_recurso: number;
    nombre: string;
}
export default function EditarRecursoForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");
    const categorias: CategoriaType[] = [
        { id_categoria: 1, nombre: "Matemáticas" },
        { id_categoria: 2, nombre: "Física" },
        { id_categoria: 3, nombre: "Química" },
        { id_categoria: 4, nombre: "Biología" },
        { id_categoria: 5, nombre: "Ingeniería" },
        { id_categoria: 6, nombre: "Astronomía" },
        { id_categoria: 7, nombre: "Geología" },
        { id_categoria: 8, nombre: "Medicina" },
        { id_categoria: 9, nombre: "Tecnología" },
        { id_categoria: 10, nombre: "Ciencias Sociales" }
    ];
    const formatos: FormatoType[] = [
        { id_formato: 1, nombre: "Físico" },
        { id_formato: 2, nombre: "Digital PDF" },
        { id_formato: 3, nombre: "Digital EPUB" },
        { id_formato: 4, nombre: "Audio Libro" },
        { id_formato: 5, nombre: "Microfilm" }
    ];
    const tiposRecurso: TipoRecursoType[] = [
        { id_tipo_recurso: 1, nombre: "Libro" },
        { id_tipo_recurso: 2, nombre: "Revista" },
        { id_tipo_recurso: 3, nombre: "Artículo" },
        { id_tipo_recurso: 4, nombre: "Tesis" },
        { id_tipo_recurso: 5, nombre: "Documento técnico" }
    ];
    const [formData, setFormData] = useState<FormDataType>({
        titulo: "",
        autor: "",
        editorial: "",
        isbn_issn: "",
        anio_publicacion: "",
        id_categoria: "",
        idioma: "",
        num_paginas: "",
        palabras_clave: "",
        id_formato: "",
        id_tipo_recurso: "",
        url_archivo: "",
        portada: ""
    });
    useEffect(() => {
        const cargarRecurso = async () => {
            try {
                setLoadingData(true);
                const response = await fetch(`/api/recurso/${id}`);
                if (!response.ok) {
                    throw new Error("No se pudo cargar el recurso");
                }
                const recurso = await response.json();
                setFormData({
                    titulo: recurso.titulo || "",
                    autor: recurso.autor || "",
                    editorial: recurso.editorial || "",
                    isbn_issn: recurso.isbn_issn || "",
                    anio_publicacion: recurso.anio_publicacion?.toString() || "",
                    id_categoria: recurso.id_categoria || "",
                    idioma: recurso.idioma || "",
                    num_paginas: recurso.num_paginas?.toString() || "",
                    palabras_clave: recurso.palabras_clave || "",
                    id_formato: recurso.id_formato || "",
                    id_tipo_recurso: recurso.id_tipo_recurso || "",
                    url_archivo: recurso.url_archivo || "",
                    portada: recurso.portada || ""
                });
            }
            catch (error) {
                console.error("Error al cargar el recurso:", error);
                setError("No se pudo cargar el recurso. Intente nuevamente o vuelva a la lista de recursos.");
            }
            finally {
                setLoadingData(false);
            }
        };
        cargarRecurso();
    }, [id]);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            let ruta = "";
            if (fieldName === "url_archivo") {
                ruta = `/pdfs/${file.name}`;
            }
            else if (fieldName === "portada") {
                ruta = `/portadas/${file.name}`;
            }
            setFormData({
                ...formData,
                [fieldName]: ruta
            });
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'id_categoria' || name === 'id_formato' || name === 'id_tipo_recurso') {
            setFormData({
                ...formData,
                [name]: value === "" ? "" : parseInt(value)
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (!formData.titulo) {
                throw new Error("El título es obligatorio");
            }
            const datosParaAPI = {
                titulo: formData.titulo,
                autor: formData.autor || null,
                editorial: formData.editorial || null,
                anio_publicacion: formData.anio_publicacion || null,
                idioma: formData.idioma || null,
                id_categoria: formData.id_categoria || null,
                num_paginas: formData.num_paginas ? parseInt(formData.num_paginas) : null,
                palabras_clave: formData.palabras_clave || null,
                isbn_issn: formData.isbn_issn || null,
                id_formato: formData.id_formato,
                id_tipo_recurso: formData.id_tipo_recurso,
                url_archivo: formData.url_archivo || null,
                portada: formData.portada || null
            };
            const response = await fetch(`/api/recurso/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosParaAPI),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar el recurso");
            }
            alert("Recurso actualizado exitosamente");
            router.push("/biblioteca/bibliotecario/gestionar-material");
        }
        catch (error: any) {
            setError(error.message || "Error al procesar la solicitud");
        }
        finally {
            setLoading(false);
        }
    };
    if (loadingData) {
        return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539] mx-auto mb-4"></div>
          <p className="text-lg text-[#B26539] font-medium">Cargando datos del recurso...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">

      <div className="border-b-2 border-[#B26539] w-full pb-4 mb-6">
        <div className="flex items-center">
          <Link href="/biblioteca/bibliotecario/gestionar-material" className="border-2 border-[#B26539] text-[#B26539] hover:bg-[#B26539] hover:text-white transition-colors duration-200 inline-flex items-center px-4 py-2 mr-4 rounded-lg font-medium">
            ← Regresar
          </Link>
          <h1 className="text-2xl font-bold text-[#B26539] dark:text-white">EDITAR MATERIAL BIBLIOGRÁFICO</h1>
        </div>
      </div>

      {error && (<div className="mb-6 border-2 border-red-500 bg-red-50 p-4 text-red-700 rounded-lg">
          {error}
        </div>)}

      <form onSubmit={handleSubmit}>

        <div className="border-2 border-[#B26539] mb-6 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
          <div className="px-4 py-3 bg-[#B26539] text-white">
            <h2 className="font-semibold text-lg">Información general</h2>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Título: <span className="text-red-500">*</span>
              </label>
              <input type="text" name="titulo" placeholder="Ingrese título..." value={formData.titulo} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200" required/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Autor(es):</label>
                <input type="text" name="autor" placeholder="Ingrese autores..." value={formData.autor} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200"/>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Editorial:</label>
                <input type="text" name="editorial" placeholder="Ingrese editorial..." value={formData.editorial} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">ISBN / ISSN:</label>
                <input type="text" name="isbn_issn" value={formData.isbn_issn} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200"/>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Año de publicación:</label>
                <input type="number" name="anio_publicacion" value={formData.anio_publicacion} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200" min="1000" max={new Date().getFullYear()}/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Categoría:</label>
                <select name="id_categoria" value={formData.id_categoria} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg bg-white transition-colors duration-200">
                  <option value="">Seleccione</option>
                  {categorias.map(cat => (<option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Idioma:</label>
                <select name="idioma" value={formData.idioma} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg bg-white transition-colors duration-200">
                  <option value="">Seleccione</option>
                  <option value="español">Español</option>
                  <option value="inglés">Inglés</option>
                  <option value="francés">Francés</option>
                  <option value="alemán">Alemán</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Num. páginas:</label>
              <input type="number" name="num_paginas" value={formData.num_paginas} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200" min="1"/>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Palabras clave / Descriptores:</label>
              <input type="text" name="palabras_clave" value={formData.palabras_clave} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200" placeholder="Ingrese las palabras separadas por comas: Ej. programación, objetos, listas..."/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Tipo de recurso: <span className="text-red-500">*</span>
                </label>
                <select name="id_tipo_recurso" value={formData.id_tipo_recurso} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg bg-white transition-colors duration-200" required>
                  <option value="">Seleccione</option>
                  {tiposRecurso.map(tipo => (<option key={tipo.id_tipo_recurso} value={tipo.id_tipo_recurso}>
                      {tipo.nombre}
                    </option>))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Formato: <span className="text-red-500">*</span>
                </label>
                <select name="id_formato" value={formData.id_formato} onChange={handleChange} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg bg-white transition-colors duration-200" required>
                  <option value="">Seleccione</option>
                  {formatos.map(formato => (<option key={formato.id_formato} value={formato.id_formato}>
                      {formato.nombre}
                    </option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Archivo PDF:</label>
                <div className="space-y-2">
                  <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "url_archivo")} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F9A232] file:text-white hover:file:bg-[#e8931e]"/>
                  {formData.url_archivo && (<p className="text-sm text-gray-600">Ruta: {formData.url_archivo}</p>)}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Imagen de portada:</label>
                <div className="space-y-2">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "portada")} className="w-full border-2 border-gray-300 focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F9A232] file:text-white hover:file:bg-[#e8931e]"/>
                  {formData.portada && (<p className="text-sm text-gray-600">Ruta: {formData.portada}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="flex justify-end gap-4">
          <button type="reset" className="border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white transition-colors duration-200 p-4 w-14 h-14 flex items-center justify-center rounded-lg font-bold" onClick={() => {
            if (id) {
                window.location.reload();
            }
        }}>
            🗑️
          </button>
          <button type="submit" disabled={loading} className="border-2 border-[#B26539] bg-[#B26539] text-white hover:bg-[#8B4513] transition-colors duration-200 px-8 py-4 flex items-center justify-center rounded-lg font-bold shadow-md">
            {loading ? "ACTUALIZANDO..." : "ACTUALIZAR"}
          </button>
        </div>
      </form>
    </div>);
}
