import {
  db,
  Clientes,
  Proveedor,
  Productos,
  Facturas,
  DetalleFactura,
  PQRS,
} from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Clientes).values([
    {
      identificacion: 123,
      nombre: "Juan",
      apellidos: "Perez",
      correo: "juan.perez@gmail.com",
      telefono: "123456789",
      direccion: "Calle 123",
    },
    {
      identificacion: 456,
      nombre: "Maria",
      apellidos: "Gomez",
      correo: "maria.gomez@gmail.com",
      telefono: "987654321",
      direccion: "Avenida 456",
    },
  ]);

    await db.insert(Proveedor).values([
      {
          NIT: "900123456",
          nombre: "Proveedor 1",
          telefono: "123456789",
          direccion: "Zona Industrial 1",
      },
      {
          NIT: "900789012",
          nombre: "Proveedor 2",
          telefono: "987654321",
          direccion: "Zona Industrial 2",
      },
      {
          NIT: "900456789",
          nombre: "Proveedor 3",
          telefono: "456789123",
          direccion: "Zona Comercial 3",
      },
      {
          NIT: "900321654",
          nombre: "Proveedor 4",
          telefono: "321654987",
          direccion: "Zona Residencial 4",
      },
      {
          NIT: "900654321",
          nombre: "Proveedor 5",
          telefono: "654321789",
          direccion: "Zona Industrial 5",
      },
  ]);
  
  await db.insert(Productos).values([
      {
          codigo: "P001",
          nombre: "Producto 1",
          precio: 5000,
          cantidad: 100,
          proveedor: 1,
      },
      {
          codigo: "P002",
          nombre: "Producto 2",
          precio: 10000,
          cantidad: 50,
          proveedor: 2,
      },
      {
          codigo: "P003",
          nombre: "Producto 3",
          precio: 15000,
          cantidad: 30,
          proveedor: 3,
      },
      {
          codigo: "P004",
          nombre: "Producto 4",
          precio: 20000,
          cantidad: 20,
          proveedor: 4,
      },
      {
          codigo: "P005",
          nombre: "Producto 5",
          precio: 25000,
          cantidad: 10,
          proveedor: 5,
      },
      {
          codigo: "P006",
          nombre: "Producto 6",
          precio: 30000,
          cantidad: 5,
          proveedor: 1,
      },
      {
          codigo: "P007",
          nombre: "Producto 7",
          precio: 35000,
          cantidad: 8,
          proveedor: 2,
      },
      {
          codigo: "P008",
          nombre: "Producto 8",
          precio: 40000,
          cantidad: 12,
          proveedor: 3,
      },
      {
          codigo: "P009",
          nombre: "Producto 9",
          precio: 45000,
          cantidad: 15,
          proveedor: 4,
      },
      {
          codigo: "P010",
          nombre: "Producto 10",
          precio: 50000,
          cantidad: 20,
          proveedor: 5,
      },
  ]);

  await db.insert(Facturas).values([
    {
      identificacion_cliente: 1,
      fecha_creacion: "10-09-2024, 14:50:08",
      valor_total: 20000,
    },
    {
      identificacion_cliente: 2,
      fecha_creacion: "12-09-2024, 14:50:08",
      valor_total: 10000,
    },
  ]);

  await db.insert(DetalleFactura).values([
    {
      id_factura: 1,
      id_producto: 1,
      cantidad_producto: 2,
      precio_producto: 5000,
      precio_producto_total: 10000,
    },
    {
      id_factura: 1,
      id_producto: 2,
      cantidad_producto: 1,
      precio_producto: 10000,
      precio_producto_total: 10000,
    },
  ]);

  await db.insert(PQRS).values([
    {
      asunto: "Consulta de producto",
      mensaje: "¿Tienen el producto X disponible?",
      fecha_creacion: "2024-09-10",
    },
    {
      asunto: "Reclamo por factura",
      mensaje: "El valor en mi factura no es correcto.",
      fecha_creacion: "2024-09-12",
    },
  ]);
}
