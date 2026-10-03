"use client";
import { ReactNode, createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decodeToken } from '@/lib/decode-token';
import { useRouter } from "next/navigation";
type AuthTokens = string;
interface UserData {
    id: number;
    email: string;
    tipo_usuario: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
}
interface AuthContextType {
    login: (authTokens: AuthTokens) => void;
    logout: () => void;
    isAuthenticated: boolean;
    userType: string | null;
    userData: UserData | null;
    checkAuth: () => boolean;
}
export const AuthContext = createContext<AuthContextType>({
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    userType: null,
    userData: null,
    checkAuth: () => false
});
export default function AuthContextProvider({ children, }: {
    children: ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    useEffect(() => {
        const token = Cookies.get("authTokens");
        if (token) {
            try {
                const decoded = decodeToken<UserData>(token);
                if (!decoded)
                    throw new Error('Token inválido');
                setIsAuthenticated(true);
                setUserType(decoded?.tipo_usuario || null);
                setUserData({
                    id: decoded.id,
                    email: decoded.email,
                    tipo_usuario: decoded.tipo_usuario,
                    nombres: decoded.nombres,
                    apellido_paterno: decoded.apellido_paterno,
                    apellido_materno: decoded.apellido_materno,
                    dni: decoded.dni
                });
            }
            catch (error) {
                console.error('Error decoding token:', error);
                Cookies.remove("authTokens", { path: '/' });
                setIsAuthenticated(false);
                setUserType(null);
                setUserData(null);
            }
        }
    }, [router]);
    const login = useCallback(function (authTokens: string) {
        console.log('🍪 Setting cookie with token:', authTokens ? 'Token received' : 'No token');
        try {
            Cookies.set("authTokens", authTokens, {
                expires: 1,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            const decoded = decodeToken<UserData>(authTokens);
            if (!decoded)
                throw new Error('Token inválido');
            const userType = decoded?.tipo_usuario || null;
            setUserData({
                id: decoded.id,
                email: decoded.email,
                tipo_usuario: decoded.tipo_usuario,
                nombres: decoded.nombres,
                apellido_paterno: decoded.apellido_paterno,
                apellido_materno: decoded.apellido_materno,
                dni: decoded.dni
            });
            setUserType(userType);
            setIsAuthenticated(true);
            console.log('✅ User authenticated as:', userType);
            const savedCookie = Cookies.get("authTokens");
            console.log('🍪 Cookie saved successfully:', !!savedCookie);
            if (userType === 'bibliotecario') {
                router.push('/biblioteca/bibliotecario');
            }
            else if (userType === 'pregrado' || userType === 'postgrado' || userType === 'docente') {
                router.push('/biblioteca/usuario');
            }
            else {
                router.push('/');
            }
        }
        catch (error) {
            console.error('❌ Error setting cookie:', error);
            setIsAuthenticated(false);
            setUserType(null);
        }
    }, [router]);
    const logout = useCallback(function () {
        console.log('🍪 Removing cookie...');
        Cookies.remove("authTokens", { path: '/' });
        setIsAuthenticated(false);
        setUserType(null);
        setUserData(null);
        const remainingCookie = Cookies.get("authTokens");
        console.log('🍪 Cookie removed:', !remainingCookie);
        router.push('/login');
    }, [router]);
    const checkAuth = useCallback(function (): boolean {
        const token = Cookies.get("authTokens");
        if (!token) {
            setIsAuthenticated(false);
            setUserType(null);
            return false;
        }
        try {
            const decoded = decodeToken<{
                tipo_usuario?: string;
            }>(token);
            const isValid = !!decoded;
            setIsAuthenticated(isValid);
            setUserType(decoded?.tipo_usuario || null);
            return isValid;
        }
        catch (error) {
            console.error('Error verifying token:', error);
            setIsAuthenticated(false);
            setUserType(null);
            return false;
        }
    }, []);
    const value = useMemo(() => ({
        login,
        logout,
        isAuthenticated,
        userType,
        userData,
        checkAuth
    }), [login, logout, isAuthenticated, userType, userData, checkAuth]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
}
