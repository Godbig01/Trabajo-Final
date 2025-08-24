import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { useState } from 'react';

export const ModalConfirmMail = ({idFactura}) => {
    // console.log(idFactura);
    
  const handleConfirm = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Dale al botón de enviar para enviar el correo con el PDF de la factura.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(34 197 94)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Enviar Correo",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const formData = new FormData();
          formData.append("idFactura", idFactura);
          const response = await fetch(`/api/mail/sendMail`, {
            method: "POST",
            body: formData,
          });
          // console.log("Response: ",response);
          
          if (!response.ok) {
            throw new Error('Ha ocurrido un error al enviar el correo.');
          }

          const textResponse = await response.text();
          // console.log(textResponse);

          return textResponse;
        } catch (error) {
            // console.log(error);
            
          Swal.showValidationMessage(`Peticion Fallida: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Enviado!",
          text: "Tu correo ha sido enviado.",
          icon: "success",
          confirmButtonColor: "rgb(34 197 94)",
          confirmButtonText : "HECHO",
        });
      }
    });
  };
  const [OnHover, setOnHover] = useState(false);
  return (
    <button title='Envia La Factura Al Correo' onClick={handleConfirm} onMouseLeave={()=>setOnHover(false)} onMouseEnter={()=>setOnHover(true)} className='font-mono flex gap-2.5 items-center justify-center p-2.5 border-black border-solid border rounded-lg bg-[#f5f5f5] text-xl transition-all duration-200 hover:bg-[#58e358] hover:text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill={OnHover? "#ffffff" : "#666666"} className="transition-all duration-200" d="M13 19c0-3.31 2.69-6 6-6c1.1 0 2.12.3 3 .81V6a2 2 0 0 0-2-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h9.09c-.05-.33-.09-.66-.09-1M4 8V6l8 5l8-5v2l-8 5zm16 14v-2h-4v-2h4v-2l3 3z"/></svg>
        Enviar Factura Por Correo
    </button>
  );
};

export default ModalConfirmMail;