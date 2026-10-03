import { NextResponse } from "next/server";
import { miBiblioteca } from "@/lib/mock-data";

export async function GET(request: Request) {
    const bookId = Number(new URL(request.url).searchParams.get("bookId"));
    const book = miBiblioteca.find(item => item.id_recurso === bookId);
    return book
        ? NextResponse.json({ success: true, book })
        : NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
}
