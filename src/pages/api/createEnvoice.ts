import type { APIContext } from "astro";
import {
  db,
  Facturas,
  DetalleFactura,
  isDbError,
  eq,
  Productos,
} from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
  // console.log("POST /api/createEnvoice");

  const session = context.locals.session;
  if (!session) {
    return context.redirect("/");
  }

  const changes: { id: number; originalQuantity: number }[] = [];
  let idFactura: number | undefined;

  try {
    const formData = await context.request.json();
    const { cliente, productos: ProductosFactura, total, fecha } = formData;

    if (!cliente || !ProductosFactura || !total) {
      return new Response(
        JSON.stringify({ error: true, message: "Datos incorrectos" }),
        { status: 400 }
      );
    }

    const { lastInsertRowid } = await db.insert(Facturas).values({
      identificacion_cliente: cliente,
      valor_total: total,
      fecha_creacion: fecha,
    });

    idFactura = lastInsertRowid ? Number(lastInsertRowid) : undefined;

    if (!idFactura) {
      return new Response(
        JSON.stringify({
          error: `No se pudo crear la factura`,
        }),
        { status: 400 }
      );
    }

    for (const producto of ProductosFactura) {
      const { id, quantity, price, name } = producto;
      const productoEncontrado = await db
        .select()
        .from(Productos)
        .where(eq(Productos.id, id));

      if (
        productoEncontrado.length === 0 ||
        quantity > productoEncontrado[0].cantidad
      ) {
        for (const change of changes) {
          await db
            .update(Productos)
            .set({ cantidad: change.originalQuantity })
            .where(eq(Productos.id, change.id));
        }

        if (idFactura) {
          await db
            .delete(DetalleFactura)
            .where(eq(DetalleFactura.id_factura, idFactura));
          await db.delete(Facturas).where(eq(Facturas.id, idFactura));
        }

        return new Response(
          JSON.stringify({
            error: `No hay suficiente cantidad del producto ${name}\nCantidad disponible: ${productoEncontrado[0].cantidad}`,
          }),
          { status: 400 }
        );
      }

      await db.insert(DetalleFactura).values({
        id_factura: idFactura,
        id_producto: id,
        cantidad_producto: quantity,
        precio_producto: price,
        precio_producto_total: price * quantity,
      });

      const newQuantity = productoEncontrado[0].cantidad - quantity;
      await db
        .update(Productos)
        .set({ cantidad: newQuantity })
        .where(eq(Productos.id, id));

      changes.push({ id, originalQuantity: productoEncontrado[0].cantidad });
    }
    // throw new Error("Error de prueba");
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);

    // Revertir los cambios en el inventario
    for (const change of changes) {
      await db
        .update(Productos)
        .set({ cantidad: change.originalQuantity })
        .where(eq(Productos.id, change.id));
    }

    // Eliminar la factura y sus detalles si se creó
    if (idFactura) {
      await db
        .delete(DetalleFactura)
        .where(eq(DetalleFactura.id_factura, idFactura));
      await db.delete(Facturas).where(eq(Facturas.id, idFactura));
    }

    return new Response(
      JSON.stringify({
        error: true,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      }),
      { status: 400 }
    );
  }
}
