import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormSignIn() {
    const [ErrorResponse, setErrorResponse] = useState("Crear Cliente fallido");
    const [OnSubmit, setOnSubmit] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const email = formData.get('correo');

        // Validar el correo antes de enviar
        if (!validateEmail(email)) {
            toast.error({description: "El correo electrónico no es válido."});
            setOnSubmit(false);
            return;
        }

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/createClient", {
                    method: "POST",
                    body: formData,
                });
                const resText = await response.text();
                const resData = JSON.parse(resText);
                if(response.status === 401) {
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
                success: "Cliente Creado Exitosamente",
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
            <label for="cedula" className="text-lg">
                Cedula <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="number" id="cedula" name="cedula" required autocomplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Cedula del cliente" min={5}/>
            <label for="nombres" className="mt-5 text-lg">
                Nombres <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="nombres" name="nombres" required autocomplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Nombre del cliente"/>
            <label for="apellidos" className="mt-5 text-lg">
                Apellidos <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="apellidos" name="apellidos" required autocomplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Apellido del cliente" min={4} />
            <label for="celular" className="mt-5 text-lg">
                Celular <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="number" id="celular" name="celular" required autocomplete="off" className="input-class h-8 mt-1 text-lg" placeholder="Telefono del cliente" min={6} />
            <label for="correo" className="mt-5 text-lg">
                Correo <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="email" name="correo" id="correo" autocomplete="off" required className="input-class h-8 mt-1 text-lg" placeholder="Correo electronico"/>
            <label for="direccion" className="mt-5 text-lg">
                Direccion <span className="text-red-500 font-bold">*</span>
            </label>
            <input type="text" id="direccion" name="direccion" autocomplete="off" required className="input-class h-8 mt-1 text-lg" placeholder="Direccion del cliente" min={5} />
            <button type="submit" class="bg-green-500/100 text-white rounded-md mt-5 h-8 cursor-pointer hover:bg-green-700 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={OnSubmit} >
                {OnSubmit? "Creando..." : "Crear Cliente"}
            </button>
        </form>
    );
}
