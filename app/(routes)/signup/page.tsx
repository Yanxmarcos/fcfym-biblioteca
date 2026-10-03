'use client';
import { Card, CardDescription, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, GraduationCap, BookOpen } from 'lucide-react';
import Image from 'next/image';
export default function SignupPage() {
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const router = useRouter();
    const profiles = [
        {
            id: 'pregrado',
            title: 'Estudiante pregrado',
            icon: GraduationCap,
            description: 'Estudiante pregrado'
        },
        {
            id: 'postgrado',
            title: 'Estudiante postgrado',
            icon: BookOpen,
            description: 'Estudiante postgrado'
        },
        {
            id: 'docente',
            title: 'Docente',
            icon: User,
            description: 'Docente'
        }
    ];
    const handleContinue = () => {
        if (selectedProfile) {
            router.push(`/signup/${selectedProfile}`);
        }
    };
    return (<div className="container mx-auto py-8 px-14 bg-white dark:bg-[#0A0A0A] justify-center">
      <div className="flex max-w-6xl w-full gap-8">

        <Card className="border-2 shadow-sm w-1/3">
          <CardHeader className="px-6 pt-12 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              ¿Ya tienes cuenta?
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 text-center">
            <p className="mb-4 text-lg">
              Para iniciar sesión utilizar el{' '}
              <span className="font-semibold text-black dark:text-white">correo institucional</span> y la{' '}
              <span className="font-semibold text-black dark:text-white">contraseña</span> que usaste en tu registro.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-12 pt-6">
            <Link href="/login">
              <Button variant="outline" className="group relative overflow-hidden border-2 border-[#F9A232] text-[#F9A232] hover:text-white rounded-full px-10 py-7 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer select-none

              before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#F9A232] before:to-[#FFC300] before:opacity-0 before:transition-all before:duration-300 before:ease-in-out hover:before:opacity-100

              after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#F9A232] after:via-[#FFC300] after:to-[#F9A232] after:opacity-0 after:blur-sm after:-z-10 after:transition-all after:duration-300 hover:after:opacity-30

              shadow-md shadow-[#F9A232]/20 hover:shadow-[#F9A232]/40

              bg-gradient-to-r from-white to-[#F7E0C0]/20 hover:from-transparent hover:to-transparent

              backdrop-blur-sm

              focus:outline-none focus:ring-4 focus:ring-[#F9A232]/30 focus:ring-offset-2

              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                  </svg>
                  <span>Iniciar Sesión</span>

                </span>
              </Button>
            </Link>
          </CardFooter>
        </Card>


        <Card className="border-2 shadow-sm w-2/3">
          <CardHeader className="px-6 pt-8 pb-4">
            <CardTitle className="text-4xl font-bold text-center">
              Crear Cuenta en Biblioteca
            </CardTitle>
            <CardDescription className="text-center text-gray-700 dark:text-white">
              Por favor elige un perfil de usuario.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-4">

            <div className="flex justify-center gap-6">
              {profiles.map((profile) => {
            const IconComponent = profile.icon;
            return (<div key={profile.id} className="text-center w-1/3">

                    <div className={`w-24 h-24 mx-auto mb-3 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedProfile === profile.id
                    ? 'border-coral bg-coral/10'
                    : 'border-gray-300 hover:border-coral/50'}`} onClick={() => setSelectedProfile(profile.id)}>
                      <div className="text-center">
                        <Image src={`/${profile.id}.png`} alt={profile.id} width={60} height={60} className="w-full h-full object-cover rounded-full"/>

                      </div>
                    </div>


                    <Button variant="outline" className={`w-full px-4 py-2 text-sm font-medium border-2 transition-all duration-200 ${selectedProfile === profile.id
                    ? 'border-coral bg-coral text-white hover:bg-coral/90 dark:bg-coral dark:border-coral dark:hover:bg-coral/90 '
                    : 'border-gray-300 text-gray-700 hover:border-coral hover:text-coral dark:border-gray-100 dark:text-gray-100 dark:hover:text-coral'}`} onClick={() => setSelectedProfile(profile.id)}>
                      {profile.title}
                    </Button>
                  </div>);
        })}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-8 pt-4">
            <Button className={`px-8 py-4 text-base font-medium transition-all duration-200 rounded-full ${selectedProfile
            ? 'bg-coral text-white border-2 border-coral hover:bg-orange-700 hover:text-coral'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'}`} disabled={!selectedProfile} onClick={handleContinue}>
              Continuar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>);
}
