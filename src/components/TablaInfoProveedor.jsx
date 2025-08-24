import { useEffect, useState } from "react";
import PaginationComponent from "@/components/utils/PaginationComponent";

export default function TablaInfo({ proveedores, error }) {
  const Registros = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProveedores, setFilteredProveedores] = useState(proveedores);
  const [nitFilter, setNitFilter] = useState("");
  const [nombreFilter, setNombreFilter] = useState("");

  useEffect(() => {
    const filtered = proveedores.filter(prov => {
      const nitString = String(prov.NIT).toLowerCase();
      const nombreString = String(prov.nombre).toLowerCase();
      return nitString.includes(nitFilter.toLowerCase()) &&
             nombreString.includes(nombreFilter.toLowerCase());
    });
    setFilteredProveedores(filtered);
    setCurrentPage(1);
  }, [proveedores, nitFilter, nombreFilter]);

  const totalPages = Math.ceil(filteredProveedores.length / Registros);

  const CurrentProveedor = filteredProveedores.slice(
    (currentPage - 1) * Registros,
    currentPage * Registros
  );

  return (
    <div className="w-[90vw] px-4 sm:px-6 lg:px-8 mt-3">
      

      {filteredProveedores.length === 0 ? (
        <>
          {error ? ( <p className="text-center py-4">Error al cargar los proveedores</p> ) : 
          <>
          <div className="flex flex-wrap gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Filtrar por NIT"
            value={nitFilter}
            onChange={(e) => setNitFilter(e.target.value)}
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
          <p className="text-center py-4">No hay proveedores registrados</p>
          </>
          }
        </>
      ) : (
        <>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Filtrar por NIT"
            value={nitFilter}
            onChange={(e) => setNitFilter(e.target.value)}
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
          {/* Tabla para pantallas medianas y grandes */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-center mt-4 border-separate border-spacing-0 rounded-2xl overflow-hidden border border-green-700 border-b-green-300 border-x-green-200">
              <thead>
                <tr className="bg-green-500/90 text-white">
                  <th className="py-2 px-4">NIT</th>
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Teléfono</th>
                  <th className="py-2 px-4">Dirección</th>
                  <th className="py-2 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {CurrentProveedor.map((prov, index) => (
                  <tr className={index % 2 != 0 ? "bg-green-200/50" : null} key={prov.NIT}>
                    <td className="py-2 px-4">{prov.NIT}</td>
                    <td className="py-2 px-4">{prov.nombre}</td>
                    <td className="py-2 px-4">{prov.telefono}</td>
                    <td className="py-2 px-4">{prov.direccion}</td>
                    <td className="py-2 px-4">
                      <a href={`/app/editarProveedor/${prov.NIT}`}
                      title="Editar Datos Proveedor" 
                      className="bg-green-500/100 text-white font-semibold py-2 px-4 md:py-1 md:px-2.5 rounded hover:bg-green-700 transition duration-300 md:text-sm lg:text-base md:w-[132px]">
                        Editar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para pantallas pequeñas */}
          <div className="md:hidden space-y-4 mt-4">
            {CurrentProveedor.map((prov) => (
              <div key={prov.NIT} className="bg-green-100 p-4 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg mb-2">{prov.nombre}</h3>
                <p><span className="font-semibold">NIT:</span> {prov.NIT}</p>
                <p><span className="font-semibold">Teléfono:</span> {prov.telefono}</p>
                <p><span className="font-semibold">Dirección:</span> {prov.direccion}</p>
                <div className="mt-4">
                  <a href={`/app/editarProveedor/${prov.NIT}`} title="Editar Datos Proveedor" className="text-white font-semibold bg-green-500/100 p-2 transition duration-300 hover:bg-green-700 rounded-xl">Editar</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {filteredProveedores.length > 0 && (
        <div className="mt-4">
          <PaginationComponent client:load currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}