import { NextResponse } from "next/server";
import { buscarRecursos } from "@/lib/mock-data";

export async function GET(request: Request) {
    const query = new URL(request.url).searchParams.get("query") || "";
    return NextResponse.json({ recursos: buscarRecursos(query) });
}
