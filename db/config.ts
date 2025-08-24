// db/config.ts
import { column, defineDb, defineTable } from "astro:db";

const Users = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    name: column.text({ unique: true }),
    password: column.text({ unique: false }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    expiresAt: column.date(),
    userId: column.text({
      references: () => Users.columns.id,
    }),
  },
});

const Clientes = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    identificacion: column.number({ unique: true }),
    nombre: column.text(),
    apellidos: column.text(),
    correo: column.text(),
    telefono: column.text(),
    direccion: column.text(),
  },
});

const Proveedor = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    NIT: column.text({ unique: true }),
    nombre: column.text(),
    telefono: column.text(),
    direccion: column.text(),
  },
});

const Productos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    codigo: column.text({ unique: true }),
    nombre: column.text(),
    precio: column.number(),
    cantidad: column.number(),
    proveedor: column.number({
      references: () => Proveedor.columns.id,
    }),
  },
});

const Facturas = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    fecha_creacion: column.text(),
    identificacion_cliente: column.number({
      references: () => Clientes.columns.id,
    }),
    valor_total: column.number(),
  },
});

const DetalleFactura = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    id_factura: column.number({
      references: () => Facturas.columns.id,
    }),
    id_producto: column.number({
      references: () => Productos.columns.id,
    }),
    cantidad_producto: column.number(),
    precio_producto: column.number(),
    precio_producto_total: column.number(),
  },
});

const PQRS = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    asunto: column.text(),
    mensaje: column.text(),
    fecha_creacion: column.text(),
  },
});

export default defineDb({
  tables: {
    Users,
    Session,
    Clientes,
    Proveedor,
    Productos,
    Facturas,
    DetalleFactura,
    PQRS,
  },
});
