import type { APIContext } from "astro";
import { db, Clientes, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
    const session = context.locals.session;
    if (!session) {
        return new Response(JSON.stringify({ error: "Permiso Denegado." }), { status: 401 });
    }

    // get the form data
    const formData = await context.request.formData();

    const cedula = formData.get("cedula") as string;
    const nombre = formData.get("nombres") as string;
    const apellidos = formData.get("apellidos") as string;
    const telefono = formData.get("celular") as string;
    const correo = formData.get("correo") as string;
    const direccion = formData.get("direccion") as string;

    // validate the data
    if (!cedula || !nombre || !apellidos || !telefono || !correo || !direccion) {
        return new Response(JSON.stringify({ error: "Todos los campos son necesarios." }), { status: 400 });
    }

    // insert the data into the database
    try {
        await db.insert(Clientes).values({
            identificacion: Number(cedula),
            nombre,
            apellidos,
            telefono,
            correo,
            direccion
        });
        return new Response(JSON.stringify({ message: "Cliente Creado Correctamente" }), { status: 201 });
    } catch (error) {
        // console.log(error);
        
        if (isDbError(error)) {
            return new Response(JSON.stringify({ error: "La cedula de este cliente ya existe o ha ocurrido un error." }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Ha ocurrido un error." }), { status: 500 });
    }
}