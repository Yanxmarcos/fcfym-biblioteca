import { NextResponse } from "next/server";
import { reservasUsuario, readOnlyResponse } from "@/lib/mock-data";

export async function GET() {
    const reservas = reservasUsuario.map(item => ({ ...item, nombres: "Usuario", apellido_paterno: "Demo", apellido_materno: "", email: "usuario@demo.com", tipo_usuario: "pregrado", total_reservas_pendientes: 1, en_prestamo: 0, usuario_en_posesion: null }));
    return NextResponse.json({ success: true, reservas, estadisticas: { total_reservas: reservas.length, requieren_aprobacion: 1, completadas: 1, canceladas: 0, expiradas: 0 } });
}

export async function PUT() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
