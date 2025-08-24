import { db, Proveedor, isDbError, eq } from "astro:db";

export async function getProveedor() {
    try{
        const proveedores = await db.select().from(Proveedor);
        return { proveedores, error: null };
    } catch (e) {
        if (isDbError(e)) {
            return { proveedores: [], error: "Error en la base de datos" };
        }
        return { proveedores: [], error: "Ha ocurrido un error inesperado" };
    }
}
export async function getProvData(nit:any){
    try{
        const proveedor = await db.select().from(Proveedor).where(eq(nit,Proveedor.NIT));
        if(proveedor.length > 0){
            return { proveedor, error: null };
        }else{
            return { proveedores: [], error: "Ha ocurrido un error inesperado mostrando los proveedores"};
        }
    }catch(e){
        if (isDbError(e)) {
            return { proveedores: [], error: "Error en la base de datos" };
        }
        return { proveedores: [], error: "Ha ocurrido un error inesperado" };
    }
}