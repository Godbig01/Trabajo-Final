import type { APIContext } from "astro";
import { db, Productos, eq, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
    const session = context.locals.session;
    if (!session) {
        return new Response(JSON.stringify({ response: "Sesión no encontrada" }), { status: 401 });
    }
    const formData = await context.request.formData();

    const id = formData.get('hidePro') as string;
    const codigo = formData.get('codigo') as string;
    const nombre = formData.get('nombre') as string;
    const precio = formData.get('precio') as string;
    const cantidad = formData.get('cantidad') as string;
    const proveedor = formData.get('proveedor') as string;

    if (!codigo || !nombre || !precio || !cantidad || !proveedor) {
        return new Response(JSON.stringify({ response: "Faltan datos obligatorios" }), { status: 400 });
    }

    if(Number(cantidad) < 0){
        return new Response(JSON.stringify({ response: "La cantidad no puede ser menor a 0" }), { status: 400 });
    }

    try {
        await db.update(Productos).set({
            codigo,
            nombre,
            precio: Number(precio),
            cantidad: Number(cantidad),
            proveedor: Number(proveedor)
        }).where(eq(Productos.id, Number(id)));

        return new Response(JSON.stringify({ response: "Producto actualizado exitosamente" }), { status: 200 });
    } catch (e) {
        if (isDbError(e)) {
            return new Response(JSON.stringify({ response: "Ya hay un producto ingresado con este codigo o ha ocurrido un error" }), { status: 500 });
        }
        return new Response(JSON.stringify({ response: "Ha ocurrido un error inesperado" }), { status: 500 });
    }
}