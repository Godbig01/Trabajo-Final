import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormSignIn({ cliente }) {
    const [ErrorResponse, setErrorResponse] = useState("Editar Cliente fallido");
    const [OnSubmit, setOnSubmit] = useState(false);
    
    const validateForm = (formData) => {
        const cedula = formData.get("cedula");
        const celular = formData.get("celular");
        const correo = formData.get("correo");

        if (cedula.length < 5 || cedula.length > 10) {
            toast.error({ description: "La cédula debe tener entre 5 y 10 dígitos."} );
            return false;
        }

        if (celular.length < 7 || celular.length > 10) {
            toast.error({ description: "El celular debe tener entre 7 y 10 dígitos."} );
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(correo)) {
            toast.error({ description: "El formato del correo es inválido."} );
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        // Validar el formulario antes de enviar la solicitud
        if (!validateForm(formData)) {
            setOnSubmit(false);
            return;
        }

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/updateCliente", {
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
                success: "Cliente Editado Exitosamente",
                error: ErrorResponse,
                autoDismiss: true,
                onSuccess: () => {
                    setTimeout(() => {
                        window.location.href = '/app/verCliente';
                    }, 2000);
                },
            },
        });
    };

    return (
        <>
        <div className="flex flex-col bg-[#f4f4f5] px-8 py-5 rounded-xl w-[400px] mx-auto mt-6">
            <h2 className="text-2xl font-bold text-center">Editar Clientes</h2>
                <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
                    <label htmlFor="cedula" className="text-lg">
                        Cedula <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                        type="number" 
                        id="cedula" 
                        name="cedula" 
                        required 
                        autoComplete="off" 
                        defaultValue={cliente && cliente[0].identificacion} 
                        minLength={5} 
                        maxLength={10} 
                        className="input-class h-8 mt-1 text-lg" 
                        placeholder="Debes ingresar una cedula" 
                    />
                    
                    <label htmlFor="nombres" className="mt-5 text-lg">
                        Nombres <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="nombres" 
                        name="nombres" 
                        required 
                        autoComplete="off" 
                        defaultValue={cliente && cliente[0].nombre} 
                        className="input-class h-8 mt-1 text-lg" 
                        placeholder="Debes ingresar un nombre" 
                    />
                    
                    <label htmlFor="apellidos" className="mt-5 text-lg">
                        Apellidos <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="apellidos" 
                        name="apellidos" 
                        required 
                        autoComplete="off" 
                        defaultValue={cliente && cliente[0].apellidos} 
                        className="input-class h-8 mt-1 text-lg" 
                        placeholder="Debes ingresar un apellido" 
                    />
                    
                    <label htmlFor="celular" className="mt-5 text-lg">
                        Celular <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                        type="number" 
                        id="celular" 
                        name="celular" 
                        required 
                        autoComplete="off" 
                        defaultValue={cliente && cliente[0].telefono} 
                        minLength={7} 
                        maxLength={10} 
                        className="input-class h-8 mt-1 text-lg" 
                        placeholder="Debes ingresar un telefono" 
                    />
                    
                    <label htmlFor="correo" className="mt-5 text-lg">
                        Correo <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                        type="email" 
                        name="correo" 
                        id="correo" 
                        required 
                        autoComplete="off" 
                        defaultValue={cliente && cliente[0].correo} 
                        className="input-class h-8 mt-1 text-lg" 
                        placeholder="Debes ingresar un correo" 
                    />
                    
                    <label htmlFor="direccion" className="mt-5 text-lg">
                        Direccion <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="direccion" 
                        name="direccion" 
                        required 
                        autoComplete="off" 
                        defaultValue={cliente && cliente[0].direccion} 
                        className="input-class h-8 mt-1 text-lg" 
                        placeholder="Debes ingresar una direccion" 
                    />
                    
                    <input type="hidden" id="hideCed" name="hideCed" defaultValue={cliente && cliente[0].identificacion} />

                    <button 
                        type="submit" 
                        className="bg-green-500/100 text-white rounded-md mt-5 h-8 cursor-pointer hover:bg-green-700 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
                        disabled={OnSubmit}
                    >
                        {OnSubmit ? "Editando..." : "Editar Cliente"}
                    </button>
                </form>
            </div>
        </>
    );
}
