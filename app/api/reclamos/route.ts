import { NextResponse } from "next/server";
import { readOnlyResponse, recursos } from "@/lib/mock-data";

const reclamos = [
    { id: 1, usuario_id: 1, recurso_id: 1, fecha_reclamo: "2026-09-25", razon: "Enlace de prueba", descripcion: "Reporte ilustrativo para la demostración.", estado: "pendiente", fecha_resolucion: null, prioridad: "media", tipo_reclamo: "acceso", recurso_titulo: recursos[0].titulo, recurso_portada: recursos[0].portada, usuario_nombre: "Usuario Demo", usuario_email: "usuario@demo.com" }
];

export async function GET() {
    return NextResponse.json({ reclamos, estadisticas: { total_pendientes: 1, total_resueltos: 0, total_alta_prioridad: 0, promedio_resolucion_dias: 0 }, success: true });
}

export async function PUT() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
