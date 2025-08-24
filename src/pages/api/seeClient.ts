import { db, Clientes, isDbError, eq } from "astro:db";

export async function getClient() {
    try{
        const clientes = await db.select().from(Clientes);
        return { clientes, error: null };
    } catch (e) {
        if (isDbError(e)) {
            return { clientes: [] , error: "Error en la base de datos" };
        }
        return { error: "Ha ocurrido un error inesperado mostrando los clientes" };
    }
}
export async function getClienteData(id:any){
    try{
        const clientes = await db.select().from(Clientes).where(eq(id,Clientes.identificacion));
        if(clientes.length>0){
            return { clientes, error: null };
        }else{
            return { clientes: [] , error: "Ha ocurrido un error inesperado mostrando los clientes"};
        }
    }catch(e){
        if (isDbError(e)) {
            return { clientes: [] , error: "Error en la base de datos" };
        }
        return { clientes: [] , error: "Ha ocurrido un error inesperado" };
    }
}