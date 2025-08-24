import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormEditProducto({ producto, proveedores }) {
    const [ErrorResponse, setErrorResponse] = useState("Editar Producto fallido");
    const [OnSubmit, setOnSubmit] = useState(false);

    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/updateProducto", {
                    method: "POST",
                    body: formData,
                });
                const resText = await response.text();
                const resData = JSON.parse(resText);
                
                if (response.status === 401) {
                    return window.location.href = '/';
                }

                if (!response.ok) {
                    setErrorResponse(resData.response);
                    toast.error({ description: resData.response });
                    throw new Error(resData.response);
                }

                return resData.response;
            } catch (error) {
                toast.error({ description: ErrorResponse });
                throw ErrorResponse;
            } finally {
                setOnSubmit(false);
            }
        };

        toast.loading({
            text: "Cargando...",
            options: {
                promise: sendRequest(), // Ejecutar la solicitud
                success: "Producto Editado Exitosamente",
                error: { description: ErrorResponse },
                autoDismiss: true,
                onSuccess: () => {
                    setTimeout(() => {
                        window.location.href = '/app/verProducto';
                    }, 2000);
                },
            },
        });
    };

    return (
        <div className="flex flex-col bg-[#f4f4f5] px-8 py-5 rounded-xl w-[400px] mx-auto mt-6">
            <h2 className="text-2xl font-bold text-center">Editar Productos</h2>
            <form onSubmit={handleSubmit} className="flex flex-col mt-4">
                <label htmlFor="codigo" className="text-lg">
                    Codigo <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="text" id="codigo" name="codigo" required autoComplete="off" defaultValue={producto[0].Productos.codigo} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir un codigo"/>
                
                <label htmlFor="nombre" className="mt-5 text-lg">
                    Nombre <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="text" id="nombre" name="nombre" required autoComplete="off" defaultValue={producto[0].Productos.nombre} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir un nombre"/>
                
                <label htmlFor="precio" className="mt-5 text-lg">
                    Precio <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="number" id="precio" name="precio" required autoComplete="off" defaultValue={producto[0].Productos.precio?.toString()} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir un precio"/>
                
                <label htmlFor="cantidad" className="mt-5 text-lg">
                    Cantidad <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="number" id="cantidad" name="cantidad" required autoComplete="off" defaultValue={producto[0].Productos.cantidad?.toString()} min={0} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir una cantidad"/>
                
                <label htmlFor="proveedor" className="mt-5 text-lg">
                    Proveedor <span className="text-red-500 font-bold">*</span>
                </label>
                <select name="proveedor" id="proveedor" className="cursor-pointer text-lg h-9.5 input-class">
                    {proveedores?.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id} selected={producto[0].Productos.proveedor === proveedor.id}>
                            {proveedor.nombre}
                        </option>
                    ))}
                </select>
                
                <input type="hidden" name="hidePro" id="hidePro" value={producto[0].Productos.id} />
                
                <button type="submit" className="bg-green-500/100 text-white rounded-md mt-5 h-8 cursor-pointer hover:bg-green-700 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300" disabled={OnSubmit}>
                    {OnSubmit ? "Editando..." : "Editar Producto"}
                </button>
            </form>
        </div>
    );
}
