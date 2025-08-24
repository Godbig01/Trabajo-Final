import { jsPDF } from "jspdf";
import {
  getEnvoicesById,
  getDetailsEnvoicesById,
} from "@/pages/api/seeEnvoice";
import { getBlob } from "@/pages/api/blob";

export async function generatePDF(id: any) {
  const { facturas } = await getEnvoicesById(id);
  const { detallesFactura } = await getDetailsEnvoicesById(id);

  const base64 = await getBlob();

  if (facturas === undefined || detallesFactura === undefined) {
    return { url: [], error: "Fallo Inesperado" };
  }

  const pdf = new jsPDF("p", "pt", "letter");
  pdf.addImage(base64, "png", 430, 30, 100, 100);
  pdf.setTextColor(0, 143, 57);
  pdf.setFontSize(45);
  pdf.setFont("helvetica", "bold");
  pdf.text("FACTURA", 42, 65);
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("MiniMercado 7 de Agosto", 43, 95);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("Cra 13 Calle 14A B-Ancon", 43, 110);
  pdf.setFontSize(25);
  pdf.setTextColor(0, 143, 57);
  pdf.setFont("helvetica", "bold");
  pdf.text("Facturar a", 43, 175);
  pdf.setFontSize(16);
  pdf.text("N° DE FACTURA", 350, 179);
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.text(facturas[0].Facturas.id.toString(), 500, 178.5);
  pdf.setTextColor(0, 143, 57);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("FECHA DE CREACION", 305, 215);
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  const Fecha = facturas[0].Facturas.fecha_creacion.split(", ");
  pdf.text(Fecha[0], 500, 214.5);
  pdf.setTextColor(0, 143, 57);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("HORA DE CREACION", 313, 251);
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.text(Fecha[1], 499.5, 250);
  pdf.text(
    facturas[0].Clientes.nombre + " " + facturas[0].Clientes.apellidos,
    43,
    205
  );
  pdf.text(String(facturas[0].Clientes.identificacion), 43, 230);
  pdf.text(facturas[0].Clientes.direccion, 43, 255);
  pdf.setDrawColor(254, 92, 78);
  pdf.setLineWidth(3);
  pdf.line(30, 280, 580, 280);
  pdf.setTextColor(0, 143, 57);
  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    "CANT          DESCRIPCION           PRECIO UNITARIO           IMPORTE",
    60,
    315
  );
  pdf.line(30, 340, 580, 340);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");

  if (detallesFactura.length > 8) {
    const paginas = Math.ceil((detallesFactura.length - 8) / 14);
    for (let i = 0; i < paginas; i++) {
      pdf.addPage();
    }
    pdf.setPage(1);
  }

  let Conty = 390,
    Contx = 80,
    Cont = 0,
    ContPage = 0,
    Cont2 = 14;
  detallesFactura.map((detalle) => {
    if (Cont < 8) {
      pdf.text(String(detalle.DetalleFactura.cantidad_producto), Contx, Conty, {
        align: "center",
      });
      Contx += 65;
      pdf.text(detalle.Productos.nombre, Contx, Conty, { align: "left" });
      Contx += 281;
      pdf.text(
        "$" + String(detalle.DetalleFactura.precio_producto),
        Contx,
        Conty,
        { align: "right" }
      );
      Contx += 115;
      pdf.text(
        "$" + String(detalle.DetalleFactura.precio_producto_total),
        Contx,
        Conty,
        { align: "right" }
      );
      Contx = 80;
      Conty += 50;
      Cont++;
    } else {
      if (Cont2 < 14) {
        pdf.text(
          String(detalle.DetalleFactura.cantidad_producto),
          Contx,
          Conty,
          { align: "center" }
        );
        Contx += 65;
        pdf.text(detalle.Productos.nombre, Contx, Conty, { align: "left" });
        Contx += 281;
        pdf.text("$" + String(detalle.Productos.precio), Contx, Conty, {
          align: "right",
        });
        Contx += 115;
        pdf.text(
          "$" + String(detalle.DetalleFactura.precio_producto_total),
          Contx,
          Conty,
          { align: "right" }
        );
        Contx = 80;
        Conty += 50;
        Cont2++;
      } else {
        ContPage++;
        pdf.line(30, 760, 580, 760);
        Conty = 75;
        pdf.setPage(ContPage + 1);
        pdf.line(30, 30, 580, 30);
        pdf.text(
          String(detalle.DetalleFactura.cantidad_producto),
          Contx,
          Conty,
          { align: "center" }
        );
        Contx += 65;
        pdf.text(detalle.Productos.nombre, Contx, Conty, { align: "left" });
        Contx += 281;
        pdf.text("$" + String(detalle.Productos.precio), Contx, Conty, {
          align: "right",
        });
        Contx += 115;
        pdf.text(
          "$" + String(detalle.DetalleFactura.precio_producto_total),
          Contx,
          Conty,
          { align: "right" }
        );
        Contx = 80;
        Conty += 50;
        Cont2 = 1;
      }
    }
  });

  pdf.setTextColor(0, 143, 57);
  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  if (detallesFactura.length == 8 || Conty == 775) {
    pdf.line(30, 760, 580, 760);
    pdf.addPage();
    pdf.line(30, 30, 580, 30);
    pdf.text("TOTAL", 377, 75);
    pdf.text(`$${facturas[0].Facturas.valor_total}`, 542, 75, {
      align: "right",
    });
  } else {
    pdf.text("TOTAL", 377, Conty + 20);
    pdf.text(`$${facturas[0].Facturas.valor_total}`, 542, Conty + 20, {
      align: "right",
    });
  }

  const url = pdf.output("datauristring");

  return { url: [url], error: null };
}
