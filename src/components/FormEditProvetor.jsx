import { toast } from "@pheralb/toast";
import { useState } from 'react';

export default function FormEditProveedor({ proveedor }) {
    const [ErrorResponse, setErrorResponse] = useState("Editar Proveedor fallido");
    const [OnSubmit, setOnSubmit] = useState(false);

    const [formData, setFormData] = useState({
        id: proveedor?.[0]?.id || '',
        nit: proveedor?.[0]?.NIT || '',
        nombre: proveedor?.[0]?.nombre || '',
        telefono: proveedor?.[0]?.telefono || '',
        direccion: proveedor?.[0]?.direccion || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        setOnSubmit(true);
        event.preventDefault();
        const form = event.target;
        const formDataToSend = new FormData(form);

        const sendRequest = async () => {
            try {
                const response = await fetch("/api/updateProve", {
                    method: "POST",
                    body: formDataToSend,
                });
                
                const resText = await response.text();
                const resData = JSON.parse(resText);
                
                if (response.status === 401) {
                    return window.location.href = '/';
                }

                if (!response.ok) {
                    setErrorResponse(resData.error);
                    toast.error({ description: resData.error });
                    throw new Error(resData.response);
                }

                return resText;
            } catch (error) {
                setErrorResponse(error.message);
                toast.error({ description: error.message });
                throw error;
            } finally {
                setOnSubmit(false);
            }
        };

        toast.loading({
            text: "Cargando...",
            options: {
                promise: sendRequest(), // Ejecutar la solicitud
                success: "Proveedor Editado Exitosamente",
                error: ErrorResponse,
                autoDismiss: true,
                onSuccess: () => {
                    setTimeout(() => {
                        window.location.href = '/app/verProveedor';
                    }, 1000);
                },
            },
        });
    };

    return (
        <div className="flex flex-col bg-[#f4f4f5] px-8 py-5 rounded-xl w-[400px] mx-auto mt-6">
            <h2 className="text-2xl font-bold text-center">Editar Proveedores</h2>
            <form onSubmit={handleSubmit} className="flex flex-col mt-4">
                <label htmlFor="nit" className="text-lg">
                    NIT <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="text" id="nit" name="nit" required autoComplete="off" value={formData.nit} onChange={handleChange} className="h-8 input-class mt-1 text-lg" placeholder="Debes de escribir un NIT" />
                <label htmlFor="nombre" className="mt-5 text-lg">
                    Nombre <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="text" id="nombre" name="nombre" required autoComplete="off" value={formData.nombre} onChange={handleChange} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir un nombre"/>
                <label htmlFor="telefono" className="mt-5 text-lg">
                    Telefono <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="number" id="telefono" name="telefono" required autoComplete="off" value={formData.telefono} onChange={handleChange} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir un telefono"/>
                <label htmlFor="direccion" className="mt-5 text-lg">
                    Dirección <span className="text-red-500 font-bold">*</span>
                </label>
                <input type="hidden" id="hideid" name="hideid" value={formData.id}/>
                <input type="text" id="direccion" name="direccion" required autoComplete="off" value={formData.direccion} onChange={handleChange} className="input-class h-8 mt-1 text-lg" placeholder="Debes de escribir una direccion"/>
                <button type="submit" className="bg-green-500/100 text-white rounded-md mt-5 h-8 cursor-pointer hover:bg-green-700 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={OnSubmit} >
                    {OnSubmit? "Editando..." : "Editar Proveedor"}
                </button>
            </form>
        </div>
    );
}
