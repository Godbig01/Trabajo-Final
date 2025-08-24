import { lucia } from "@/auth";
import type { APIContext } from "astro";
import { db, Users, eq, Session, desc } from "astro:db";
import { Argon2id } from "oslo/password";

export async function POST(context: APIContext): Promise<Response> {
    // get the form data
    const formData = await context.request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // check if the username and password are not empty
    if (!username || !password) {
        return new Response(JSON.stringify({ success: false, error: "Datos incompletos" }), { status: 400 });
    }

    // check if the password is less than 4 characters
    if (password.length < 4) {
        return new Response(JSON.stringify({ success: false, error: "Contraseña demasiado corta" }), { status: 400 });
    }

    const foundUser = (await db.select().from(Users).where(eq(Users.name, username))).at(0);

    // no found user
    if (!foundUser) {
        return new Response(JSON.stringify({ success: false, error: "Usuario o contraseña incorrecta" }), { status: 401 });
    } 

    // check if the password is correct
    const validPassword = await new Argon2id().verify(foundUser.password, password);
    if (!validPassword) {
        return new Response(JSON.stringify({ success: false, error: "Usuario o contraseña incorrecta" }), { status: 401 });
    }

    // set the session
    const session = await lucia.createSession(foundUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    );

    return new Response(JSON.stringify({ success: true, redirect: "/app" }), { status: 200 });
}
