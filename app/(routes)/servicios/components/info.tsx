import Image from "next/image";
import { MessageCircle } from "lucide-react";
export const ServicesGrid = () => {
    return (<div className="p-0 bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent">
            Servicios
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Aquí puedes observar los diferentes servicios que ofrecemos como Biblioteca.
          </p>
        </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="border border-coral-light rounded-md overflow-hidden flex flex-col md:flex-row bg-secondary">
          <div className="p-4 flex-1">
            <h2 className="text-xl font-bold mb-2 text-coral-dark">Catálogo</h2>
            <p className="text-sm text-muted-foreground">
              Puedes realizar consultas de todos los recursos de información
              que tiene disponible la biblioteca de FCFYM.
            </p>
          </div>
          <div className="md:w-1/2 h-40 md:h-auto bg-muted flex items-center justify-center">
            <Image src="/s-catalogo.jpg" width={180} height={180} alt="Imagen de servicios"/>
          </div>
        </div>


        <div className="border border-coral-light rounded-md overflow-hidden flex flex-col md:flex-row bg-secondary">
          <div className="p-4 flex-1">
            <h2 className="text-xl font-bold mb-2 text-coral-dark">
              Préstamo de libros
            </h2>
            <p className="text-sm text-muted-foreground">
              Accede a recursos bibliográficos esenciales para potenciar tus
              proyectos y estudios de tu carrera universitaria.
            </p>
          </div>
          <div className="md:w-1/2 h-40 md:h-auto bg-muted flex items-center justify-center">
            <Image src="/s-prestamo.jpg" width={180} height={180} alt="Imagen de servicios"/>
          </div>
        </div>


        <div className="border border-coral-light rounded-md overflow-hidden flex flex-col md:flex-row bg-secondary">
          <div className="p-4 flex-1">
            <h2 className="text-xl font-bold mb-2 text-coral-dark">
              Reserva de libros
            </h2>
            <p className="text-sm text-muted-foreground">
              Garantiza el acceso a los recursos bibliográficos claves para tus
              proyectos y estudios. Realiza tu reserva con anticipación.
            </p>
          </div>
          <div className="md:w-1/2 h-40 md:h-auto bg-muted flex items-center justify-center">
            <Image src="/s-reserva.jpg" width={180} height={180} alt="Imagen de servicios"/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-4xl mx-auto">

        <div className="border border-coral-light rounded-md overflow-hidden flex flex-col md:flex-row bg-secondary">
          <div className="p-4 flex-1">
            <h2 className="text-xl font-bold mb-2 text-coral-dark">
              Zona de búsqueda
            </h2>
            <p className="text-sm text-muted-foreground">
              Optimiza tu experiencia académica en un espacio diseñado para
              investigación y gestión de recursos.
            </p>
          </div>
          <div className="md:w-1/2 h-40 md:h-auto bg-muted flex items-center justify-center">
            <Image src="/s-zona-busqueda.jpeg" width={180} height={180} alt="Imagen de servicios"/>
          </div>
        </div>


        <div className="border border-coral-light rounded-md overflow-hidden flex flex-col md:flex-row bg-secondary">
          <div className="p-4 flex-1">
            <h2 className="text-xl font-bold mb-2 text-coral-dark">
              Sala de estudio y lectura
            </h2>
            <p className="text-sm text-muted-foreground">
              Encuentra tu espacio ideal para concentrarte, colaborar o avanzar
              en tus proyectos.
            </p>
          </div>
          <div className="md:w-1/2 h-40 md:h-auto bg-muted flex items-center justify-center">
            <Image src="/s-sala.png" width={180} height={180} alt="Imagen de servicios"/>
          </div>
        </div>
      </div>
    </div>);
};
