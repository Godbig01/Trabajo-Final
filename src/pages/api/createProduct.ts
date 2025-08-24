import type { APIContext } from "astro";
import { db, Productos, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  const session = context.locals.session;
  if (!session) {
    return new Response(JSON.stringify({ error: "Acceso no autorizado." }), {
      status: 401,
    });
  }

  const formData = await context.request.formData();

  const codigo = formData.get("codigo") as string;
  const nombre = formData.get("nombre") as string;
  const precio = formData.get("precio") as string;
  const cantidad = formData.get("cantidad") as string;
  const proveedor = formData.get("proveedor") as string;

  // console.log(proveedor);

  if (!codigo || !nombre || !precio || !cantidad || !proveedor) {
    return new Response(
      JSON.stringify({ error: "Todos los campos son obligatorios." }),
      { status: 400 }
    );
  }

  if (Number(cantidad) < 0) {
    return new Response(
      JSON.stringify({ error: "La cantidad no puede ser negativa." }),
      { status: 400 }
    );
  }

  try {
    await db.insert(Productos).values({
      codigo,
      nombre,
      precio: Number(precio),
      cantidad: Number(cantidad),
      proveedor: Number(proveedor),
    });
    // console.log("Producto creado exitosamente.");

    return new Response(
      JSON.stringify({ message: "Producto creado exitosamente." }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    if (isDbError(error)) {
      return new Response(
        JSON.stringify({
          error:
            "El codigo ingresado ya existe o ha ocurrió un error en la base de datos.",
        }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ error: "Ocurrió un error desconocido." }),
      { status: 500 }
    );
  }
}
