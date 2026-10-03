'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
const libraryImages = [
    '/biblio/1.jpg',
    '/biblio/2.jpg',
    '/biblio/3.jpg',
    '/biblio/4.jpg',
    '/biblio/5.jpg',
    '/biblio/6.jpg',
    '/biblio/7.jpg',
    '/biblio/8.jpg',
    '/biblio/9.jpg',
];
export default function AboutLibrary() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => prevIndex === libraryImages.length - 1 ? 0 : prevIndex + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (<div className="relative w-full min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">

      <div className="relative z-10 flex min-h-screen">

        <div className="w-full lg:w-1/2 px-0 py-0 lg:px-16 lg:py-24 max-w-2xl mx-auto">
          <div className="mb-12">
            <div className="w-16 h-2 bg-coral dark:bg-coral mb-4"></div>
            <h1 className="text-4xl lg:text-5xl font-bold text-coral dark:text-coral">
              Sobre la biblioteca
            </h1>
          </div>
          <div className="mb-16 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              La Biblioteca de la Facultad de Ciencias Físicas y Matemáticas ofrece una
              amplia gama de servicios y una variada colección de recursos de información
              académica, tanto impresos como digitales, destinados a respaldar la
              investigación, la enseñanza y el aprendizaje.
            </p>
          </div>
        <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">

            <div className="flex items-start">
              <div className="mr-4 mt-1 text-coral dark:text-coral">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-coral dark:text-coral mb-4">
                  Visión
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Ser el núcleo de información y modelo de biblioteca que proporciona servicios
                  de información vanguardista tanto a nuestra comunidad interna de la facultad
                  como a la externa.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start">
              <div className="mr-4 mt-1 text-coral dark:text-coral">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-coral dark:text-coral mb-4">
                  Misión
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Ser una plataforma esencial para la información y la difusión del
                  conocimiento en áreas científicas, tecnológicas y humanísticas.
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="hidden lg:block lg:w-1/2 relative">

          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
            <Image src={libraryImages[currentImageIndex]} alt="Biblioteca de la Facultad de Ciencias Físicas y Matemáticas" fill className="object-cover" priority/>
          </div>




          <div className="absolute bottom-8 right-8 flex space-x-2 z-20">
            {libraryImages.map((_, index) => (<button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-coral' : 'bg-gray-300'}`} aria-label={`Mostrar imagen ${index + 1}`}/>))}
          </div>
        </div>
      </div>
    </div>);
}
