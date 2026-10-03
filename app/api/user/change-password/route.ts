import { NextResponse } from "next/server";
import { readOnlyResponse } from "@/lib/mock-data";

export async function PUT() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
