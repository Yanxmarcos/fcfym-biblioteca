import { NextResponse } from "next/server";
import { recursos, readOnlyResponse } from "@/lib/mock-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const recurso = recursos.find(item => item.id_recurso === Number(id));
    return recurso
        ? NextResponse.json(recurso)
        : NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
}

export async function PUT() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}

export async function DELETE() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
