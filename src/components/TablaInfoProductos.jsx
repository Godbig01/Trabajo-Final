import { useEffect, useMemo, useState } from "react";
import PaginationComponent from "@/components/utils/PaginationComponent";

export default function TablaInfo({ productos, error }) {
  const Registros = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...productos]; // Copia de los productos para evitar mutaciones

    // Filtrar por nombre
    if (searchTerm) {
      result = result.filter(producto =>
        producto.Productos.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por proveedor
    if (selectedProvider) {
      result = result.filter(producto => producto.Proveedor.nombre === selectedProvider);
    }

    // Ordenar por cantidad
    result.sort((a, b) =>
      sortOrder === "asc"
        ? a.Productos.cantidad - b.Productos.cantidad
        : b.Productos.cantidad - a.Productos.cantidad
    );

    return result;
  }, [productos, searchTerm, selectedProvider, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / Registros);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * Registros;
    return filteredProducts.slice(startIndex, startIndex + Registros);
  }, [currentPage, filteredProducts]);

  // Obtener lista única de proveedores
  const providers = [...new Set(productos.map(p => p.Proveedor.nombre))];

  return (
    <div className="w-[90vw] overflow-x-auto mt-3">
      <div className="mb-4 flex flex-wrap gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="p-2 border rounded cursor-pointer"
        >
          <option value="">Todos los proveedores</option>
          {providers.map(provider => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="p-2 bg-green-500 text-white rounded transition-all duration-300 hover:bg-[#15803d]"
        >
          Ordenar por cantidad {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {error ? (
        <p>Error al cargar los productos</p>
      ) : filteredProducts.length === 0 ? (
        <p>No hay productos registrados</p>
      ) : (
        <>
          {/* Tabla para pantallas medianas y grandes */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-center mt-4 border-separate border-spacing-0 rounded-2xl overflow-hidden border border-green-700 border-b-green-300 border-x-green-200">
              <thead>
                <tr className="bg-green-500/90 text-white">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Código</th>
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Precio</th>
                  <th className="py-2 px-4">Cantidad</th>
                  <th className="py-2 px-4">Proveedor</th>
                  <th className="py-2 px-4">Observación</th>
                  <th className="py-2 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((producto, index) => (
                  <tr className={index % 2 !== 0 ? "bg-green-200/50" : ""} key={producto.Productos.id}>
                    <td className="py-2 px-4">{producto.Productos.id}</td>
                    <td className="py-2 px-4">{producto.Productos.codigo}</td>
                    <td className="py-2 px-4">{producto.Productos.nombre}</td>
                    <td className="py-2 px-4">${producto.Productos.precio}</td>
                    <td className="py-2 px-4">{producto.Productos.cantidad}</td>
                    <td className="py-2 px-4">{producto.Proveedor.nombre}</td>
                    <td className="py-2 px-4">
                      {producto.Productos.cantidad <= 0
                        ? <b>Sin Stock</b>
                        : producto.Productos.cantidad <= 10
                          ? <b>Stock Bajo</b>
                          : "En Stock"
                      }
                    </td>
                    <td className="py-2 px-4">
                      <a href={`/app/editarProducto/${producto.Productos.id}`} title="Editar Datos Productos" className="bg-green-500 text-white font-semibold py-2 px-4 md:py-1 md:px-2.5 rounded hover:bg-green-700 transition duration-300 md:text-sm lg:text-base md:w-[132px]">Editar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tarjetas para pantallas pequeñas */}
          <div className="md:hidden space-y-4 mt-4">
            {currentProducts.map((producto) => (
              <div key={producto.Productos.id} className="bg-green-100 p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">{producto.Productos.nombre}</h3>
                <p><span className="font-semibold">ID:</span> {producto.Productos.id}</p>
                <p><span className="font-semibold">Código:</span> {producto.Productos.codigo}</p>
                <p><span className="font-semibold">Precio:</span> ${producto.Productos.precio}</p>
                <p><span className="font-semibold">Cantidad:</span> {producto.Productos.cantidad}</p>
                <p><span className="font-semibold">Proveedor:</span> {producto.Proveedor.nombre}</p>
                <div className="mt-4">
                  <a href={`/app/editarProducto/${producto.Productos.id}`} title="Editar Datos Productos" className="text-white font-semibold bg-green-500 p-2 transition duration-300 hover:bg-green-700 rounded-xl">Editar</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-4">
          <PaginationComponent
            client:load
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
