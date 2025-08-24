import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormSignIn({ Proveedor }) {
    const [ErrorResponse, setErrorResponse] = useState("Crear Producto fallido");
    const [OnSubmit, setOnSubmit] = useState(false);

    // Función para validar los campos de forma más detallada
    const validateForm = (formData) => {
        const codigo = formData.get("codigo");
        const nombre = formData.get("nombre");
        const precio = formData.get("precio");
        const cantidad = formData.get("cantidad");
        const proveedor = formData.get("proveedor");

        if (codigo.length < 4) {
            toast.error({ description: "El código debe tener al menos 4 caracteres."});
            return false;
        }

        if (nombre.length < 3) {
            toast.error({ description: "El nombre debe tener al menos 3 caracteres."});
            return false;
        }

        if (precio < 100) {
            toast.error({ description: "El precio debe ser mayor que 100."});
            return false;
        }

        if (cantidad < 0) {
            toast.error({ description: "La cantidad no puede ser negativa."});
            return false;
        }

        if (!proveedor) {
            toast.error({ description: "Debe seleccionar un proveedor."});
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setOnSubmit(true);
        const form = event.target;
        const formData = new FormData(form);

        // Validar los campos antes de enviar la solicitud
        if (!validateForm(formData)) {
            setOnSubmit(false);
            return;
        }

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/createProduct", {
                    method: "POST",
                    body: formData,
                });
                const resText = await response.text();
                const resData = JSON.parse(resText);
                if (response.status === 401) {
                    return window.location.href = '/';
                }

                if (!response.ok) {
                    setErrorResponse(resData.error);
                    throw new Error(resData.error);
                }

                return resText;
            } catch (error) {
                setErrorResponse(error.message);
                throw error.message;
            } finally {
                setOnSubmit(false);
            }
        };

        toast.loading({
            text: "Cargando...",
            options: {
                promise: sendRequest(), // Ejecutar la solicitud
                success: "Producto Creado Exitosamente",
                error: ErrorResponse,
                autoDismiss: true,
                onSuccess: () => {
                    form.reset(); // Restablecer el formulario en caso de éxito
                },
            },
        });
    };

    return (
        <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
            <label htmlFor="codigo" className="text-lg">
                Codigo <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="codigo" name="codigo" required minLength={4} autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Codigo del producto"/>
            
            <label htmlFor="nombre" className="mt-5 text-lg">
                Nombre <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="nombre" name="nombre" required minLength={3} autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Nombre del producto"/>
            
            <label htmlFor="precio" className="mt-5 text-lg">
                Precio <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="number" id="precio" name="precio" required autoComplete="off" min={100} className="input-class h-8 mt-1 text-lg" placeholder="Precio unitario"/>
            
            <label htmlFor="cantidad" className="mt-5 text-lg">
                Cantidad <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="number" id="cantidad" name="cantidad" required min={0} autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Cantidad del producto"/>
            
            <label htmlFor="proveedor" className="mt-5 text-lg">
                Proveedor <span className="text-red-500 font-bold">*</span>
            </label>
            <select name="proveedor" id="proveedor" required className="input-class cursor-pointer text-lg h-9.5">
                <option value="">Seleccione</option>
                {Proveedor.proveedores?.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                ))}
            </select>
            
            <button type="submit" className="bg-green-500/100 text-white rounded-md mt-5 h-8 cursor-pointer hover:bg-green-700 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={OnSubmit}>
                {OnSubmit ? "Creando..." : "Crear Producto"}
            </button>
        </form>
    );
}
