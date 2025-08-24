import { db, PQRS as PQRSModel, isDbError } from "astro:db";

export async function getPQRS() {
  try {
    const PQRS = await db.select().from(PQRSModel);

    return { PQRS, error: null };
  } catch (e) {
    if (isDbError(e)) {
      return { PQRS: [], error: "Error en la base de datos" };
    }
    return { error: "Ha ocurrido un error inesperado mostrando los PQRS" };
  }
}
