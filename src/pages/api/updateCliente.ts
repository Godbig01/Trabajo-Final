import type { APIContext } from "astro";
import { db, Clientes, eq, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
    const session = context.locals.session;
    if (!session) {
        return new Response(JSON.stringify({ error: "Acceso no autorizado." }), { status: 401 });
    }

    const formData = await context.request.formData();

    const identificacion = formData.get('cedula') as string;
    const nombre = formData.get('nombres') as string;
    const apellidos = formData.get('apellidos') as string;
    const telefono = formData.get('celular') as string;
    const correo = formData.get('correo') as string;
    const direccion = formData.get('direccion') as string;
    const ide = formData.get('hideCed') as string;

    if (!identificacion || !nombre || !telefono || !correo || !apellidos || !telefono) {
        return new Response(JSON.stringify({ error: "Todos los campos son obligatorios." }), { status: 400 });
    }

    try {
        await db.update(Clientes).set({
            identificacion: Number(identificacion),
            nombre,
            apellidos,
            telefono,
            correo,
            direccion
        }).where(eq(Clientes.identificacion, Number(ide)));
        return new Response(JSON.stringify({ message: "Cliente actualizado exitosamente." }), { status: 200 });
    } catch (e) {
        if (isDbError(e)) {
            return new Response(JSON.stringify({ error: "La cedula ingresada ya existe o ha ocurrido un error inesperado." }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Ocurrió un error desconocido." }), { status: 500 });
    }
}