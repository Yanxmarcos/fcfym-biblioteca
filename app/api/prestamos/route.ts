import { NextResponse } from "next/server";
import { prestamosUsuario, readOnlyResponse } from "@/lib/mock-data";

export async function GET() {
    const prestamos = prestamosUsuario.map(item => ({ ...item, nombres: "Usuario", apellido_paterno: "Demo", apellido_materno: "", email: "usuario@demo.com", tipo_usuario: "pregrado", dias_atraso: 0, esta_atrasado: 0 }));
    return NextResponse.json({ success: true, prestamos, estadisticas: { total_prestamos: prestamos.length, activos: 1, devueltos: 1, atrasados: 0, perdidos: 0, vencidos: 0 } });
}

export async function PUT() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
