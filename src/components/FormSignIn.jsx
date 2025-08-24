import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormSignIn() {
    const [ErrorResponse, setErrorResponse] = useState("Inicio de sesión fallido");
    const [OnSubmit, setOnSubmit] = useState(false);

    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/signIn", {
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
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [OnHover, setOnHover] = useState(false);
    
    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre Usuario</label>
                <input type="text" id="username" name="username" required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-950 focus:border-indigo-950 sm:text-sm" autoComplete="username" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <div className="flex relative w-full">
                    <input type={passwordVisible? 'text' : 'password'} id="password" name="password" required className="w-full pr-10 pl-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-950 focus:border-indigo-950 sm:text-sm" autoComplete="current-password" />
                    <button
                        title={passwordVisible? 'Ocultar Contraseña' : 'Ver Contraseña'}
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center mt-[9px] mr-1.5 h-7 w-7 p-0.5 transition-all duration-200 hover:rounded-full hover:bg-gray-300"
                        onClick={togglePasswordVisibility}
                        onMouseLeave={()=>setOnHover(false)}
                        onMouseEnter={()=>setOnHover(true)}
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        >
                        {passwordVisible ? (
                            <path fill={OnHover? "#000000" : "#666666"} className="transition-all duration-200" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/>
                        ) : (
                            <path fill={OnHover? "#000000" : "#666666"} className="transition-all duration-200" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"/>
                        )}
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                <button type="submit" className="w-full px-4 py-2 text-white bg-[#22c55e] rounded-md hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-950 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={OnSubmit} >
                    { OnSubmit ? "Comprobando..." : "Iniciar Sesión" }
                </button>
            </div>
        </form>
    );
}