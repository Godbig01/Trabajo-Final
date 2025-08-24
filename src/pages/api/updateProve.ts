import type { APIContext } from "astro";
import { db, Proveedor, eq, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  const session = context.locals.session;
  if (!session) {
    return new Response(JSON.stringify({ response: "Sesión no encontrada" }), {
      status: 401,
    });
  }
  const formData = await context.request.formData();

  const id = formData.get("hideid") as string;
  const nit = formData.get("nit") as string;
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const direccion = formData.get("direccion") as string;

  if (!nombre || !telefono || !direccion) {
    return new Response(
      JSON.stringify({ response: "Faltan datos obligatorios" }),
      { status: 400 }
    );
  }

  try {
    await db
      .update(Proveedor)
      .set({
        NIT: nit,
        nombre,
        telefono,
        direccion,
      })
      .where(eq(Proveedor.id, Number(id)));
    return new Response(
      JSON.stringify({ response: "Proveedor actualizado exitosamente" }),
      { status: 200 }
    );
  } catch (e) {
    if (isDbError(e)) {
      return new Response(
        JSON.stringify({
          response:
            "El nit ya se encuentra registrado o ha ocurrido un error en la base de datos",
        }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ response: "Ha ocurrido un error inesperado" }),
      { status: 500 }
    );
  }
}
