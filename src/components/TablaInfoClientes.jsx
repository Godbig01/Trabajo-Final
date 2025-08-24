import { useEffect, useState } from "react";
import PaginationComponent from "@/components/utils/PaginationComponent";
import { ShowToastError } from "@/components/utils/showToast";
import { toast } from "@pheralb/toast";

export default function TablaInfo({ clientes, error }) {
  const Registros = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredClientes, setFilteredClientes] = useState(clientes);
  const [cedulaFilter, setCedulaFilter] = useState("");
  const [nombreFilter, setNombreFilter] = useState("");

  useEffect(() => {
    const filtered = clientes.filter(client => {
      const cedulaString = String(client.identificacion).toLowerCase();
      const nombreCompletoString = `${client.nombre} ${client.apellidos}`.toLowerCase();
      return cedulaString.includes(cedulaFilter.toLowerCase()) &&
             nombreCompletoString.includes(nombreFilter.toLowerCase());
    });
    setFilteredClientes(filtered);
    setCurrentPage(1);
  }, [clientes, cedulaFilter, nombreFilter]);

  const totalPages = Math.ceil(filteredClientes.length / Registros);

  const currentClient = filteredClientes.slice(
    (currentPage - 1) * Registros,
    currentPage * Registros
  );

  const handleClickDisabled = () => {
    toast.error({ description: "No se puede editar el cliente por defecto" });
  }

  return (
    <div className="w-[90vw] px-4 sm:px-6 lg:px-8 mt-3">

      {!filteredClientes || filteredClientes.length === 0 ? (
        <>
        <div className="flex flex-wrap gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Filtrar por Cédula"
              value={cedulaFilter}
              onChange={(e) => setCedulaFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Filtrar por Nombre"
              value={nombreFilter}
              onChange={(e) => setNombreFilter(e.target.value)}
              className="p-2 border rounded"
            />
        </div>
        <p className="mt-5 text-center">No hay clientes registrados</p>
        </>
      ) : (
        <>
          {/* Tabla para pantallas medianas y grandes */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Filtrar por Cédula"
              value={cedulaFilter}
              onChange={(e) => setCedulaFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Filtrar por Nombre"
              value={nombreFilter}
              onChange={(e) => setNombreFilter(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-center mt-4 border-separate border-spacing-0 rounded-2xl overflow-hidden border border-green-700 border-b-green-300 border-x-green-200">
              <thead>
                <tr className="bg-green-500/90 text-white">
                  <th className="py-2 px-4">Cédula</th>
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Apellido</th>
                  <th className="py-2 px-4">Correo</th>
                  <th className="py-2 px-4">Teléfono</th>
                  <th className="py-2 px-4">Dirección</th>
                  <th className="py-2 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentClient.map((client, index) => (
                  <tr className={index % 2 != 0 ? "bg-green-200/50" : null} key={client.identificacion}>
                    <td className="py-2 px-4">{client.identificacion}</td>
                    <td className="py-2 px-4">{client.nombre}</td>
                    <td className="py-2 px-4">{client.apellidos}</td>
                    <td className="py-2 px-4">{client.correo}</td>
                    <td className="py-2 px-4">{client.telefono}</td>
                    <td className="py-2 px-4">{client.direccion}</td>
                    <td className="py-2 px-4">
                      {
                        client.identificacion == "22222222" ? (
                          <button title="No se puede editar" className="cursor-not-allowed text-white font-semibold bg-red-500/80 p-2 transition duration-300 hover:bg-red-700 rounded-xl" onClick={handleClickDisabled}>Editar</button>
                        ) : (
                          <a href={`/app/editarCliente/${client.identificacion}`} title="Editar Datos Cliente" className="text-white font-semibold bg-green-500/100 p-2 transition duration-300 hover:bg-green-700 rounded-xl">Editar</a>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para pantallas pequeñas */}
          <div className="md:hidden space-y-4 mt-4">
            {currentClient.map((client) => (
              <div key={client.identificacion} className="bg-green-100 p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">{`${client.nombre} ${client.apellidos}`}</h3>
                <p><span className="font-semibold">Cédula:</span> {client.identificacion}</p>
                <p><span className="font-semibold">Correo:</span> {client.correo}</p>
                <p><span className="font-semibold">Teléfono:</span> {client.telefono}</p>
                <p><span className="font-semibold">Dirección:</span> {client.direccion}</p>
                <div className="mt-4">
                      {
                        client.identificacion == "22222222" ? (
                          <button title="No se puede editar" className="cursor-not-allowed text-white font-semibold bg-red-500/80 p-2 transition duration-300 hover:bg-red-700 rounded-xl" onClick={handleClickDisabled}>Editar</button>
                        ) : (
                          <a href={`/app/editarCliente/${client.identificacion}`} title="Editar Datos Cliente" className="text-white font-semibold bg-green-500/100 p-2 transition duration-300 hover:bg-green-700 rounded-xl">Editar</a>
                        )
                      }
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {filteredClientes.length > 0 && (
        <div className="mt-4">
          <PaginationComponent client:load currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
      )}
      
      {error && ShowToastError(error)}
    </div>
  );
}