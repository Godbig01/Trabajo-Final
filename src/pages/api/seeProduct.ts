import { db, Productos, Proveedor, isDbError, eq } from "astro:db";

export async function getProducto() {
  try {
    const productos = await db
      .select()
      .from(Productos)
      .innerJoin(Proveedor, eq(Productos.proveedor, Proveedor.id));
    return { productos, error: null };
  } catch (e) {
    if (isDbError(e)) {
      return { productos: [], error: "Error en la base de datos" };
    }
    return { error: "Ha ocurrido un error inesperado" };
  }
}
export async function getProductoWithOutProvider() {
  try {
    const productos = await db.select().from(Productos);
    return { productos, error: null };
  } catch (e) {
    if (isDbError(e)) {
      return { productos: [], error: "Error en la base de datos" };
    }
    return {
      productos: [],
      error: "Ha ocurrido un error mostrando los productos",
    };
  }
}
export async function getProductoData(id: any) {
  try {
    const productos = await db
      .select()
      .from(Productos)
      .innerJoin(Proveedor, eq(Productos.proveedor, Proveedor.id))
      .where(eq(id, Productos.id));
    if (productos.length > 0) {
      return { productos, error: null };
    } else {
      return {
        productos: [],
        error: "Ha ocurrido un error inesperado mostrando los datos",
      };
    }
  } catch (e) {
    if (isDbError(e)) {
      return { productos: [], error: "Error en la base de datos" };
    }
    return {
      productos: [],
      error: "Ha ocurrido un error mostrando los productos",
    };
  }
}
