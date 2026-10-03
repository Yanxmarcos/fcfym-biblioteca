const noticias = [
    {
        titulo: 'La Biblioteca Amplía su Horario hasta las 10:00 pm',
        descripcion: 'Desde este lunes, la Biblioteca Central de la FCFYM extenderá su horario hasta las 10:00 p.m. de lunes a viernes, respondiendo a la demanda de los estudiantes que preparan sus exámenes finales.',
        imagen: '/noticia-1.jpg',
        destacado: true,
    },
    {
        titulo: 'Nuevo Sistema de Préstamos Automático Reduce Tiempos de Espera',
        descripcion: '',
        imagen: '/noticia-2.jpg',
        destacado: false,
    },
    {
        titulo: 'Donación Sorpresa: Exalumno Regala 500 Libros Técnicos a la Biblioteca',
        descripcion: '',
        imagen: '/noticia-3.jpg',
        destacado: false,
    },
    {
        titulo: 'Instalan Zonas de Estudio con Pizarras Inteligentes',
        descripcion: '',
        imagen: '/noticia-4.jpeg',
        destacado: false,
    },
    {
        titulo: 'Biblioteca Lanza App Móvil para Buscar Libros y Reservar Salas',
        descripcion: '',
        imagen: '/noticia-5.jpeg',
        destacado: false,
    },
    {
        titulo: 'Realizan Noche de Lectura con Café y Música en Vivo',
        descripcion: '',
        imagen: '/noticia-6.jpg',
        destacado: false,
    },
];
export default function NoticiasPage() {
    return (<div className="p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent">
            Noticias
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Noticias importantes relacionadas con la Biblioteca.
          </p>
        </header>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {noticias.map((noticia, index) => (<div key={index} className={`border border-coral-light rounded-lg overflow-hidden bg-secondary shadow-sm ${noticia.destacado ? 'md:col-span-2' : ''}`}>
            <div className="h-48 bg-coral-subtle">
              <img className="w-full h-full object-cover" src={noticia.imagen} alt="Imagen noticia"/>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-coral-dark">
                {noticia.titulo}
              </h2>
              {noticia.descripcion && (<p className="text-readable-secondary mb-4">
                  {noticia.descripcion}
                </p>)}
              <button className="px-4 py-2 bg-coral text-primary-foreground font-medium rounded hover:bg-coral-dark">
                Ver más
              </button>
            </div>
          </div>))}
      </div>
    </div>);
}
