"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
const validationUtils = {
    validateTitle: (value: string) => {
        const titleRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\.\,\:\;\!\?\-\(\)\[\]\"\'\/\&\+\=\@\#\$\%\^\*\_\~\`\|\\]+$/;
        return titleRegex.test(value);
    },
    validateAuthor: (value: string) => {
        const authorRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.\,\-]+$/;
        return authorRegex.test(value);
    },
    validateEditorial: (value: string) => {
        const editorialRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\.\,\-\&\+]+$/;
        return editorialRegex.test(value);
    },
    validateISBN_ISSN: (value: string) => {
        const isbnRegex = /^(\d{10}|\d{13}|\d{1,5}-\d{1,7}-\d{1,7}-[\dX]|\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d)$/;
        const issnRegex = /^\d{4}-\d{4}$/;
        return isbnRegex.test(value) || issnRegex.test(value);
    },
    validateYear: (value: string) => {
        const yearRegex = /^\d{4}$/;
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return yearRegex.test(value) && year >= 1000 && year <= currentYear;
    },
    validatePages: (value: string) => {
        const pagesRegex = /^\d+$/;
        const pages = parseInt(value);
        return pagesRegex.test(value) && pages > 0 && pages <= 10000;
    },
    validateKeywords: (value: string) => {
        const keywordsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\.\,\-\;]+$/;
        return keywordsRegex.test(value);
    }
};
export default function AñadirRecursoForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{
        [key: string]: string;
    }>({});
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
        id_formato: 1,
        id_tipo_recurso: 1,
        url_archivo: "",
        portada: ""
    });
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'titulo':
                if (value.trim() === '')
                    return '';
                if (value.length > 200)
                    return 'El título no puede exceder 200 caracteres';
                if (!validationUtils.validateTitle(value))
                    return 'El título contiene caracteres no válidos';
                return '';
            case 'autor':
                if (value.trim() === '')
                    return '';
                if (value.length > 150)
                    return 'El autor no puede exceder 150 caracteres';
                if (!validationUtils.validateAuthor(value))
                    return 'El autor solo puede contener letras, espacios y algunos signos de puntuación';
                return '';
            case 'editorial':
                if (value.trim() === '')
                    return '';
                if (value.length > 100)
                    return 'La editorial no puede exceder 100 caracteres';
                if (!validationUtils.validateEditorial(value))
                    return 'La editorial contiene caracteres no válidos';
                return '';
            case 'isbn_issn':
                if (value.trim() === '')
                    return '';
                if (!validationUtils.validateISBN_ISSN(value))
                    return 'Formato de ISBN/ISSN inválido';
                return '';
            case 'anio_publicacion':
                if (value.trim() === '')
                    return '';
                if (!validationUtils.validateYear(value))
                    return 'Año inválido (debe ser entre 1000 y el año actual)';
                return '';
            case 'num_paginas':
                if (value.trim() === '')
                    return '';
                if (!validationUtils.validatePages(value))
                    return 'Número de páginas inválido (debe ser un número positivo)';
                return '';
            case 'palabras_clave':
                if (value.trim() === '')
                    return '';
                if (value.length > 500)
                    return 'Las palabras clave no pueden exceder 500 caracteres';
                if (!validationUtils.validateKeywords(value))
                    return 'Las palabras clave contienen caracteres no válidos';
                return '';
            default:
                return '';
        }
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (fieldName === "url_archivo") {
                if (file.type !== "application/pdf") {
                    setFieldErrors({ ...fieldErrors, url_archivo: "Solo se permiten archivos PDF" });
                    return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    setFieldErrors({ ...fieldErrors, url_archivo: "El archivo no puede exceder 10MB" });
                    return;
                }
            }
            else if (fieldName === "portada") {
                if (!file.type.startsWith("image/")) {
                    setFieldErrors({ ...fieldErrors, portada: "Solo se permiten archivos de imagen" });
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    setFieldErrors({ ...fieldErrors, portada: "La imagen no puede exceder 2MB" });
                    return;
                }
            }
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
            if (fieldErrors[fieldName]) {
                const newErrors = { ...fieldErrors };
                delete newErrors[fieldName];
                setFieldErrors(newErrors);
            }
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue = value;
        switch (name) {
            case 'anio_publicacion':
                newValue = value.replace(/[^0-9]/g, '').slice(0, 4);
                break;
            case 'num_paginas':
                newValue = value.replace(/[^0-9]/g, '');
                break;
            case 'isbn_issn':
                newValue = value.replace(/[^0-9X\-]/g, '').toUpperCase();
                break;
            case 'autor':
                newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.\,\-]/g, '');
                break;
            case 'editorial':
                newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\.\,\-\&\+]/g, '');
                break;
            case 'palabras_clave':
                newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\.\,\-\;]/g, '');
                break;
        }
        if (name === 'id_categoria' || name === 'id_formato' || name === 'id_tipo_recurso') {
            setFormData({
                ...formData,
                [name]: newValue === "" ? "" : parseInt(newValue)
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: newValue
            });
        }
        const error = validateField(name, newValue);
        if (error) {
            setFieldErrors({ ...fieldErrors, [name]: error });
        }
        else {
            const newErrors = { ...fieldErrors };
            delete newErrors[name];
            setFieldErrors(newErrors);
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const errors: {
                [key: string]: string;
            } = {};
            if (!formData.titulo.trim()) {
                errors.titulo = "El título es obligatorio";
            }
            else {
                const titleError = validateField('titulo', formData.titulo);
                if (titleError)
                    errors.titulo = titleError;
            }
            if (!formData.id_tipo_recurso) {
                errors.id_tipo_recurso = "El tipo de recurso es obligatorio";
            }
            if (!formData.id_formato) {
                errors.id_formato = "El formato es obligatorio";
            }
            Object.keys(formData).forEach(key => {
                if (key !== 'titulo' && key !== 'id_tipo_recurso' && key !== 'id_formato') {
                    const value = formData[key as keyof FormDataType];
                    if (typeof value === 'string' && value.trim() !== '') {
                        const error = validateField(key, value);
                        if (error)
                            errors[key] = error;
                    }
                }
            });
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                throw new Error("Por favor, corrija los errores en el formulario");
            }
            const datosParaAPI = {
                titulo: formData.titulo.trim(),
                autor: formData.autor.trim() || null,
                editorial: formData.editorial.trim() || null,
                anio_publicacion: formData.anio_publicacion.trim() || null,
                idioma: formData.idioma || null,
                id_categoria: formData.id_categoria || null,
                num_paginas: formData.num_paginas ? parseInt(formData.num_paginas) : null,
                palabras_clave: formData.palabras_clave.trim() || null,
                isbn_issn: formData.isbn_issn.trim() || null,
                id_formato: formData.id_formato,
                id_tipo_recurso: formData.id_tipo_recurso,
                url_archivo: formData.url_archivo || null,
                portada: formData.portada || null
            };
            const response = await fetch("/api/recurso", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosParaAPI),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el recurso");
            }
            alert("Recurso guardado exitosamente");
            router.push("/biblioteca/bibliotecario/gestionar-material");
        }
        catch (error: any) {
            setError(error.message || "Error al procesar la solicitud");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-5 pb-3">

      <div className="border-b-2 border-[#B26539] w-full pb-4 mb-6">
        <div className="flex items-center">
          <Link href="/biblioteca/bibliotecario/gestionar-material" className="border-2 border-[#B26539] text-[#B26539] hover:bg-[#B26539] hover:text-white transition-colors duration-200 inline-flex items-center px-4 py-2 mr-4 rounded-lg font-medium">
            ← Regresar
          </Link>
          <h1 className="text-2xl font-bold text-[#B26539] dark:text-white">AÑADIR MATERIAL BIBLIOGRÁFICO</h1>
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
              <input type="text" name="titulo" placeholder="Ingrese título..." value={formData.titulo} onChange={handleChange} className={`w-full border-2 ${fieldErrors.titulo ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`} required maxLength={200}/>
              {fieldErrors.titulo && (<p className="text-red-500 text-sm mt-1">{fieldErrors.titulo}</p>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Autor(es):</label>
                <input type="text" name="autor" placeholder="Ingrese autores..." value={formData.autor} onChange={handleChange} className={`w-full border-2 ${fieldErrors.autor ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`} maxLength={150}/>
                {fieldErrors.autor && (<p className="text-red-500 text-sm mt-1">{fieldErrors.autor}</p>)}
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Editorial:</label>
                <input type="text" name="editorial" placeholder="Ingrese editorial..." value={formData.editorial} onChange={handleChange} className={`w-full border-2 ${fieldErrors.editorial ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`} maxLength={100}/>
                {fieldErrors.editorial && (<p className="text-red-500 text-sm mt-1">{fieldErrors.editorial}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">ISBN / ISSN:</label>
                <input type="text" name="isbn_issn" placeholder="Ej: 978-3-16-148410-0" value={formData.isbn_issn} onChange={handleChange} className={`w-full border-2 ${fieldErrors.isbn_issn ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`}/>
                {fieldErrors.isbn_issn && (<p className="text-red-500 text-sm mt-1">{fieldErrors.isbn_issn}</p>)}
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Año de publicación:</label>
                <input type="text" name="anio_publicacion" placeholder="Ej: 2024" value={formData.anio_publicacion} onChange={handleChange} className={`w-full border-2 ${fieldErrors.anio_publicacion ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`} maxLength={4}/>
                {fieldErrors.anio_publicacion && (<p className="text-red-500 text-sm mt-1">{fieldErrors.anio_publicacion}</p>)}
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
              <input type="text" name="num_paginas" placeholder="Ej: 250" value={formData.num_paginas} onChange={handleChange} className={`w-full border-2 ${fieldErrors.num_paginas ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`}/>
              {fieldErrors.num_paginas && (<p className="text-red-500 text-sm mt-1">{fieldErrors.num_paginas}</p>)}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Palabras clave / Descriptores:</label>
              <input type="text" name="palabras_clave" value={formData.palabras_clave} onChange={handleChange} className={`w-full border-2 ${fieldErrors.palabras_clave ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200`} placeholder="Ingrese las palabras separadas por comas: Ej. programación, objetos, listas..." maxLength={500}/>
              {fieldErrors.palabras_clave && (<p className="text-red-500 text-sm mt-1">{fieldErrors.palabras_clave}</p>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Tipo de recurso: <span className="text-red-500">*</span>
                </label>
                <select name="id_tipo_recurso" value={formData.id_tipo_recurso} onChange={handleChange} className={`w-full border-2 ${fieldErrors.id_tipo_recurso ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg bg-white transition-colors duration-200`} required>
                  <option value="">Seleccione</option>
                  {tiposRecurso.map(tipo => (<option key={tipo.id_tipo_recurso} value={tipo.id_tipo_recurso}>
                      {tipo.nombre}
                    </option>))}
                </select>
                {fieldErrors.id_tipo_recurso && (<p className="text-red-500 text-sm mt-1">{fieldErrors.id_tipo_recurso}</p>)}
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Formato: <span className="text-red-500">*</span>
                </label>
                <select name="id_formato" value={formData.id_formato} onChange={handleChange} className={`w-full border-2 ${fieldErrors.id_formato ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg bg-white transition-colors duration-200`} required>
                  <option value="">Seleccione</option>
                  {formatos.map(formato => (<option key={formato.id_formato} value={formato.id_formato}>
                      {formato.nombre}
                    </option>))}
                </select>
                {fieldErrors.id_formato && (<p className="text-red-500 text-sm mt-1">{fieldErrors.id_formato}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Archivo PDF:</label>
                <div className="space-y-2">
                  <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "url_archivo")} className={`w-full border-2 ${fieldErrors.url_archivo ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200 file:mr-4 file:py-2 file:px
                  4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F9A232] file:text-white hover:file:bg-[#d17c1a]`}/>
                  {fieldErrors.url_archivo && (<p className="text-red-500 text-sm">{fieldErrors.url_archivo}</p>)}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Portada (imagen):</label>
                <div className="space-y-2">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "portada")} className={`w-full border-2 ${fieldErrors.portada ? 'border-red-500' : 'border-gray-300'} focus:border-[#F9A232] focus:ring-2 focus:ring-[#F9A232] focus:outline-none px-4 py-3 rounded-lg transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F9A232] file:text-white hover:file:bg-[#d17c1a]`}/>
                  {fieldErrors.portada && (<p className="text-red-500 text-sm">{fieldErrors.portada}</p>)}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="bg-[#F9A232] hover:bg-[#d17c1a] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Guardando...' : 'Guardar recurso'}
            </button>
          </div>
        </div>
      </form>
    </div>);
}
