import { NextResponse } from "next/server";
import { readOnlyResponse } from "@/lib/mock-data";

export async function POST() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
