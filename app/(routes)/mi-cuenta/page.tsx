"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/authContext';
import { Camera, Save, X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
interface UserProfile {
    id: number;
    email: string;
    tipo_usuario: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    telefono: string;
    domicilio: string;
    numero_matricula: string;
    dni: string;
    foto_perfil?: string;
}
interface FormErrors {
    [key: string]: string;
}
export default function AccountConfig() {
    const { userData, logout } = useAuthContext();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [tempPhoto, setTempPhoto] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [showSavePhotoButton, setShowSavePhotoButton] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (userData?.id) {
            fetchUserProfile();
        }
    }, [userData]);
    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`/api/user/profile?userId=${userData?.id}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile);
            }
        }
        catch (error) {
            console.error('Error al cargar perfil:', error);
            setMessage({ type: 'error', text: 'Error al cargar los datos del perfil' });
        }
        finally {
            setLoading(false);
        }
    };
    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!profile?.nombres.trim())
            newErrors.nombres = 'El nombre es requerido';
        if (!profile?.apellido_paterno.trim())
            newErrors.apellido_paterno = 'El apellido paterno es requerido';
        if (profile?.telefono && !/^\d{9}$/.test(profile.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 9 dígitos';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleInputChange = (field: string, value: string) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Solo se permiten archivos de imagen' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'La imagen debe ser menor a 5MB' });
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempPhoto(e.target?.result as string);
            setShowSavePhotoButton(true);
        };
        reader.readAsDataURL(file);
        setPhotoFile(file);
    };
    const handleSavePhoto = async () => {
        if (!photoFile)
            return;
        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('userId', userData?.id.toString() || '');
        formData.append('email', userData?.email || '');
        try {
            const response = await fetch('/api/user/upload-photo', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(prev => prev ? { ...prev, foto_perfil: data.photoUrl } : null);
                setMessage({ type: 'success', text: 'Foto actualizada correctamente' });
                setTempPhoto(null);
                setShowSavePhotoButton(false);
                window.location.reload();
            }
        }
        catch (error) {
            console.error('Error al subir foto:', error);
            setMessage({ type: 'error', text: 'Error al subir la foto' });
        }
    };
    const handleCancelPhoto = () => {
        setTempPhoto(null);
        setPhotoFile(null);
        setShowSavePhotoButton(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleProfileUpdate = async () => {
        if (!validateForm())
            return;
        setSaving(true);
        try {
            const response = await fetch('/api/user/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData?.id,
                    nombres: profile?.nombres,
                    apellido_paterno: profile?.apellido_paterno,
                    apellido_materno: profile?.apellido_materno,
                    telefono: profile?.telefono,
                    domicilio: profile?.domicilio
                })
            });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
                topRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
            else {
                setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
            }
        }
        catch (error) {
            console.error('Error al actualizar perfil:', error);
            setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
        }
        finally {
            setSaving(false);
        }
    };
    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Todos los campos de contraseña son requeridos' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
            return;
        }
        setSaving(true);
        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData?.id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            if (response.ok) {
                setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordForm(false);
            }
            else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Error al cambiar la contraseña' });
            }
        }
        catch (error) {
            console.error('Error al cambiar contraseña:', error);
            setMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B26539]"></div>
            </div>);
    }
    return (<div className="min-h-screen bg-white px-4 pt-5 pb-8">
            <div className="max-w-4xl mx-auto" ref={topRef}>
                <h1 className="text-3xl font-bold text-[#B26539] mb-8 text-center">
                    CONFIGURACIÓN DE MI CUENTA
                </h1>

                {message.text && (<div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                        {message.text}
                    </div>)}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#F7E0C0]">
                            <h2 className="text-xl font-semibold text-[#B26539] mb-4 text-center">
                                Foto de Perfil
                            </h2>

                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 mb-4">
                                    <div className="w-full h-full rounded-full bg-[#F7E0C0] flex items-center justify-center overflow-hidden border-4 border-[#F9A232]">
                                        {tempPhoto ? (<img src={tempPhoto} alt="Previsualización de foto" className="w-full h-full object-cover"/>) : profile?.foto_perfil ? (<img src={profile.foto_perfil} alt="Foto de perfil" className="w-full h-full object-cover"/>) : (<span className="text-[#B26539] text-2xl font-bold">
                                                {profile?.nombres.charAt(0)}{profile?.apellido_paterno.charAt(0)}
                                            </span>)}
                                    </div>

                                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-[#F9A232] rounded-full flex items-center justify-center text-white hover:bg-[#B26539] transition-colors shadow-lg">
                                        <Camera size={20}/>
                                    </button>
                                </div>

                                <input ref={fileInputRef} type="file" accept=".png, .jpg, .jpeg" onChange={handlePhotoUpload} className="hidden"/>

                                {showSavePhotoButton && (<div className="flex gap-2 mt-2">
                                        <button disabled title="Deshabilitado en la demo de solo lectura" onClick={handleSavePhoto} className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed transition-colors">
                                            Guardar Foto
                                        </button>
                                        <button onClick={handleCancelPhoto} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                            Cancelar
                                        </button>
                                    </div>)}

                                {!showSavePhotoButton && (<p className="text-sm text-gray-600 text-center">
                                        Haz clic en el ícono de cámara para cambiar tu foto
                                    </p>)}
                            </div>
                        </div>
                    </div>


                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#F7E0C0]">
                            <h2 className="text-xl font-semibold text-[#B26539] mb-6">
                                Información Personal
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico
                                        </label>
                                        <input type="email" value={profile?.email || ''} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            DNI
                                        </label>
                                        <input type="text" value={profile?.dni || ''} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Usuario
                                        </label>
                                        <input type="text" value={profile?.tipo_usuario || ''} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed capitalize"/>
                                    </div>

                                    {(profile?.tipo_usuario === 'pregrado' || profile?.tipo_usuario === 'postgrado') && (<div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de Matrícula
                                            </label>
                                            <input type="text" value={profile?.numero_matricula || ''} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"/>
                                        </div>)}
                                </div>


                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombres *
                                        </label>
                                        <input type="text" value={profile?.nombres || ''} onChange={(e) => handleInputChange('nombres', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232] ${errors.nombres ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ingresa tus nombres"/>
                                        {errors.nombres && (<p className="mt-1 text-sm text-red-600">{errors.nombres}</p>)}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Apellido Paterno *
                                        </label>
                                        <input type="text" value={profile?.apellido_paterno || ''} onChange={(e) => handleInputChange('apellido_paterno', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232] ${errors.apellido_paterno ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ingresa tu apellido paterno"/>
                                        {errors.apellido_paterno && (<p className="mt-1 text-sm text-red-600">{errors.apellido_paterno}</p>)}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Apellido Materno
                                        </label>
                                        <input type="text" value={profile?.apellido_materno || ''} onChange={(e) => handleInputChange('apellido_materno', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232]" placeholder="Ingresa tu apellido materno"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <input type="text" value={profile?.telefono || ''} onChange={(e) => handleInputChange('telefono', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232] ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ingresa tu teléfono" maxLength={9}/>
                                        {errors.telefono && (<p className="mt-1 text-sm text-red-600">{errors.telefono}</p>)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Domicilio
                                </label>
                                <textarea value={profile?.domicilio || ''} onChange={(e) => handleInputChange('domicilio', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232]" placeholder="Ingresa tu domicilio" rows={3}/>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button onClick={handleProfileUpdate} disabled title="Deshabilitado en la demo de solo lectura" className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed transition-colors disabled:opacity-50">
                                    <Save size={20}/>
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mt-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#F7E0C0]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-[#B26539]">
                                Cambiar Contraseña
                            </h2>
                            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className={`
    inline-flex items-center gap-2
    px-4 py-2
    rounded-full
    bg-[#F9A232] text-white
    hover:bg-[#B26539] hover:text-white
    focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2
    transition-all duration-200 shadow-md
  `}>
  {showPasswordForm ? (<>
      <X size={20}/>
      <span>Cancelar cambio</span>
    </>) : (<>
      <span>Haz clic para cambiar</span>
    </>)}
    </button>

                        </div>

                        {showPasswordForm && (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña Actual
                                    </label>
                                    <input type={showPasswords.current ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232] pr-12" placeholder="Contraseña actual"/>
                                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} className="absolute right-3 top-11 text-gray-500 hover:text-gray-700">
                                        {showPasswords.current ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva Contraseña
                                    </label>
                                    <input type={showPasswords.new ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232] pr-12" placeholder="Nueva contraseña"/>
                                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} className="absolute right-3 top-11 text-gray-500 hover:text-gray-700">
                                        {showPasswords.new ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Contraseña
                                    </label>
                                    <input type={showPasswords.confirm ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A232] pr-12" placeholder="Confirmar contraseña"/>
                                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} className="absolute right-3 top-11 text-gray-500 hover:text-gray-700">
                                        {showPasswords.confirm ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>)}

                        {showPasswordForm && (<div className="mt-6 flex justify-end">
                                <button onClick={handlePasswordChange} disabled title="Deshabilitado en la demo de solo lectura" className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed transition-colors disabled:opacity-50">
                                    <Save size={20}/>
                                    {saving ? 'Cambiando...' : 'Guardar contraseña'}
                                </button>
                            </div>)}
                    </div>
                </div>
            </div>
        </div>);
}
