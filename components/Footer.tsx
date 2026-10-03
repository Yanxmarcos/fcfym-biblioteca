'use client';
import Link from 'next/link';
import { MapPin, ExternalLink, Building } from 'lucide-react';
import Image from 'next/image';
export default function Footer() {
    return (<footer className="relative bg-white dark:bg-gray-900">

      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#FF7F50"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#FF7F50"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#FF7F50"></path>
        </svg>
      </div>


      <div className="relative pt-14 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">


            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="flex space-x-3">

                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Image src="/LOGO-UNT.webp" alt="Logo Universidad Nacional de Trujillo" width={110} height={110}/>
                </div>

                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Image src="/fcfym.png" alt="Logo Universidad Nacional de Trujillo" width={35} height={35}/>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base mb-0.5">
                  Universidad Nacional de Trujillo
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-xs">
                  Facultad de Ciencias Físicas y Matemáticas
                </p>
              </div>
            </div>


            <div className="text-center md:text-left">
              <h3 className="font-bold text-coral dark:text-coral text-lg mb-3">
                Importante
              </h3>

              <div className="space-y-3">
                <Link href="/fcfym" className="flex items-center justify-center md:justify-start space-x-2 text-gray-700 dark:text-gray-300 hover:text-coral dark:hover:text-coral transition-colors group text-sm">
                  <Building className="w-4 h-4"/>
                  <span>Página principal de FCFYM.</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </Link>

                <Link href="/ubicacion" className="flex items-center justify-center md:justify-start space-x-2 text-gray-700 dark:text-gray-300 hover:text-coral dark:hover:text-coral transition-colors group text-sm">
                  <MapPin className="w-4 h-4"/>
                  <span>Ubicación de nuestra biblioteca.</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </Link>
              </div>
            </div>


            <div className="text-center md:text-right">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 md:border-t-0 md:pt-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Desarrollado por estudiantes de Informática
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Biblioteca FCFYM. © Copyright 2025.
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Todos los derechos reservados.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center md:justify-end space-y-1 sm:space-y-0 sm:space-x-4 text-xs">
                <Link href="/terminos" className="text-coral dark:text-coral hover:text-coral-dark dark:hover:text-coral-light transition-colors">
                  Términos y Condiciones
                </Link>
                <span className="hidden sm:inline text-gray-400">|</span>
                <Link href="/privacidad" className="text-coral dark:text-coral hover:text-coral-dark dark:hover:text-coral-light transition-colors">
                  Políticas de privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>);
}
