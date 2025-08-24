import FacturasCliente from "@/components/utils/SectionFacturasCliente";
import FacturasProducto from "@/components/utils/SectionFacturasProducto";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { toast } from '@pheralb/toast';
import { useState, useEffect } from "react";
import { ShowToastError } from "./utils/showToast";

import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'

export function Factures({ dataClient, dataProducts }) {
    const customerEnd = dataClient.filter((cliente) => cliente.identificacion == "22222222");
    
    const [Customer, setCustomer] = useState(customerEnd[0] || null);
    const [ProductosAñadidos, setProductosAñadidos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [total, setTotal] = useState(0);
    const [messageError, setMessageError] = useState("Ha ocurrido un error");

    console.log(customerEnd);
    console.log(Customer);
    

    // Calcular el total acumulado de la factura
    useEffect(() => {
        const newTotal = ProductosAñadidos.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        setTotal(newTotal);
    }, [ProductosAñadidos]);

    const handleProductQuantityChange = (index, change) => {
        const updatedProducts = [...ProductosAñadidos];
        const currentProduct = updatedProducts[index];
        const productoFind = dataProducts.find((producto) => producto.id === currentProduct.id);
        
        if (!productoFind) {
            console.error("Producto no encontrado en dataProducts");
            return;
        }

        const newQuantity = currentProduct.quantity + change;

        if (newQuantity > 0 && newQuantity <= productoFind.cantidad) {
            currentProduct.quantity = newQuantity;
            setProductosAñadidos(updatedProducts);
        } else if (newQuantity <= 0) {
            toast.warning({ text: "Advertencia", description: "La cantidad no puede ser menor que 1" });
        } else {
            toast.warning({ text: "Advertencia", description: "No hay suficientes existencias" });
        }
    }

    const crearFactura = async () => {
        if (!Customer) {
            return ShowToastError({ message: "Seleccione un cliente" });
        }
        if (ProductosAñadidos.length === 0) {
            return ShowToastError({ message: "Añada productos a la factura" });
        }

        const fechaCreacion = new Date();
        const fechaFormateada = fechaCreacion.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-');

        const facturaData = {
            cliente: Customer.id,
            productos: ProductosAñadidos,
            fecha: fechaFormateada,
            total: total,
        };

        const sendRequest = async () => {
            try {
                const res = await fetch('/api/createEnvoice', {
                    method: 'POST',
                    body: JSON.stringify(facturaData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const resText = await res.json();

                console.log(resText);
                

                if (res.status === 401) {
                    return window.location.href = '/';
                }
                if (!res.ok) {
                    setMessageError(resText.error);
                    throw new Error(resText.error || 'Algo salió mal');
                }
                
                return resText;
            } catch (error) {
                throw error;
            } finally {
                setIsSubmitting(false);
            }
        };

        setIsSubmitting(true);
        toast.loading({
            text: 'Creando factura...',
            options: {
                promise: sendRequest(),
                success: 'Factura creada con éxito',
                error: 'Error al crear la factura',
                autoDismiss: true,
                onSuccess: () => {
                    setProductosAñadidos([]);
                    Swal.fire({
                        title: "¿Deseas enviar un PQRS?",
                        html: `
                        <form id="pqr-form" autocomplete="off">
                            <label for="asunto" class="block mt-4">Asunto</label>
                            <input type="text" id="asunto" name="asunto" class="w-full p-2 border rounded mt-1" required placeholder="Escribe aqui el asunto">
                            <label for="mensaje" class="block mt-4">Mensaje</label>
                            <textarea id="mensaje" name="mensaje" class="w-full p-2 mt-1 border rounded max-h-32" required maxlength="100" placeholder="Escribe aqui el mensaje (maximo 100 caracteres)"></textarea>
                        </form>
                        `,
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#22c55e",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Enviar PQRS",
                        cancelButtonText: "Cancelar",
                        showLoaderOnConfirm: true,
                        preConfirm: async () => {
                            try {
                            const formData = new FormData();
                            formData.append("asunto", Swal.getPopup().querySelector('#asunto').value);
                            formData.append("message", Swal.getPopup().querySelector('#mensaje').value);    
                            const response = await fetch(`/api/createPqrs`, {
                                method: "POST",
                                body: formData,
                            });

                            const textResponse = await response.text();
                            // console.log(response);
                            // console.log(textResponse);
                            

                            if (!response.ok) {
                                throw new Error('Ha ocurrido un error al guardar el pqrs.');
                            }

                            // console.log(textResponse);

                            return textResponse;
                            } catch (error) {
                            Swal.showValidationMessage(`Peticion Fallida: ${error}`);
                            }
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                        }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                            title: "Enviado!",
                            text: "Tu PQRS se guardo correctamente.",
                            icon: "success",
                            confirmButtonColor: "#28a745",
                            confirmButtonText: "HECHO",
                            });
                        }
                        });
                },
                onError: () => {
                    toast.error({ text: "Mensaje del error:", description: messageError });
                }
            },
        });
    }


    return (
        <div className="p-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <FacturasCliente clientes={dataClient || []} setCustomer={setCustomer} customer={Customer} Customer={Customer}/>
                <FacturasProducto productos={dataProducts || []} setProductosAñadidos={setProductosAñadidos} ProductosAñadidos={ProductosAñadidos} />
            </div>

            <section className="w-full overflow-x-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Factura</h2>
                <table className="w-full min-w-[640px] bg-white shadow-md rounded-lg overflow-hidden text-center">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="py-2 px-4">Producto</th>
                            <th className="py-2 px-4">Cantidad</th>
                            <th className="py-2 px-4">Precio Unitario</th>
                            <th className="py-2 px-4">Total</th>
                            <th className="py-2 px-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ProductosAñadidos.length === 0 ? (
                            <tr>
                                <td className="py-2 px-4" colSpan="5">No hay productos</td>
                            </tr>
                        ) : (
                            ProductosAñadidos.map((product, index) => (
                                <tr key={product.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    <td className="py-2 px-4">{product.name}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2 justify-center">
                                            <button
                                                className="hover:text-gray-500 disabled:hover:text-black disabled:cursor-not-allowed transition-all duration-200"
                                                onClick={() => handleProductQuantityChange(index, -1)}
                                                disabled={product.quantity <= 1}
                                            >
                                                <CiSquareMinus className="h-6 w-6" />
                                            </button>
                                            <span>{product.quantity}</span>
                                            <button onClick={() => handleProductQuantityChange(index, 1)}>
                                                <CiSquarePlus className="h-6 w-6 hover:text-gray-500 transition-all duration-200" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">${product.price}</td>
                                    <td className="py-2 px-4">${(product.price * product.quantity)}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="text-white bg-red-600 p-2 rounded hover:bg-red-700 transition-all duration-200"
                                            onClick={() => {
                                                const updatedProducts = [...ProductosAñadidos];
                                                updatedProducts.splice(index, 1);
                                                setProductosAñadidos(updatedProducts);
                                            }}
                                        >
                                            <FaTrash className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-gray-200/70">
                        <tr>
                            <td colSpan="3" className="py-2 px-4 text-right font-bold">Total:</td>
                            <td className="py-2 px-4 font-bold">${total}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </section>
            <button 
                type="button" 
                className="mt-6 bg-[#22c55e] text-white font-bold py-2 px-4 rounded hover:bg-[#15803d] transition duration-300 mb-6 w-full sm:w-1/2 lg:w-1/4 mx-auto block disabled:cursor-not-allowed disabled:bg-gray-300"
                onClick={crearFactura}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Creando...' : 'Crear Factura'}
            </button>
        </div>
    )
}

export default Factures;
