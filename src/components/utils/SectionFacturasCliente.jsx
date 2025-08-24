import { useState } from "react";

export function FacturasClientes({clientes, setCustomer,customer}) {
    

    const handleChangeCustomer = (e) => {
        const customer = clientes.find((cliente) => `${cliente.nombre} ${cliente.apellidos}` === e.target.value);
        if (customer) {
            setCustomer(customer);
            document.getElementById('fullName').value = `${customer.nombre} ${customer.apellidos}`;
            document.getElementById('email').value = customer.correo;
            document.getElementById("searchCustomer").value = "";
            document.getElementById("cedula").value = customer.identificacion;
        }
    };

    return (
        <>
            <datalist id="clientes">
                {clientes.map((cliente) => (
                    <option key={cliente.identificacion} value={`${cliente.nombre} ${cliente.apellidos}`} />
                ))}
            </datalist>
            <section className="bg-zinc-100 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Informacion de clientes</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="searchCustomer">Buscar Clientes</label>
                        <input
                            id="searchCustomer"
                            type="text"
                            placeholder="Buscar por nombre"
                            className="input-class"
                            list="clientes"
                            onChange={e => handleChangeCustomer(e)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="cedula">Identificacion</label>
                        <input id="cedula" type="text" placeholder="657524685" className="input-class" readOnly value={customer && customer.identificacion} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="fullName">Nombre Completo</label>
                        <input id="fullName" type="text" placeholder="Juan Perez" className="input-class" readOnly value={customer && customer.nombre} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="juan.perez@ejemplo.com" className="input-class" readOnly value={customer && customer.correo} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default FacturasClientes;