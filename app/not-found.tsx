'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Image from 'next/image';
export default function NotFound() {
    return (<div className="my-10 bg-white dark:bg-white flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-4xl lg:text-5xl font-bold text-[#B26539] mb-5">
          ¡Oops! Página no encontrada (404)
        </h1>


        <div className="flex justify-center items-center mb-5">
          <Image src="/dribbble_1.gif" alt="Página no encontrada" width={600} height={600} className="object-cover"/>
        </div>


        <div className="w-full h-1 bg-coral mb-3"></div>


        <p className="text-xl text-black mb-3 font-medium">
          Parece que la página que estás buscando no existe o ha sido movida.
        </p>

        <p className="text-lg text-black mb-5">
          Puedes regresar al inicio y continuar desde allí.
        </p>


        <Link href="/">
              <Button className="flex mx-auto space-x-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                <Home className="w-12 h-12" aria-hidden="true"/>
                <span className='font-bold text-sm'>IR A INICIO</span>
              </Button>
        </Link>
      </div>
    </div>);
}
