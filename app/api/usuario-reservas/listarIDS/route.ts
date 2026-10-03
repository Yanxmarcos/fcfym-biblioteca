import { NextResponse } from "next/server";
import { reservasUsuario } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ reservas: reservasUsuario });
}
