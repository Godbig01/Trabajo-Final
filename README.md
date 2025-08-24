
# Proyecto Tienda 7 de Agosto

Este es un proyecto formativo para la tienda 7 de agosto


## Funciones

Estas son los requerimientos funcionales para la aplicacion

| Funcion             | Estado  |
| ----------------- | ------------------------------------------------------------------ |
| Crear Proveedor |  [ ✅ ] |
| Ver Proveedor |  [ ✅ ] |
| Editar Proveedor |  [ ❌ ] |
| Crear Cliente |  [ ✅ ] |
| Ver Cliente |  [ ✅ ] |
| Editar Cliente |  [ ❌ ] |
| Crear Producto |  [ ✅ ] |
| Ver Producto |  [ ✅ ] |
| Editar Producto |  [ ❌ ] |
| Crear Facturas |  [ ✅ ] |
| Ver Facturas |  [ ✅ ] |
| Ver Detalles Facturas |  [ ✅ ] |
| Crear PDF Facturas |  [ ❌ ] |
| Enviar PDF Facturas Correo |  [ ✅ ] |



## API Referencias

#### Crear Cliente

```http
  POST /api/createClient
```

| Datos | Tipo Dato     | Requerido                       |
| :-------- | :------- | :-------------------------------- |
| `Cedula`      | `Number` | **True** |
| `Nombre`      | `String` | **True** |
| `Apellido`      | `String` | **True** |
| `Telefono`      | `String` | **True** |
| `Correo`      | `String` | **True** |
| `Direccion`      | `String` | **True** |

#### Ver Clientes

```http
  POST /api/seeClient
```

#### Crear Proveedor

```http
  POST /api/createProve
```
| Datos | Tipo Dato     | Requerido                       |
| :-------- | :------- | :-------------------------------- |
| `NIT`      | `Number` | **True** |
| `Nombre`      | `String` | **True** |
| `Direccion`      | `String` | **True** |

#### Ver Proveedor

```http
  POST /api/seeProve
```

#### Crear Producto

```http
  POST /api/createProduct
```
| Datos | Tipo Dato     | Requerido                       |
| :-------- | :------- | :-------------------------------- |
| `Codigo`      | `String` | **True** |
| `Nombre`      | `String` | **True** |
| `Precio`      | `Number` | **True** |
| `Cantidad`      | `Number` | **True** |
| `Proveedor`      | `Number` | **True** |

#### Ver Proveedor

```http
  POST /api/seeProve
```
