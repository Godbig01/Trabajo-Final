import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'



export function Modal({ dataFacturas, dataDetailEnvoices }){
    (dataFacturas);
    (dataDetailEnvoices);
    const detailEnvoice = dataDetailEnvoices.filter((item) => item.DetalleFactura.id_factura === dataFacturas.id);
    (detailEnvoice);
    
    // console.log(detailEnvoice);
    
    
    const showModal = () => {
        const Fecha = (dataFacturas.fecha_creacion).split(", ");
        console.log(Fecha);
        
        Swal.fire({
            title: `<strong>Detalle Factura ${dataFacturas.id}</strong>`,
            html: `
                <div class="flex flex-col">
                    <p><strong>Fecha Creacion:</strong> ${Fecha[0]}</p>
                    <p><strong>Hora:</strong> ${Fecha[1]}</p>
                    <p><strong>Valor Total:</strong> $${dataFacturas.valor_total}</p>
                    <table class="min-w-full text-center mt-4 border-separate border-spacing-0 rounded-2xl overflow-hidden border border-green-700 border-b-green-300 border-x-green-200">
                        <thead>
                            <tr class="bg-green-500/90 text-white">
                                <th class="py-1 px-2">Producto</th>
                                <th class="py-1 px-2">Cantidad</th>
                                <th class="py-1 px-2">Valor Unitario</th>
                                <th class="py-1 px-2">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detailEnvoice.map(({DetalleFactura, Productos}, index) => `
                                <tr class="${index % 2 !== 0 ? "bg-green-200/50" : ""}">
                                    <td class="py-2 px-4">${Productos.nombre}</td>
                                    <td class="py-2 px-4">${DetalleFactura.cantidad_producto}</td>
                                    <td class="py-2 px-4">$${DetalleFactura.precio_producto}</td>
                                    <td class="py-2 px-4">$${DetalleFactura.precio_producto_total}</td>
                                </tr>
                            `).join('')}
                        </tbody>

                </div> 
            `,
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: "HECHO",
            confirmButtonColor: "#22c55e",
          });
    }
    return (
        <button
        title='Ver Detalle De Factura' 
        className="bg-green-500/100 text-white font-semibold py-2 px-4 md:py-1 md:px-3 rounded hover:bg-green-700 transition duration-300 md:text-sm lg:text-base lg:px-4 lg:py-2 md:w-[132px]"
        onClick={showModal}>
            Ver Detalles
        </button>
    )
}

export default Modal;