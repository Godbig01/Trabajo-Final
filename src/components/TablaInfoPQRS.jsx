import { useEffect, useState } from "react";
import { format } from 'date-fns'; // Importa la función de formateo
import PaginationComponent from "@/components/utils/PaginationComponent";
import { ShowToastError } from "@/components/utils/showToast";

import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'

export default function TablaPQRS({ pqrs, error }) {
  const Registros = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPQRS, setFilteredPQRS] = useState(pqrs);
  const [asuntoFilter, setAsuntoFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");

  useEffect(() => {
    const filtered = pqrs.filter(pqrsItem => {
      const asuntoString = String(pqrsItem.asunto).toLowerCase();
      const fechaString = format(new Date(pqrsItem.fecha_creacion), 'dd/MM/yyyy').toLowerCase();
      return asuntoString.includes(asuntoFilter.toLowerCase()) &&
             fechaString.includes(fechaFilter.toLowerCase());
    });
    setFilteredPQRS(filtered);
    setCurrentPage(1);
  }, [pqrs, asuntoFilter, fechaFilter]);

  const totalPages = Math.ceil(filteredPQRS.length / Registros);

  const currentPQRS = filteredPQRS.slice(
    (currentPage - 1) * Registros,
    currentPage * Registros
  );


  const handleClickMessage = (asunto,mensaje) => {
    Swal.fire({
        title: "<h2 class='font-medium'>Informacion del PQRS</h2>",
        icon: "info",
        html: `
            <h3 class="font-semibold">Asunto:</h3>
            <p>${asunto}</p>
            <h3 class="font-semibold">Mensaje:</h3>
            <p>${mensaje}</p>
        `,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "HECHO",
        confirmButtonColor: "#22c55e",
    });
  }
  return (
    <div className="w-[90vw] px-4 sm:px-6 lg:px-8 mx-auto mt-4">
      <h2 class="text-2xl font-semibold text-center pb-3">Ver PQRS</h2>
      {!filteredPQRS || filteredPQRS.length === 0 ? (
        <>
        <div className="flex flex-wrap gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Filtrar por Asunto"
              value={asuntoFilter}
              onChange={(e) => setAsuntoFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Filtrar por Fecha"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
              className="p-2 border rounded"
            />
        </div>
        <p className="mt-5 text-center font-semibold">No hay PQRS registradas</p>
        </>
      ) : (
        <>
          {/* Filtros de búsqueda */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Filtrar por Asunto"
              value={asuntoFilter}
              onChange={(e) => setAsuntoFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Filtrar por Fecha"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          {/* Tabla para pantallas grandes */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-center mt-4 border-separate border-spacing-0 rounded-2xl overflow-hidden border border-green-700 border-b-green-300 border-x-green-200">
              <thead>
                <tr className="bg-green-500/90 text-white">
                  <th className="py-2 px-4">Asunto</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentPQRS.map((pqrsItem, index) => (
                  <tr className={index % 2 != 0 ? "bg-green-200/50" : null} key={pqrsItem.id}>
                    <td className="py-2 px-4">{pqrsItem.asunto}</td>
                    <td className="py-2 px-4">{format(new Date(pqrsItem.fecha_creacion), 'dd/MM/yyyy')}</td>
                    <td className="py-2 px-4">
                      <button title="Ver Mensaje Del PQRS" className="bg-green-500 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition duration-300" onClick={() => {
                        handleClickMessage(pqrsItem.asunto, pqrsItem.mensaje);
                      }}>Ver Mensaje</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para pantallas pequeñas */}
          <div className="md:hidden space-y-4 mt-4">
            {currentPQRS.map((pqrsItem) => (
              <div key={pqrsItem.id} className="bg-green-100 p-4 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg mb-2">{pqrsItem.asunto}</h3>
                <p><span className="font-semibold">Fecha:</span> {format(new Date(pqrsItem.fecha_creacion), 'dd/MM/yyyy')}</p>
                <div className="mt-4">
                  <a title="Ver Mensaje Del PQRS" onClick={() => {handleClickMessage(pqrsItem.asunto, pqrsItem.mensaje);}} className="text-white font-semibold bg-green-500/100 p-2 transition duration-300 hover:bg-green-700 rounded-xl">Ver Mensaje</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredPQRS.length > 0 && (
        <div className="mt-4">
          <PaginationComponent client:load currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
      )}

      {error && ShowToastError(error)}
    </div>
  );
}
