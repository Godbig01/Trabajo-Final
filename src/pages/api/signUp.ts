import type { APIContext } from "astro";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db, Users, isDbError } from "astro:db";
import { lucia } from "@/auth";

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return new Response(JSON.stringify({ error: "Usuario y contraseña necesarios" }), { status: 400 });
    }

    if (password.length < 4) {
        return new Response(JSON.stringify({ error: "La contraseña debe ser mayor a 4 caracteres." }), { status: 400 });
    }

    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);

    try {
        await db.insert(Users).values({
            id: userId,
            name: username,
            password: hashedPassword,
        });
    } catch (e) {
        if (isDbError(e)) {
            return new Response(JSON.stringify({ error: "Este usuario ya existe en la base de datos o ha ocurrido un error." }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Ha ocurrido un error." }), { status: 500 });
    }

    // generate session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(JSON.stringify({ message: "Usuario Registrado Correctamente." }), { status: 201 });
}