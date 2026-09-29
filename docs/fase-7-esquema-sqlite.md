# Fase 7: esquema SQLite mínimo

## Alcance y supuestos

El esquema implementa únicamente los campos propuestos en el modelo de dominio: `User(name, email)`, `Product(name, price)` y `Person(name, identification)`. El enunciado no fija campos ni exige unicidad de correo o identificación; por ello, ambas reglas quedan fuera del esquema mínimo. Se pueden acordar después si el requisito cambia.

Se usan claves primarias enteras generadas por SQLite con `INTEGER PRIMARY KEY`, sin `AUTOINCREMENT` (no se exige que los IDs nunca se reutilicen). Como el dominio propuesto tipa IDs como `string`, el repositorio puede mapear el entero a string al leer y string a entero solo donde corresponda; alternativamente, puede ajustarse el tipo de dominio antes de implementar si se prefiere que represente la clave numérica.

## Modelo relacional

```text
users(
  id INTEGER PK,
  name TEXT NOT NULL,
  email TEXT NOT NULL
)

products(
  id INTEGER PK,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK price > 0
)

persons(
  id INTEGER PK,
  name TEXT NOT NULL,
  identification TEXT NOT NULL
)
```

Las tablas son independientes y no tienen relaciones porque el ejercicio no requiere asociaciones entre usuarios, productos y personas.

## SQL de creación

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  email TEXT NOT NULL CHECK (length(trim(email)) > 0)
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  price REAL NOT NULL CHECK (price > 0)
);

CREATE TABLE IF NOT EXISTS persons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  identification TEXT NOT NULL CHECK (length(trim(identification)) > 0)
);
```

## Explicación de las tablas

- **`users`:** almacena el identificador, nombre y correo. El esquema requiere valores no vacíos, pero el formato del correo se valida en la capa de aplicación, donde puede informarse de manera útil al usuario.
- **`products`:** almacena nombre y precio. `REAL` permite guardar el número decimal propuesto por el dominio; la aplicación debe rechazar valores no finitos y menores o iguales a cero antes del `INSERT`.
- **`persons`:** almacena nombre e identificación como texto, ya que una identificación no se usa para hacer operaciones aritméticas y puede contener ceros iniciales u otros caracteres.

## Reglas de integridad

- Cada fila tiene una clave primaria `id`, asignada por SQLite al insertar si no se proporciona.
- Todos los campos de negocio son `NOT NULL`.
- Las comprobaciones con `trim` impiden almacenar nombres, correo o identificación vacíos o compuestos solo por espacios.
- El precio debe ser mayor que cero. La validación en TypeScript también debe comprobar que sea un número finito.
- El formato de correo no se intenta validar con una expresión SQL incompleta; corresponde a aplicación.
- No hay claves foráneas porque no existen relaciones requeridas.
- No hay índices secundarios: no se han pedido búsquedas/ordenamientos por campos ni se ha establecido unicidad. La clave primaria ya tiene su índice asociado.
- No se crean filas de prueba automáticamente: el registro por UI es el flujo requerido y los datos semilla no son necesarios para inicializar el esquema.

## Inserciones parametrizadas de referencia

Las consultas de los repositorios deben parametrizar los valores, no concatenarlos al SQL:

```sql
INSERT INTO users (name, email) VALUES (?, ?);
INSERT INTO products (name, price) VALUES (?, ?);
INSERT INTO persons (name, identification) VALUES (?, ?);
```

Estas sentencias son referencias de persistencia, no datos semilla.
