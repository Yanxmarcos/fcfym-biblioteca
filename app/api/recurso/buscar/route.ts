import { NextResponse } from "next/server";
import { buscarRecursos } from "@/lib/mock-data";

export async function GET(request: Request) {
    const query = new URL(request.url).searchParams.get("q") || "";
    return NextResponse.json({ success: true, recursos: buscarRecursos(query) });
}
