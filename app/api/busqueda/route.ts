import { NextResponse } from "next/server";
import { buscarRecursos, demoUser } from "@/lib/mock-data";

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type");
    const resultados = type === "usuarios"
        ? [{ ...demoUser, prestamos_activos: 1, reservas_activas: 1, recursos_biblioteca: 4, reclamos: 1 }]
        : buscarRecursos(query);
    return NextResponse.json({ success: true, type, query, resultados, total: resultados.length });
}
