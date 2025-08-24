import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export const ModalConfirmMail = ({idFactura}) => {
  const handleConfirm = () => {
    Swal.fire({
        title: `<strong>Factura No. ${idFactura}</u></strong>`,
        html: `
          
          <iframe src="/app/pdf/${idFactura}" class="w-full h-[65vh]" id="Iframe">Vista PDF</iframe>
        `,
        focusConfirm: false,
        confirmButtonText: `
          HECHO
        `,
        confirmButtonColor: "#22c55e",
        width: "80%",
      });
  };

  return (
    <button
      title='Enviar Correo y Ver PDF'
      className="bg-green-500/100 text-white font-semibold py-2 px-4 md:py-1 md:px-3 rounded hover:bg-green-700 transition duration-300 md:text-sm lg:text-base lg:px-4 lg:py-2 md:w-[132px]"
      onClick={handleConfirm}
    >
      Ver Opciones
    </button>
  );
};

export default ModalConfirmMail;
