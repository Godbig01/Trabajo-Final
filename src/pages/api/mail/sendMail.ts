import nodemailer from "nodemailer";
import {
  getEnvoicesById,
  getDetailsEnvoicesById,
} from "@/pages/api/seeEnvoice";
import type { APIContext } from "astro";
import { generatePDF } from "@/pages/api/pdf"; // Ajusta la ruta según tu proyecto

export async function POST(context: APIContext): Promise<Response> {
  const session = context.locals.session;

  if (!session) {
    return context.redirect("/");
  }

  const formData = await context.request.formData();
  const idFactura = formData.get("idFactura") as string;

  const { facturas, error: errorFacturas } = await getEnvoicesById(
    Number(idFactura)
  );
  if (errorFacturas) {
    return new Response("Error en la base de datos", { status: 500 });
  }
  const factura = facturas[0];

  const { detallesFactura, error: errorDetalles } =
    await getDetailsEnvoicesById(Number(idFactura));

  if (errorDetalles) {
    return new Response("Error en la base de datos", { status: 500 });
  }

  // Generar el PDF
  const { url } = await generatePDF(idFactura);

  let pdfBuffer: Buffer | null = null;

  if (!url) {
    return new Response("No se pudo generar el PDF", { status: 500 });
  }

  const pdfBase64 = url[0].split(",")[1]; // Separar la URI de datos para obtener solo el Base64
  pdfBuffer = Buffer.from(pdfBase64, "base64"); // Convertir Base64 en un Buffer

  if (!pdfBuffer) {
    return new Response("No se pudo generar el PDF", { status: 500 });
  }

  // Configurar Nodemailer transporter
  const userGmail = "joal1806@gmail.com";
  const passAppGmail = "cmik lcrw iuts vjpa";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userGmail,
      pass: passAppGmail,
    },
  });

  // Generar tabla de productos
  let tablaProductos = "";
  detallesFactura.forEach((producto, index) => {
    tablaProductos += "<tr>";
    tablaProductos += "<td>" + (index + 1) + "</td>";
    tablaProductos += "<td>" + producto.Productos.nombre + "</td>";
    tablaProductos += "<td>$" + producto.Productos.precio + "</td>";
    tablaProductos +=
      "<td>" + producto.DetalleFactura.cantidad_producto + "</td>";
    tablaProductos +=
      "<td>$" + producto.DetalleFactura.precio_producto_total + "</td>";
    tablaProductos += "</tr>";
  });

  const subject = "Factura Electronica | MiniMercado 7 de Agosto";
  let message = `
  <html>
  <head>
    <title>Factura Electrónica | MiniMercado 7 de Agosto</title>
    <style>
      /* Estilos generales minimalistas */
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h2 {
        font-size: 24px;
        color: #2c3e50;
        margin-bottom: 20px;
        text-align: center;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        color: #555;
      }

      details {
        margin-top: 20px;
      }

      summary {
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        color: #27ae60;
        margin-bottom: 10px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th, td {
        padding: 10px;
        text-align: left;
      }

      th {
        background-color: #ecf0f1;
        color: #2c3e50;
      }

      tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      tr:nth-child(odd) {
        background-color: #ffffff;
      }

      .total-row th, .total-row td {
        font-weight: bold;
        color: #27ae60;
      }

      /* Estilos del botón */
      .cta {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #27ae60;
        text-align: center;
        text-decoration: none;
        border-radius: 4px;
      }

      .cta:hover {
        background-color: #219150;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Factura Electrónica | MiniMercado 7 de Agosto</h2>
      <p>Estimado/a ${factura.Clientes.nombre} ${factura.Clientes.apellidos},</p>
      <p>Adjunto a este correo se encuentra la factura electrónica de su compra en MiniMercado 7 de agosto.</p>
      <p>En caso de que no funcione el PDF enviado, a continuación puedes ver el resumen de tu compra:</p>

      <details>
        <summary>Haz clic para ver tu factura</summary>
        <table>
          <tr>
            <th>No.</th>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Precio Total Producto</th>
          </tr>
          ${tablaProductos}
          <tr class="total-row">
            <th colspan="4" style="text-align: end;">Valor Total</th>
            <th>$${factura.Facturas.valor_total}</th>
          </tr>
        </table>
      </details>

      <p>Gracias por su compra.</p>
    </div>
  </body>
</html>

`;

  const mailOptions = {
    from: `Info Facturas <${userGmail}>`,
    to: factura.Clientes.correo,
    subject: subject,
    html: message,
    attachments: [
      {
        filename: `factura-de-venta-No.${idFactura}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  // Enviar correo
  try {
    const info = await transporter.sendMail(mailOptions);
    return new Response("Correo enviado", { status: 200 });
  } catch (error) {
    // console.error("Error al enviar el correo:", error);
    return new Response("Error al enviar el correo", { status: 500 });
  }
}
