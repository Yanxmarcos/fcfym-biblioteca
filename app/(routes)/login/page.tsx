"use client";
import React, { FormEvent, useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from 'react';
import { Info, Eye, EyeOff, X, CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, title, message }) => {
    if (!isOpen)
        return null;
    const isSuccess = type === 'success';
    const IconComponent = isSuccess ? CheckCircle : AlertCircle;
    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 transition-opacity" onClick={onClose}/>

      <div className={`relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 ${borderColor} border-4 ${bgColor}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <IconComponent className={`h-6 w-6 ${iconColor}`}/>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cerrar">
            <X className="h-5 w-5"/>
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200">
          <Button onClick={onClose} className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${isSuccess
            ? 'bg-green-500 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'}`}>
            Entendido
          </Button>
        </div>
      </div>
    </div>);
};
interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [errors, setErrors] = useState<string[]>([]);
    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setStep('form');
            setErrors([]);
            setIsLoading(false);
        }
    }, [isOpen]);
    const validateEmail = (email: string): string[] => {
        const errors: string[] = [];
        if (!email) {
            errors.push('El correo electrónico es requerido');
            return errors;
        }
        if (!email.includes('@')) {
            errors.push('Ingresa un correo electrónico válido');
            return errors;
        }
        if (!email.endsWith('@unitru.edu.pe')) {
            errors.push('Debe ser un correo institucional (@unitru.edu.pe)');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Formato de correo electrónico inválido');
        }
        return errors;
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateEmail(email);
        setErrors(validationErrors);
        if (validationErrors.length > 0) {
            return;
        }
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStep('success');
        }
        catch (error) {
            setErrors(['Ha ocurrido un error. Intenta nuevamente.']);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleBackToForm = () => {
        setStep('form');
        setEmail('');
        setErrors([]);
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/30 transition-opacity duration-300" onClick={onClose}/>


      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
        {step === 'form' ? (<>

            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                  <Mail className="h-5 w-5 text-orange-600"/>
                </div>
                <h3 className="text-xl font-bold text-gray-900">¿Olvidaste tu contraseña?</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar modal">
                <X className="h-5 w-5"/>
              </button>
            </div>


            <div className="p-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Cambia tu contraseña por correo electrónico o solicita ayuda de manera presencial en la biblioteca.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recovery-email" className="text-sm font-semibold text-gray-700">
                    Correo electrónico institucional
                  </Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Te enviaremos un enlace para cambiar tu contraseña a tu dirección de correo electrónico institucional registrada.
                  </p>

                  <div className="relative">
                    <Input id="recovery-email" type="email" placeholder="Correo institucional" value={email} onChange={(e) => {
                setEmail(e.target.value);
                setErrors([]);
            }} disabled={isLoading} className={`pl-4 pr-4 py-3 text-base border-2 transition-all duration-200 ${errors.length > 0
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`} autoComplete="email" autoFocus/>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400"/>
                    </div>
                  </div>

                  {errors.length > 0 && (<div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      {errors.map((error, index) => (<p key={index} className="text-sm text-red-700 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/>
                          {error}
                        </p>))}
                    </div>)}
                </div>

                <Button type="submit" disabled={isLoading || !email} className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {isLoading ? (<div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>) : ('Enviar correo')}
                </Button>
              </form>
            </div>
          </>) : (<>

            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600"/>
                </div>
                <h3 className="text-xl font-bold text-gray-900">¡Correo enviado!</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar modal">
                <X className="h-5 w-5"/>
              </button>
            </div>


            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-600"/>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900">Revisa tu correo electrónico</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Hemos enviado un enlace de recuperación de contraseña a:
                  </p>
                  <p className="font-medium text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                    {email}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-800 font-medium mb-2">Importante:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Revisa tu bandeja de entrada y spam</li>
                    <li>• El enlace expira en 24 horas</li>
                    <li>• Si no recibes el correo, intenta nuevamente</li>
                  </ul>
                </div>
              </div>
            </div>


            <div className="flex space-x-3 p-6 border-t border-gray-100">
              <Button onClick={handleBackToForm} variant="outline" className="flex-1 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Volver
              </Button>
              <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                Entendido
              </Button>
            </div>
          </>)}
      </div>
    </div>);
};
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthContext();
    const [showRequirements, setShowRequirements] = useState(false);
    const [isPressInfoContra_Login, setPressInfoContra_Login] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error',
        title: '',
        message: ''
    });
    const showModal = (type: 'success' | 'error', title: string, message: string) => {
        setModal({
            isOpen: true,
            type,
            title,
            message
        });
    };
    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };
    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                let errorTitle = 'Error de autenticación';
                let errorMessage = data.message || 'Error en el inicio de sesión';
                if (response.status === 401) {
                    errorTitle = 'Credenciales inválidas';
                    errorMessage = 'El correo o la contraseña son incorrectos. Por favor verifica tus datos.';
                }
                else if (response.status === 429) {
                    errorTitle = 'Demasiados intentos';
                    errorMessage = 'Has excedido el número de intentos permitidos. Intenta nuevamente en unos minutos.';
                }
                else if (response.status >= 500) {
                    errorTitle = 'Error del servidor';
                    errorMessage = 'Estamos experimentando problemas técnicos. Por favor intenta más tarde.';
                }
                showModal('error', errorTitle, errorMessage);
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
            showModal('success', '¡Bienvenido!', 'Has iniciado sesión correctamente. Serás redirigido en un momento.');
            login(data.token);
        }
        catch (error) {
            console.error('Login error:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<>
      <div className="container mx-auto py-8 bg-white dark:bg-[#0A0A0A] justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          <Card className="border-2 shadow-sm">
            <CardHeader className="px-6 pt-7 pb-5">
              <CardTitle className="text-2xl font-bold text-center">
                Inicio de sesión en la Biblioteca
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="px-6 space-y-6">
                <p className="text-center">
                  Esta es una demostración. Ingresa cualquier correo y cualquier contraseña.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo</Label>
                    <Input id="email" type="email" placeholder="usuario@demo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required/>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                    </div>
                    <div className="flex">
                      <div className="relative w-full">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Ingresa tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} maxLength={40} required/>
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#F9A232]" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>

                      <div className="flex justify-end ml-2">
                        <button type="button" title="Click aquí para ver requisitos de la contraseña." onClick={() => {
            setShowRequirements(prev => !prev);
            setPressInfoContra_Login(prev => !prev);
        }}>
                          <Info size={20} className={` ${isPressInfoContra_Login ? 'text-[#F9A232] dark:text-[#F9A232]' : 'text-gray dark:text-white'}`}/>
                        </button>
                      </div>
                    </div>

                    {showRequirements && (<div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Acceso de demostración:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#F9A232] mr-2"></span>
                            Puedes escribir cualquier contraseña
                          </li>
                          <li className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#F9A232] mr-2"></span>
                            No se consulta ni se guarda en una base de datos
                          </li>
                        </ul>
                      </div>)}
                  </div>
                  <div className="text-center mb-5">
                    <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="text-[#F9A232] hover:text-[#B26539] hover:underline text-sm font-medium transition-colors duration-200">
                      ¿Olvidaste tu contraseña? Presiona aquí.
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pb-7">
                <Button type="submit" disabled={isLoading} className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                  {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                </Button>
              </CardFooter>
            </form>
          </Card>


          <Card className="border-2 shadow-sm">
            <CardHeader className="px-6 pt-12 pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                ¿Eres nuevo?
              </CardTitle>
            </CardHeader>
            <CardContent className="px-10 text-center">
              <p className="text-lg">
                Si aún no tienes cuenta en la plataforma, presiona en el
                botón de abajo para crear un cuenta.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-12 pt-6">
              <Link href="/signup">
                <Button variant="outline" className="group relative overflow-hidden border-2 border-[#F9A232] text-[#F9A232] hover:text-white rounded-full px-10 py-7 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer select-none

              before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#F9A232] before:to-[#FFC300] before:opacity-0 before:transition-all before:duration-300 before:ease-in-out hover:before:opacity-100

              after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#F9A232] after:via-[#FFC300] after:to-[#F9A232] after:opacity-0 after:blur-sm after:-z-10 after:transition-all after:duration-300 hover:after:opacity-30

              shadow-md shadow-[#F9A232]/20 hover:shadow-[#F9A232]/40

              bg-gradient-to-r from-white to-[#F7E0C0]/20 hover:from-transparent hover:to-transparent

              backdrop-blur-sm

              focus:outline-none focus:ring-4 focus:ring-[#F9A232]/30 focus:ring-offset-2

              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Crear cuenta</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>


      <Modal isOpen={modal.isOpen} onClose={closeModal} type={modal.type} title={modal.title} message={modal.message}/>


      <ForgotPasswordModal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)}/>
    </>);
}
