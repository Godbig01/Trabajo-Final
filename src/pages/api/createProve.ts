import type { APIContext } from "astro";
import { db, Proveedor, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  const session = context.locals.session;
  if (!session) {
    return new Response(JSON.stringify({ error: "Acceso no autorizado." }), {
      status: 401,
    });
  }

  // Obtener los datos del formulario
  const formData = await context.request.formData();

  const Ide = formData.get("nit") as string;
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const direccion = formData.get("direccion") as string;

  if (!Ide || !nombre || !telefono || !direccion) {
    return new Response(
      JSON.stringify({ error: "Todos los campos son obligatorios." }),
      { status: 400 }
    );
  }

  try {
    await db.insert(Proveedor).values({
      NIT: Ide,
      nombre,
      telefono,
      direccion,
    });
    return new Response(
      JSON.stringify({ message: "Proveedor creado exitosamente." }),
      { status: 201 }
    );
  } catch (error) {
    if (isDbError(error)) {
      return new Response(
        JSON.stringify({ error: "El nit ya existe o ha ocurrido un error." }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ error: "Ocurrió un error desconocido." }),
      { status: 500 }
    );
  }
}
