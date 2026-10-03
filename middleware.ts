import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from '@/lib/decode-token';
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get('authTokens')?.value;
    console.log('🔍 Middleware - Pathname:', pathname);
    console.log('🔍 Middleware - Has token:', !!authToken);
    const userRoutes = {
        pregrado: ['/biblioteca/usuario', '/biblioteca/usuario/:path*', '/mi-cuenta'],
        postgrado: ['/biblioteca/usuario', '/biblioteca/usuario/:path*', '/mi-cuenta'],
        docente: ['/biblioteca/usuario', '/biblioteca/usuario/:path*', '/mi-cuenta'],
        bibliotecario: ['/biblioteca/bibliotecario', '/biblioteca/bibliotecario/:path*', '/mi-cuenta']
    };
    let userType: string | null = null;
    if (authToken) {
        try {
            const decoded = decodeToken<{
                tipo_usuario?: string;
            }>(authToken);
            userType = decoded?.tipo_usuario || null;
            console.log('🔍 Middleware - User type:', userType);
        }
        catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    if (pathname.startsWith('/biblioteca/pregrado') ||
        pathname.startsWith('/biblioteca/postgrado') ||
        pathname.startsWith('/biblioteca/docente')) {
        console.log('🚫 Blocking access to old route:', pathname);
        const redirectPath = userType === 'bibliotecario' ? '/biblioteca/bibliotecario' : '/biblioteca/usuario';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    if (pathname === '/login' && userType) {
        const redirectPath = userType === 'bibliotecario' ? '/biblioteca/bibliotecario' : '/biblioteca/usuario';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    if (pathname === '/mi-cuenta' || pathname.startsWith('/mi-cuenta/')) {
        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    if (userType) {
        const allowedRoutes = userRoutes[userType as keyof typeof userRoutes] || [];
        const isAllowed = allowedRoutes.some(route => {
            const baseRoute = route.split('/:path')[0];
            return pathname.startsWith(baseRoute);
        });
        if (!isAllowed) {
            const redirectPath = userType === 'bibliotecario' ? '/biblioteca/bibliotecario' : '/biblioteca/usuario';
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
    }
    else {
        const allProtectedRoutes = Object.values(userRoutes).flat();
        const isProtected = allProtectedRoutes.some(route => {
            const baseRoute = route.split('/:path')[0];
            return pathname.startsWith(baseRoute);
        });
        if (isProtected) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        '/login',
        '/biblioteca/bibliotecario/:path*',
        '/biblioteca/usuario/:path*',
        '/mi-cuenta',
        '/mi-cuenta/:path*',
        '/biblioteca/pregrado/:path*',
        '/biblioteca/postgrado/:path*',
        '/biblioteca/docente/:path*'
    ],
};
