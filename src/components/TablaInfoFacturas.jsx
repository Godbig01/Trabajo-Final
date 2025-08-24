import { useEffect, useState } from "react";
import Modal from "@/components/utils/Modal";
import ModalConfirmOpciones from "@/components/utils/ModalConfirmOpciones";
import PaginationComponent from "@/components/utils/PaginationComponent";

export default function TablaInfo({ Envoices, EnvoicesError, DetailEnvoices, DetailEnvoicesError }) {
  const Registros = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEnvoices, setFilteredEnvoices] = useState(Envoices);
  const [nombreFilter, setNombreFilter] = useState("");
  const [precioFilter, setPrecioFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");

  useEffect(() => {
    const filtered = Envoices.filter(({ Facturas, Clientes }) => {
      const nombreCompleto = `${Clientes.nombre} ${Clientes.apellidos}`.toLowerCase();
      const precio = Facturas.valor_total.toString();
      const fecha = Facturas.fecha_creacion;
      const id = Facturas.id.toString();

      return nombreCompleto.includes(nombreFilter.toLowerCase()) &&
             precio.includes(precioFilter) &&
             fecha.includes(fechaFilter) &&
             id.includes(idFilter);
    });
    setFilteredEnvoices(filtered);
    setCurrentPage(1);
  }, [Envoices, nombreFilter, precioFilter, fechaFilter, idFilter]);

  const totalPages = Math.ceil(filteredEnvoices.length / Registros);

  const currentEnvoices = filteredEnvoices.slice(
    (currentPage - 1) * Registros,
    currentPage * Registros
  );

  return (
    <div className="w-[90vw] px-4 sm:px-6 lg:px-8 mt-3">
      

      {!filteredEnvoices || filteredEnvoices.length === 0 ? (
        <>
        <div className="mb-4 flex flex-wrap gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Filtrar por Nombre del Cliente"
            value={nombreFilter}
            onChange={(e) => setNombreFilter(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filtrar por Precio"
            value={precioFilter}
            onChange={(e) => setPrecioFilter(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filtrar por Fecha"
            value={fechaFilter}
            onChange={(e) => setFechaFilter(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filtrar por ID"
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <p className="mt-5 text-center">
          {EnvoicesError ? "Error al cargar las facturas" : "No hay Facturas registradas"}
        </p>
        </>
      ) : (
        <>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Filtrar por Nombre del Cliente"
            value={nombreFilter}
            onChange={(e) => setNombreFilter(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filtrar por Precio"
            value={precioFilter}
            onChange={(e) => setPrecioFilter(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filtrar por Fecha"
            value={fechaFilter}
            onChange={(e) => setFechaFilter(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filtrar por ID"
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
          {/* Tabla para pantallas medianas y grandes */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-center mt-4 border-separate border-spacing-0 rounded-2xl overflow-hidden border border-green-700 border-b-green-300 border-x-green-200">
              <thead>
                <tr className="bg-green-500/90 text-white">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Fecha de Creación</th>
                  <th className="py-2 px-4">Nombres Cliente</th>
                  <th className="py-2 px-4">Teléfono Cliente</th>
                  <th className="py-2 px-4">Dirección Cliente</th>
                  <th className="py-2 px-4">Valor Factura</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentEnvoices.map(({ Facturas, Clientes }, index) => (
                  <tr key={Facturas.id} className={index % 2 != 0 ? "bg-green-200/50" : null}>
                    <td className="py-2 px-4">{Facturas.id}</td>
                    <td className="py-2 px-4">{Facturas.fecha_creacion}</td>
                    <td className="py-2 px-4">{`${Clientes.nombre} ${Clientes.apellidos}`}</td>
                    <td className="py-2 px-4">{Clientes.telefono}</td>
                    <td className="py-2 px-4">{Clientes.direccion}</td>
                    <td className="py-2 px-4">${Facturas.valor_total}</td>
                    <td className="py-2 px-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Modal client:load dataFacturas={Facturas} dataDetailEnvoices={DetailEnvoices} />
                        <ModalConfirmOpciones client:load idFactura={Facturas.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para pantallas pequeñas */}
          <div className="md:hidden space-y-4 mt-4">
            {currentEnvoices.map(({ Facturas, Clientes }) => (
              <div key={Facturas.id} className="bg-green-100 p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Factura #{Facturas.id}</h3>
                <p><span className="font-semibold">Fecha:</span> {Facturas.fecha_creacion}</p>
                <p><span className="font-semibold">Cliente:</span> {`${Clientes.nombre} ${Clientes.apellidos}`}</p>
                <p><span className="font-semibold">Teléfono:</span> {Clientes.telefono}</p>
                <p><span className="font-semibold">Dirección:</span> {Clientes.direccion}</p>
                <p><span className="font-semibold">Valor Total:</span> ${Facturas.valor_total}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Modal client:load dataFacturas={Facturas} dataDetailEnvoices={DetailEnvoices} />
                  <ModalConfirmOpciones client:load idFactura={Facturas.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {filteredEnvoices.length > 0 && (
        <div className="mt-4">
          <PaginationComponent client:load currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}