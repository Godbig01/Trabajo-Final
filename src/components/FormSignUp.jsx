import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormSignIn() {
    const [ErrorResponse, setErrorResponse] = useState("Registro fallido");
    const [OnSubmit, setOnSubmit] = useState(false);

    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/signUp", {
                    method: "POST",
                    body: formData,
                });
                const resText = await response.text();
                const resData = JSON.parse(resText);

                if (!response.ok) {
                    setErrorResponse(resData.error);
                    throw new Error(resData.error);
                }

                return resText;
            } catch (error) {
                // console.log(error.message);
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
                success: "Inicio de sesión exitoso",
                error: ErrorResponse,
                autoDismiss: true,
                onSuccess: () => {
                    form.reset(); // Restablecer el formulario en caso de éxito
                    window.location.href = "/app"; // Redirigir al usuario a la página de inicio
                },
            },
        });
    };

    return (
        <form class="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700">Nombre Usuario</label>
                <input type="text" id="username" name="username" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" id="password" name="password" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <button type="submit" class="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300" disabled={OnSubmit}>
                    {OnSubmit ? "Cargando..." : "Registrarse"}
                </button>
            </div>
        </form>
    );
}