import { NextResponse } from "next/server";
import { prestamosUsuario } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ success: true, prestamos: prestamosUsuario, total: prestamosUsuario.length });
}
