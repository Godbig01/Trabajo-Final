import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss' 

export default function ModalConfirmPQRS({enviarPQR}) {
    console.log("xd");
    
    const showModal = () => {
        Swal.fire({
                        title: "Registrar PQRS",
                        icon: "info",
                        html: `
                            <form id="pqr-form" autocomplete="off">
                                <label for="asunto" class="block mt-4">Asunto</label>
                                <input type="text" id="asunto" name="asunto" class="w-full p-2 border rounded mt-1" required placeholder="Escribe aqui el asunto">
                                <label for="mensaje" class="block mt-4">Mensaje</label>
                                <textarea id="mensaje" name="mensaje" class="w-full p-2 mt-1 border rounded max-h-32" required maxlength="100" placeholder="Escribe el mensaje (maximo 100 caracteres)"></textarea>
                            </form>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Enviar PQRS',
                        cancelButtonText: "Cancelar",
                        cancelButtonColor: "#d33",
                        confirmButtonColor: "#22c55e",
                        preConfirm: () => {
                            const asunto = Swal.getPopup().querySelector('#asunto').value;
                            const mensaje = Swal.getPopup().querySelector('#mensaje').value;

                            if (!asunto || !mensaje) {
                                Swal.showValidationMessage('Por favor ingrese el asunto y mensaje.');
                                return false;
                            }
                            return { asunto, mensaje };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.showLoading(); // Muestra el indicador de carga

                            const { asunto, mensaje } = result.value;

                            enviarPQR({ asunto, mensaje })
                                .then(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito',
                                        text: 'PQRS enviada correctamente.',
                                    });
                                })
                                .catch(() => {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Hubo un problema al enviar la PQRS.',
                                    });
                                })
                                .finally(() => {
                                    Swal.hideLoading(); // Oculta el indicador de carga
                                });
                        }
                    });
    }
    return showModal;
}