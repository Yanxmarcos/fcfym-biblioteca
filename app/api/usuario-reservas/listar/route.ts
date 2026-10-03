import { NextResponse } from "next/server";
import { reservasUsuario } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ success: true, reservas: reservasUsuario, total: reservasUsuario.length });
}
