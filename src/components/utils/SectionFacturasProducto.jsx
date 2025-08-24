import { ShowToastError, ShowToastSuccess } from "@/components/utils/showToast";
import { toast } from "@pheralb/toast";

const FacturasProducto = ({ productos, setProductosAñadidos, ProductosAñadidos }) => {
    const handleChangeProduct = (e) => {
        const productEncontrado = productos.find((producto) => producto.nombre === e.target.value);
        if (productEncontrado) {
            document.getElementById("productName").value = productEncontrado.nombre;
            document.getElementById("price").value = productEncontrado.precio;
            document.getElementById("quantityExist").value = productEncontrado.cantidad;
            document.getElementById("searchProduct").value = "";
        }
    };
    const handleClickAddProduct = () => {
        const nameProduct = document.getElementById("productName").value;
        if(nameProduct === "") {
            ShowToastError({message: "Debe seleccionar un producto"});
            return;
        }
        const cantidad = parseInt(document.getElementById("quantity").value);
        const existencias = parseInt(document.getElementById("quantityExist").value);
        
        if(cantidad && cantidad > 0){
            if (cantidad > existencias) {
                toast.warning({text: "Advertencia", description: "Productos insuficientes"});
                return; // Salimos de la función sin guardar el producto
            }
            
            const productAdd = productos.find((producto) => producto.nombre === nameProduct);
            if(productAdd){
                document.getElementById("productName").value = "";
                document.getElementById("price").value = "";
                document.getElementById("quantityExist").value = "";
                document.getElementById("quantity").value = 1;
                
                // Verificar si el producto ya está en la lista
                const existingProductIndex = ProductosAñadidos.findIndex(p => p.id === productAdd.id);
    
                if (existingProductIndex !== -1) {
                    // Si ya existe, solo actualiza la cantidad
                    const updatedProducts = [...ProductosAñadidos];
                    updatedProducts[existingProductIndex].quantity += cantidad;
                    setProductosAñadidos(updatedProducts);
                } else {
                    // Si no existe, añádelo como un producto nuevo
                    const productData = {
                        id: productAdd.id,
                        name: productAdd.nombre,
                        price: productAdd.precio,
                        quantity: cantidad,
                    }
                    setProductosAñadidos([...ProductosAñadidos, productData]);
                }
                ShowToastSuccess({message: "Producto añadido correctamente"});
            }
        } else {
            ShowToastError({message: "La cantidad debe ser mayor a 0"});
        }
    }
    
    return (
        <>
            <datalist id="productos">
                {productos.map((producto) => (
                    <option key={producto.id} value={producto.nombre} />
                ))}
            </datalist>
            <section className="bg-zinc-100 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Añadir Productos</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="searchProduct">Buscar Producto</label>
                        <input
                            id="searchProduct"
                            type="text"
                            placeholder="Buscar por nombre"
                            className="input-class"
                            list="productos"
                            onChange={handleChangeProduct}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="productName">Nombre Producto</label>
                        <input id="productName" type="text" placeholder="Producto XYZ" className="input-class" readOnly />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="price">Precio</label>
                        <input id="price" type="number" placeholder="2500" className="input-class" readOnly />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="quantityExist">Cantidad Existencias</label>
                        <input id="quantityExist" type="number" placeholder="Cantidad de existencias" className="input-class" readOnly />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="quantity">Cantidad a facturar</label>
                        <input id="quantity" type="number" placeholder="Cantidad a facturas" className="input-class" defaultValue={1} />
                    </div>
                    <button 
                    onClick={handleClickAddProduct}
                    type="button" className="justify-self-end bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                        Añadir Producto
                    </button>
                </div>
            </section>
        </>
    );
}

export default FacturasProducto;