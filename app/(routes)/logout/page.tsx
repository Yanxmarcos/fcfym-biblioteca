"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/authContext";
export default function LogoutPage() {
    const [isLoggingOut, setIsLoggingOut] = useState(true);
    const [loggedOut, setLoggedOut] = useState(false);
    const router = useRouter();
    const { logout } = useAuthContext();
    useEffect(() => {
        const performLogout = async () => {
            try {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                await new Promise(resolve => setTimeout(resolve, 1500));
                setIsLoggingOut(false);
                setLoggedOut(true);
                logout();
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
            catch (error) {
                console.error("Error durante el logout:", error);
                setIsLoggingOut(false);
            }
        };
        performLogout();
    }, [router]);
    return (<div className="container mx-auto py-12 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <Card className="border-2 shadow-sm text-center">
          <CardHeader className="px-6 pt-12 pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-coral rounded-full flex items-center justify-center">
              {isLoggingOut ? (<LogOut className="w-8 h-8 text-white animate-pulse"/>) : (<CheckCircle className="w-8 h-8 text-white"/>)}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isLoggingOut ? "Cerrando sesión..." : "Sesión cerrada"}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {isLoggingOut ? (<div className="space-y-4">
                <p className="text-gray-600">
                  Estamos cerrando tu sesión de forma segura.
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
                </div>
              </div>) : loggedOut ? (<div className="space-y-4">
                <p className="text-gray-600">
                  Tu sesión ha sido cerrada exitosamente.
                </p>
                <p className="text-sm text-gray-500">
                  Serás redirigido automáticamente en unos segundos...
                </p>
              </div>) : (<p className="text-red-600">
                Hubo un error al cerrar la sesión. Por favor, intenta nuevamente.
              </p>)}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-12">
            {loggedOut && (<>
                <Link href="/" className="w-full">
                  <Button className="bg-coral text-white border border-coral hover:bg-white hover:text-coral w-full">
                    Ir al inicio
                  </Button>
                </Link>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="border-2 border-coral text-coral hover:bg-coral hover:text-white w-full">
                    Iniciar sesión nuevamente
                  </Button>
                </Link>
              </>)}
            {!isLoggingOut && !loggedOut && (<Link href="/" className="w-full">
                <Button className="bg-coral text-white border border-coral hover:bg-white hover:text-coral w-full">
                  Volver al inicio
                </Button>
              </Link>)}
          </CardFooter>
        </Card>


        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? {" "}
            <Link href="/contacto" className="text-coral hover:underline font-medium">
              Contáctanos aquí
            </Link>
          </p>
        </div>
      </div>
    </div>);
}
