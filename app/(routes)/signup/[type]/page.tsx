'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, CreditCard, GraduationCap } from 'lucide-react';
import Image from 'next/image';
export default function SignupForm({ params }: {
    params: Promise<{
        type: string;
    }>;
}) {
    const router = useRouter();
    const unwrappedParams = React.use(params);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        dni: '',
        telefono: '',
        domicilio: '',
        numero_matricula: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const userTypeLabels = {
        pregrado: 'Estudiante de Pregrado',
        postgrado: 'Estudiante de Postgrado',
        docente: 'Docente'
    };
    const validateField = (name: string, value: string) => {
        const errors: Record<string, string> = {};
        switch (name) {
            case 'email':
                if (!value.includes('@'))
                    errors[name] = 'Formato de email inválido';
                break;
            case 'password':
                if (value.length < 8)
                    errors[name] = 'Mínimo 8 caracteres';
                break;
            case 'confirmPassword':
                if (value !== formData.password)
                    errors[name] = 'Las contraseñas no coinciden';
                break;
            case 'dni':
                if (value.length !== 8 || !/^\d+$/.test(value))
                    errors[name] = 'DNI debe tener 8 dígitos';
                break;
            case 'telefono':
                if (value && !/^\d{9}$/.test(value))
                    errors[name] = 'Formato: 9 dígitos';
                break;
        }
        return errors[name] || '';
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;
        if (['nombres', 'apellido_paterno', 'apellido_materno'].includes(name)) {
            newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        }
        if (['dni', 'telefono', 'numero_matricula'].includes(name)) {
            newValue = value.replace(/[^0-9]/g, '');
        }
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        const error = validateField(name, newValue);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tipo_usuario: unwrappedParams.type,
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error en el registro');
            }
            router.push('/login?registration=success');
        }
        catch (err) {
            console.error('Error:', err);
            setError(err instanceof Error ? err.message : 'Ocurrió un error al registrarse');
        }
        finally {
            setLoading(false);
        }
    };
    const handleBack = () => {
        router.push('/signup');
    };
    return (<div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100  py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button type="button" variant="outline" onClick={handleBack} className="flex items-center gap-2 border-[#F9A232] text-[#B26539] hover:bg-[#F7E0C0]">
              <ArrowLeft size={18}/>
              Volver
            </Button>

            <div className="text-center flex-1">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image src={`/${unwrappedParams.type}.png`} alt={userTypeLabels[unwrappedParams.type as keyof typeof userTypeLabels]} width={96} height={96} className="rounded-full border-4 border-[#F9A232] object-cover"/>
              </div>
              <h1 className="text-2xl font-bold text-[#B26539]">
                Registro de {userTypeLabels[unwrappedParams.type as keyof typeof userTypeLabels]}
              </h1>
              <p className="text-gray-600 mt-2">Completa todos los campos para crear tu cuenta</p>
            </div>

            <div className="w-20"></div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <span className="font-medium">Error:</span>
              {error}
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="border-l-4 border-[#F9A232] pl-6">
              <h2 className="text-lg font-semibold text-[#B26539] mb-4 flex items-center gap-2">
                <Lock size={20}/>
                Información de Acceso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Correo Institucional (UNT)*
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="pl-10 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="ejemplo@unitru.edu.pe"/>
                  </div>
                  {fieldErrors.email && (<p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Contraseña *
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                      <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="pl-10 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Mínimo 8 caracteres"/>
                    </div>
                    {fieldErrors.password && (<p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>)}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirmar Contraseña *
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                      <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="pl-10 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Repetir contraseña"/>
                    </div>
                    {fieldErrors.confirmPassword && (<p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>)}
                  </div>
                </div>
              </div>
            </div>


            <div className="border-l-4 border-[#F9A232] pl-6">
              <h2 className="text-lg font-semibold text-[#B26539] mb-4 flex items-center gap-2">
                <User size={20}/>
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="nombres" className="text-gray-700 font-medium">
                    Nombres *
                  </Label>
                  <Input id="nombres" name="nombres" type="text" value={formData.nombres} maxLength={20} onChange={handleChange} required className="mt-1 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Nombres completos"/>
                </div>

                <div>
                  <Label htmlFor="apellido_paterno" className="text-gray-700 font-medium">
                    Apellido Paterno *
                  </Label>
                  <Input id="apellido_paterno" name="apellido_paterno" type="text" value={formData.apellido_paterno} onChange={handleChange} maxLength={12} required className="mt-1 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Apellido paterno"/>
                </div>

                <div>
                  <Label htmlFor="apellido_materno" className="text-gray-700 font-medium">
                    Apellido Materno *
                  </Label>
                  <Input id="apellido_materno" name="apellido_materno" type="text" value={formData.apellido_materno} onChange={handleChange} maxLength={12} required className="mt-1 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Apellido materno"/>
                </div>
              </div>
            </div>


            <div className="border-l-4 border-[#F9A232] pl-6">
              <h2 className="text-lg font-semibold text-[#B26539] mb-4 flex items-center gap-2">
                <CreditCard size={20}/>
                Identificación y Datos Académicos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dni" className="text-gray-700 font-medium">
                    DNI *
                  </Label>
                  <Input id="dni" name="dni" type="text" value={formData.dni} onChange={handleChange} required maxLength={8} className="mt-1 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="12345678"/>
                  {fieldErrors.dni && (<p className="text-red-500 text-sm mt-1">{fieldErrors.dni}</p>)}
                </div>

                {unwrappedParams.type !== 'docente' && (<div>
                    <Label htmlFor="numero_matricula" className="text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16}/>
                        Número de Matrícula *
                      </div>
                    </Label>
                    <Input id="numero_matricula" name="numero_matricula" type="text" value={formData.numero_matricula} onChange={handleChange} maxLength={10} required={unwrappedParams.type !== 'docente'} className="mt-1 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Número de matrícula"/>
                  </div>)}
              </div>
            </div>


            <div className="border-l-4 border-gray-300 pl-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <Phone size={20}/>
                Información de Contacto <span className="text-sm font-normal">(Opcional)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="telefono" className="text-gray-700 font-medium">
                    Teléfono
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                    <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} maxLength={9} className="pl-10 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="987654321"/>
                  </div>
                  {fieldErrors.telefono && (<p className="text-red-500 text-sm mt-1">{fieldErrors.telefono}</p>)}
                </div>

                <div>
                  <Label htmlFor="domicilio" className="text-gray-700 font-medium">
                    Domicilio
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                    <Input id="domicilio" name="domicilio" type="text" value={formData.domicilio} onChange={handleChange} className="pl-10 border-gray-300 focus:border-[#F9A232] focus:ring-[#F9A232]" placeholder="Dirección completa"/>
                  </div>
                </div>
              </div>
            </div>


            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button type="button" variant="outline" onClick={handleBack} className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50" disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" className="px-8 py-3 bg-[#F9A232] text-white hover:bg-[#B26539] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" disabled={loading || Object.values(fieldErrors).some(error => error !== '')}>
                  {loading ? (<div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registrando...
                    </div>) : ('Completar Registro')}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                Los campos marcados con (*) son obligatorios
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
