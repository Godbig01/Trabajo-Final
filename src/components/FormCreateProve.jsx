import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormSignIn() {
    const [ErrorResponse, setErrorResponse] = useState("Crear Proveedor fallido");
    const [OnSubmit, setOnSubmit] = useState(false);


    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const nit = formData.get('nit');
        const telefono = formData.get('telefono');

        // Validaciones
        if (nit.length < 7) {
            toast.error({ description: "El NIT debe tener al menos 7 caracteres." });
            setOnSubmit(false);
            return;
        }

        if (telefono.length < 6) {
            toast.error({ description: "El teléfono debe tener al menos 6 caracteres."});
            setOnSubmit(false);
            return;
        }


        const sendRequest = async () => {
            try {
                const response = await fetch("/api/createProve", {
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
                success: "Proveedor Creado Exitosamente",
                error: ErrorResponse,
                autoDismiss: true,
                onSuccess: () => {
                    form.reset(); // Restablecer el formulario en caso de éxito
                },
            },
        });
    };

    return (
        <form class="flex flex-col mt-4" onSubmit={handleSubmit}>
            <label for="nit" className="text-lg">
                NIT <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="nit" name="nit" required autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="NIT del proveedor" minLength={7} />
            <label for="nombre" className="mt-5 text-lg">
                Nombre <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="nombre" name="nombre" required autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Nombre del proveedor" />
            <label for="telefono" className="mt-5 text-lg">
                Teléfono <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="number" id="telefono" name="telefono" required autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Teléfono del proveedor" minLength={6} />
            <label for="direccion" className="mt-5 text-lg">
                Dirección <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="direccion" name="direccion" required autoComplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Dirección del proveedor" minLength={5} />
            <button type="submit" class="bg-green-500/100 text-white rounded-md mt-5 h-8 cursor-pointer hover:bg-green-700 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={OnSubmit} >
                {OnSubmit? "Creando..." : "Crear Proveedor"}
            </button>
        </form>
    );
}
