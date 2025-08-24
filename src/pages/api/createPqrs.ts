import type { APIContext } from "astro";
import { db, PQRS as PQRSModel, isDbError } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  const session = context.locals.session;
  if (!session) {
    return new Response(JSON.stringify({ error: "Acceso no autorizado." }), {
      status: 401,
    });
  }

  const formData = await context.request.formData();

  const asunto = formData.get("asunto") as string;
  const message = formData.get("message") as string;

  console.log(asunto, message);

  if (!asunto || !message) {
    return new Response(
      JSON.stringify({ error: "Los campos asunto y message son requeridos." }),
      {
        status: 400,
      }
    );
  }

  try {
    await db.insert(PQRSModel).values({
      asunto,
      mensaje: message,
      fecha_creacion: new Date().toISOString(),
    });
  } catch (e) {
    if (isDbError(e)) {
      return new Response(
        JSON.stringify({ error: "Error en la base de datos" }),
        {
          status: 500,
        }
      );
    }
    return new Response(
      JSON.stringify({
        error: "Ha ocurrido un error inesperado creando la PQRS.",
      }),
      {
        status: 500,
      }
    );
  }

  return new Response(
    JSON.stringify({
      messageResponse: "PQRS creada exitosamente.",
      asunto,
      message,
    }),
    {
      status: 201,
    }
  );
}
