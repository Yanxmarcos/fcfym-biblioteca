export const demoUser = {
    id: 1,
    email: "usuario@demo.com",
    tipo_usuario: "pregrado",
    nombres: "Usuario",
    apellido_paterno: "Demo",
    apellido_materno: "",
    telefono: "999 999 999",
    domicilio: "Trujillo, Perú",
    numero_matricula: "DEMO001",
    dni: "00000000",
    foto_perfil: "/1@unitru.edu.pe/foto-usuario.jpg"
};

export const recursos = [
    { id_recurso: 1, titulo: "Cálculo infinitesimal", autor: "Michael Spivak", editorial: "Reverté", anio_publicacion: 2012, idioma: "Español", id_categoria: 1, num_paginas: 680, palabras_clave: "cálculo, límites, derivadas, integrales", isbn_issn: "9788429151824", id_formato: 1, id_tipo_recurso: 1, url_archivo: "/pdfs/pdf_prueba.pdf", portada: "/portadas/1-calculo-infinetisimal.webp", nombre_categoria: "Matemáticas", nombre_formato: "Digital PDF", nombre_tipo_recurso: "Libro" },
    { id_recurso: 2, titulo: "Física universitaria", autor: "Hugh D. Young", editorial: "Pearson", anio_publicacion: 2018, idioma: "Español", id_categoria: 2, num_paginas: 820, palabras_clave: "física, mecánica, energía", isbn_issn: "9786073244393", id_formato: 2, id_tipo_recurso: 1, url_archivo: null, portada: "/portadas/2-fisica-universitaria.webp", nombre_categoria: "Física", nombre_formato: "Impreso", nombre_tipo_recurso: "Libro" },
    { id_recurso: 3, titulo: "Álgebra lineal", autor: "Stanley I. Grossman", editorial: "McGraw-Hill", anio_publicacion: 2019, idioma: "Español", id_categoria: 1, num_paginas: 560, palabras_clave: "álgebra, matrices, vectores", isbn_issn: "9781456270193", id_formato: 1, id_tipo_recurso: 1, url_archivo: "/pdfs/pdf_prueba.pdf", portada: "/portadas/3-algebra-lineal.webp", nombre_categoria: "Matemáticas", nombre_formato: "Digital PDF", nombre_tipo_recurso: "Libro" },
    { id_recurso: 4, titulo: "Breve historia del tiempo", autor: "Stephen Hawking", editorial: "Crítica", anio_publicacion: 2018, idioma: "Español", id_categoria: 3, num_paginas: 256, palabras_clave: "cosmología, universo, tiempo", isbn_issn: "9788491990430", id_formato: 1, id_tipo_recurso: 1, url_archivo: "/pdfs/pdf_prueba.pdf", portada: "/portadas/4-Breve-Historia-del-Tiempo.webp", nombre_categoria: "Astronomía", nombre_formato: "Digital PDF", nombre_tipo_recurso: "Libro" },
    { id_recurso: 5, titulo: "Ecuaciones diferenciales", autor: "Dennis G. Zill", editorial: "Cengage", anio_publicacion: 2018, idioma: "Español", id_categoria: 1, num_paginas: 480, palabras_clave: "ecuaciones, modelado, matemáticas", isbn_issn: "9786075266317", id_formato: 2, id_tipo_recurso: 1, url_archivo: null, portada: "/portadas/5-ecuaciones-dif.jpeg", nombre_categoria: "Matemáticas", nombre_formato: "Impreso", nombre_tipo_recurso: "Libro" },
    { id_recurso: 6, titulo: "Química orgánica", autor: "John McMurry", editorial: "Cengage", anio_publicacion: 2017, idioma: "Español", id_categoria: 4, num_paginas: 1200, palabras_clave: "química, moléculas, reacciones", isbn_issn: "9786075265587", id_formato: 1, id_tipo_recurso: 1, url_archivo: "/pdfs/pdf_prueba.pdf", portada: "/portadas/6-quimica-organica.webp", nombre_categoria: "Química", nombre_formato: "Digital PDF", nombre_tipo_recurso: "Libro" },
    { id_recurso: 7, titulo: "El gen egoísta", autor: "Richard Dawkins", editorial: "Salvat", anio_publicacion: 2017, idioma: "Español", id_categoria: 5, num_paginas: 424, palabras_clave: "biología, genética, evolución", isbn_issn: "9788499986978", id_formato: 1, id_tipo_recurso: 1, url_archivo: "/pdfs/pdf_prueba.pdf", portada: "/portadas/7-el-gen-egoista.webp", nombre_categoria: "Biología", nombre_formato: "Digital PDF", nombre_tipo_recurso: "Libro" },
    { id_recurso: 8, titulo: "Astrofísica para gente con prisas", autor: "Neil deGrasse Tyson", editorial: "Paidós", anio_publicacion: 2017, idioma: "Español", id_categoria: 3, num_paginas: 224, palabras_clave: "astrofísica, cosmos, universo", isbn_issn: "9788449334108", id_formato: 2, id_tipo_recurso: 1, url_archivo: null, portada: "/portadas/8-astrofisica.jpeg", nombre_categoria: "Astronomía", nombre_formato: "Impreso", nombre_tipo_recurso: "Libro" }
].map(item => ({ ...item, categoria: item.nombre_categoria, formato: item.nombre_formato, tipo_recurso: item.nombre_tipo_recurso }));

export const miBiblioteca = [
    { ...recursos[0], mi_porcentaje: 75, fecha_agregado_biblioteca: "2026-09-10" },
    { ...recursos[2], mi_porcentaje: 40, fecha_agregado_biblioteca: "2026-09-18" },
    { ...recursos[3], mi_porcentaje: 100, fecha_agregado_biblioteca: "2026-09-25" },
    { ...recursos[5], mi_porcentaje: 20, fecha_agregado_biblioteca: "2026-09-28" }
];

export const reservasUsuario = [
    { id_reserva: 1, id_usuario: 1, fecha_reserva: "2026-09-28", fecha_expiracion: "2026-10-12", estado: "pendiente", prioridad: 1, ...recursos[4] },
    { id_reserva: 2, id_usuario: 1, fecha_reserva: "2026-09-20", fecha_expiracion: "2026-10-04", estado: "completada", prioridad: 2, ...recursos[7] }
];

export const prestamosUsuario = [
    { id_prestamo: 1, id_usuario: 1, fecha_prestamo: "2026-09-20", fecha_devolucion_prevista: "2026-10-20", fecha_devolucion_real: null, estado: "activo", renovaciones: 0, dias_restantes: 18, ...recursos[1] },
    { id_prestamo: 2, id_usuario: 1, fecha_prestamo: "2026-08-10", fecha_devolucion_prevista: "2026-08-24", fecha_devolucion_real: "2026-08-22", estado: "devuelto", renovaciones: 0, dias_restantes: 0, ...recursos[6] }
];

export function buscarRecursos(query: string) {
    const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
    const term = normalize(query.trim());
    if (!term) return recursos;
    return recursos.filter(item => [item.titulo, item.autor, item.editorial, item.palabras_clave, item.nombre_categoria, item.nombre_formato, item.nombre_tipo_recurso].some(value => normalize(value).includes(term)));
}

export const readOnlyResponse = { success: false, readOnly: true, message: "Esta acción está deshabilitada en la demostración de solo lectura" };
