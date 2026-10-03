import { NextResponse } from "next/server";
const DEMO_USER = {
    id: 1,
    tipo_usuario: "pregrado",
    nombres: "Usuario",
    apellido_paterno: "Demo",
    apellido_materno: "",
    dni: "00000000",
};
function toBase64Url(value: object) {
    return Buffer.from(JSON.stringify(value)).toString("base64url");
}
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
            return NextResponse.json({ success: false, message: "Ingresa un correo y una contraseña" }, { status: 400 });
        }
        const user = { ...DEMO_USER, email: email.trim() };
        const token = [
            toBase64Url({ alg: "none", typ: "JWT" }),
            toBase64Url({ ...user, demo: true }),
            "demo",
        ].join(".");
        return NextResponse.json({ success: true, token, user });
    }
    catch {
        return NextResponse.json({ success: false, message: "No se pudo iniciar la sesión demo" }, { status: 400 });
    }
}
