# Fase 3: modelo de dominio mínimo

## Criterios

El dominio expresa los conceptos y reglas básicas sin depender de Ionic React ni de SQLite. Los atributos indicados son una propuesta mínima basada en los requisitos analizados; deben confirmarse antes de su implementación.

No se definen relaciones entre `User`, `Product` y `Person`: el ejercicio no requiere que los registros dependan unos de otros.

## Entidades y reglas

### `User`

- **Propósito:** representar un usuario registrado.
- **Atributos:** `id`, `name`, `email`.
- **Reglas básicas:** identificador asignado; nombre requerido y no vacío; correo requerido y con formato básico válido.
- **Relaciones:** ninguna requerida.

### `Product`

- **Propósito:** representar un producto registrado.
- **Atributos:** `id`, `name`, `price`.
- **Reglas básicas:** identificador asignado; nombre requerido y no vacío; precio finito y mayor que cero.
- **Relaciones:** ninguna requerida.

### `Person`

- **Propósito:** representar una persona registrada.
- **Atributos:** `id`, `name`, `identification`.
- **Reglas básicas:** identificador asignado; nombre e identificación requeridos y no vacíos.
- **Relaciones:** ninguna requerida.

No se impone unicidad a correo o identificación porque no está enunciada como requisito. No se incluye contraseña en `User`, ya que el alcance no requiere autenticación.

## Tipos TypeScript propuestos

Los identificadores del dominio se expresan como `string`; la implementación de persistencia podrá convertirlos si SQLite usa otro formato.

```ts
export type UserId = string;
export type ProductId = string;
export type PersonId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
}

export interface Product {
  id: ProductId;
  name: string;
  price: number;
}

export interface Person {
  id: PersonId;
  name: string;
  identification: string;
}

export type CreateUserData = Pick<User, "name" | "email">;
export type CreateProductData = Pick<Product, "name" | "price">;
export type CreatePersonData = Pick<Person, "name" | "identification">;
```

Los tipos `Create*Data` describen los datos necesarios para solicitar una creación; no incluyen identificador porque este se asigna durante el proceso de creación.

## Separación de modelos

- **Entidad de dominio:** representa un concepto del negocio y sus invariantes, sin detalles de interfaz o almacenamiento. Por ejemplo, `Product` tiene `price: number` independientemente de cómo se capture o guarde.
- **Modelo de persistencia:** adapta los datos al esquema y convenciones de SQLite. Puede tener nombres de columnas, tipos o campos técnicos distintos y debe permanecer en infraestructura.
- **Datos del formulario:** valores capturados en la interfaz antes de validarlos y convertirlos. Pueden estar incompletos y usar tipos adecuados a controles de UI; por ejemplo, un precio puede llegar como texto aunque el dominio utilice `number`.

La aplicación debe mapear los datos entre estas representaciones en sus límites correspondientes. Así el dominio no importa Ionic ni depende de tablas o columnas SQLite.
