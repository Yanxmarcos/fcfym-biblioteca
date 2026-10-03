import { NextResponse } from "next/server";
import { demoUser } from "@/lib/mock-data";

export async function GET(request: Request) {
    const email = new URL(request.url).searchParams.get("email");
    return NextResponse.json({ profile: { ...demoUser, email: email || demoUser.email } });
}
