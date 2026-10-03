import { NextResponse } from "next/server";
import { recursos } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({
        success: true,
        totalMateriales: recursos.length,
        materialesPorTipo: [{ tipo: "Libro", cantidad: recursos.length }],
        inventario: { disponibles: 5, prestados: 2, reservados: 1 },
        movimientos: { prestamos: 7, devoluciones: 5, renovaciones: 2, reservas: 4 },
        solicitados: recursos.slice(0, 5).map((item, index) => ({ titulo: item.titulo, autor: item.autor, solicitudes: 10 - index })),
        materialesMensuales: [
            { mes: "May", disponibles: 5, ocupados: 3 },
            { mes: "Jun", disponibles: 6, ocupados: 2 },
            { mes: "Jul", disponibles: 4, ocupados: 4 },
            { mes: "Ago", disponibles: 5, ocupados: 3 },
            { mes: "Sep", disponibles: 6, ocupados: 2 },
            { mes: "Oct", disponibles: 5, ocupados: 3 }
        ],
        totalReclamos: 2
    });
}
