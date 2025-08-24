import { db, Facturas, Clientes, isDbError, DetalleFactura, eq, Productos } from "astro:db";

export async function getEnvoices(){
    try{
        const facturas = await db.select().from(Facturas).innerJoin(Clientes, eq(Clientes.id, Facturas.identificacion_cliente));
        // console.log(facturas);
        
        return { facturas, error : null };
    }catch(e){
        if (isDbError(e)) {
            return { facturas: [], error: "Error en la base de datos" };
        }
        return { error: "Ha ocurrido un error inesperado" };
    }
}

export async function getDetailsEnvoices(){
    try{
        const detallesFactura = await db.select().from(DetalleFactura).innerJoin(Productos, eq(DetalleFactura.id_producto, Productos.id));
        // (detallesFactura);
        
        return { detallesFactura, error: null };
    } catch (e) {
        if (isDbError(e)) {
            return { detallesFactura : [] , error: "Error en la base de datos" };
        }
        return { detallesFactura: [] ,error: "Ha ocurrido un error inesperado mostrando los detalles de la factura" };
    }
}

export async function getEnvoicesById(id:number){
    try{
        const facturas = await db.select().from(Facturas).innerJoin(Clientes, eq(Clientes.id, Facturas.identificacion_cliente)).where(eq(Facturas.id, id));
        // console.log(facturas);
        
        return { facturas, error : null };
    }catch(e){
        if(isDbError(e)){
            return { facturas: [], error: "Error en la base de datos" };
        }
        return { facturas: [], error: "Ha ocurrido un error inesperado" };
    }
}

export async function getDetailsEnvoicesById(id:number){
    // console.log(id);
    
    try{
        const detallesFactura = await db.select().from(DetalleFactura).innerJoin(Productos, eq(DetalleFactura.id_producto, Productos.id)).where(eq(DetalleFactura.id_factura, id));
        // (detallesFactura);
        
        return { detallesFactura, error: null };
    } catch (e) {
        if(isDbError(e)){
            return { detallesFactura: [], error: "Error en la base de datos" };
        }
        return { detallesFactura: [], error: "Ha ocurrido un error inesperado mostrando los detalles de la factura" };
    }
}