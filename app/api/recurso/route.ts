import { NextResponse } from "next/server";
import { recursos, readOnlyResponse } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ success: true, recursos });
}

export async function POST() {
    return NextResponse.json(readOnlyResponse, { status: 403 });
}
