import { NextResponse } from "next/server";
import { miBiblioteca } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ miBiblioteca });
}
