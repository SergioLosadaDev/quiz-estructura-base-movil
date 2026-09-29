# Fase 5: estructura física del proyecto

## Criterio de organización

La estructura adapta la separación `Presentation / Application / Domain / Infrastructure` a una aplicación Ionic React con TypeScript. Agrupa por capa y, dentro de presentación, por funcionalidad. `src/app/dependencies.ts` es el punto pequeño de composición: conecta casos de uso con repositorios concretos y evita que las páginas importen SQLite.

La estructura define archivos y responsabilidades, no su implementación. Los nombres de plugin y paquete SQLite quedan pendientes de la fase de configuración. Los archivos pueden crearse conforme se implementa cada fase; no es necesario generar archivos vacíos.

## Árbol propuesto

```text
src/
├── app/
│   └── dependencies.ts
├── application/
│   ├── ports/
│   │   ├── UserRepository.ts
│   │   ├── ProductRepository.ts
│   │   └── PersonRepository.ts
│   └── use-cases/
│       ├── RegisterUser.ts
│       ├── RegisterProduct.ts
│       └── RegisterPerson.ts
├── domain/
│   ├── User.ts
│   ├── Product.ts
│   └── Person.ts
├── infrastructure/
│   └── database/
│       ├── sqlite/
│       │   ├── connection.ts
│       │   ├── initializeDatabase.ts
│       │   └── schema.ts
│       └── repositories/
│           ├── SqliteUserRepository.ts
│           ├── SqliteProductRepository.ts
│           └── SqlitePersonRepository.ts
├── presentation/
│   ├── components/
│   │   └── FormFeedback.tsx
│   ├── users/
│   │   ├── UserRegistrationPage.tsx
│   │   └── UserForm.tsx
│   ├── products/
│   │   ├── ProductRegistrationPage.tsx
│   │   └── ProductForm.tsx
│   └── persons/
│       ├── PersonRegistrationPage.tsx
│       └── PersonForm.tsx
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

Los archivos habituales del proyecto Ionic/Vite fuera de `src/` —como `index.html`, `vite.config.ts`, `package.json`, configuración TypeScript y `ionic.config.json`— pertenecen al esqueleto y configuración de plataforma, no a las capas funcionales de esta estructura.

## Responsabilidad y límites por archivo

### Composición y arranque

| Archivo                   | Responsabilidad                                                                             | Debe conocer                                                     | No debe conocer                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/main.tsx`            | Punto de entrada Vite: monta React y arranca Ionic.                                         | `App`, React y configuración global de estilos.                  | Consultas SQL, validaciones de negocio o detalles de formularios.            |
| `src/App.tsx`             | Configura `IonApp`, `IonReactRouter`, navegación y rutas para las páginas.                  | Rutas Ionic, páginas y dependencias preparadas para cada página. | SQL, esquema de tablas o reglas de persistencia.                             |
| `src/app/dependencies.ts` | Crea/adapta repositorios SQLite y construye los casos de uso que consumirá la presentación. | Implementaciones de repositorio y casos de uso.                  | JSX, controles Ionic o reglas de negocio propias. No contiene consultas SQL. |

### Dominio

| Archivo                 | Responsabilidad                                             | Debe conocer                      | No debe conocer                            |
| ----------------------- | ----------------------------------------------------------- | --------------------------------- | ------------------------------------------ |
| `src/domain/User.ts`    | Tipo de usuario y, si hace falta, reglas puras del usuario. | Atributos y reglas del usuario.   | SQLite, Ionic, React, rutas o formularios. |
| `src/domain/Product.ts` | Tipo de producto y reglas puras del producto.               | Atributos y reglas del producto.  | SQLite, Ionic, React, rutas o formularios. |
| `src/domain/Person.ts`  | Tipo de persona y reglas puras de la persona.               | Atributos y reglas de la persona. | SQLite, Ionic, React, rutas o formularios. |

### Aplicación: puertos y casos de uso

| Archivo                                        | Responsabilidad                                                      | Debe conocer                                                             | No debe conocer                                     |
| ---------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------- |
| `src/application/ports/UserRepository.ts`      | Declara el contrato de guardado requerido para usuarios.             | Tipo de dominio `User` y errores/resultados de aplicación si se definen. | Plugin SQLite, SQL, componentes o rutas.            |
| `src/application/ports/ProductRepository.ts`   | Declara el contrato de guardado requerido para productos.            | Tipo de dominio `Product`.                                               | Plugin SQLite, SQL, componentes o rutas.            |
| `src/application/ports/PersonRepository.ts`    | Declara el contrato de guardado requerido para personas.             | Tipo de dominio `Person`.                                                | Plugin SQLite, SQL, componentes o rutas.            |
| `src/application/use-cases/RegisterUser.ts`    | Valida y coordina el registro y solicita persistencia por el puerto. | Dominio y `UserRepository`.                                              | Ionic, React, SQL o implementación concreta SQLite. |
| `src/application/use-cases/RegisterProduct.ts` | Valida y coordina el registro y solicita persistencia por el puerto. | Dominio y `ProductRepository`.                                           | Ionic, React, SQL o implementación concreta SQLite. |
| `src/application/use-cases/RegisterPerson.ts`  | Valida y coordina el registro y solicita persistencia por el puerto. | Dominio y `PersonRepository`.                                            | Ionic, React, SQL o implementación concreta SQLite. |

Los casos de uso cumplen el papel de servicios de aplicación. No se añade otra carpeta `services/`, porque sería una segunda capa para la misma coordinación sin una necesidad actual.

### Infraestructura SQLite

| Archivo                                                               | Responsabilidad                                                           | Debe conocer                                                     | No debe conocer                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| `src/infrastructure/database/sqlite/connection.ts`                    | Encapsula la conexión/instancia de base de datos del plugin seleccionado. | API del plugin y configuración necesaria para abrir la conexión. | Formularios, navegación o reglas de presentación. |
| `src/infrastructure/database/sqlite/schema.ts`                        | Mantiene las sentencias de creación de tablas y estructura inicial.       | Tablas, columnas e índices estrictamente necesarios.             | Componentes React o reglas de UI.                 |
| `src/infrastructure/database/sqlite/initializeDatabase.ts`            | Asegura que la base esté lista y aplique el esquema requerido.            | Conexión y esquema.                                              | Páginas, alertas o componentes Ionic.             |
| `src/infrastructure/database/repositories/SqliteUserRepository.ts`    | Implementa `UserRepository` con operaciones SQLite de usuario.            | Puerto de usuario, conexión, SQL y mapeo entre fila y dominio.   | JSX, navegación o texto de interfaz.              |
| `src/infrastructure/database/repositories/SqliteProductRepository.ts` | Implementa `ProductRepository` con operaciones SQLite de producto.        | Puerto de producto, conexión, SQL y mapeo entre fila y dominio.  | JSX, navegación o texto de interfaz.              |
| `src/infrastructure/database/repositories/SqlitePersonRepository.ts`  | Implementa `PersonRepository` con operaciones SQLite de persona.          | Puerto de persona, conexión, SQL y mapeo entre fila y dominio.   | JSX, navegación o texto de interfaz.              |

### Presentación

| Archivo                                                 | Responsabilidad                                                                                               | Debe conocer                                                            | No debe conocer                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| `src/presentation/users/UserRegistrationPage.tsx`       | Página Ionic de registro de usuario; recibe datos del formulario, invoca el caso de uso y presenta resultado. | Componentes Ionic, `UserForm` y una acción/caso de uso de aplicación.   | Conexión, SQL, tablas o repositorio SQLite concreto. |
| `src/presentation/users/UserForm.tsx`                   | Controles y captura de campos de usuario.                                                                     | Tipos/datos de formulario de usuario y validación de entrada inmediata. | Casos de uso concretos, SQLite o navegación global.  |
| `src/presentation/products/ProductRegistrationPage.tsx` | Página de registro de producto y presentación del resultado.                                                  | Componentes Ionic, `ProductForm` y acción de aplicación.                | Conexión, SQL, tablas o repositorio SQLite concreto. |
| `src/presentation/products/ProductForm.tsx`             | Controles y captura de nombre y precio.                                                                       | Datos de formulario; precio puede ser texto hasta convertirse.          | SQLite o casos de uso concretos.                     |
| `src/presentation/persons/PersonRegistrationPage.tsx`   | Página de registro de persona y presentación del resultado.                                                   | Componentes Ionic, `PersonForm` y acción de aplicación.                 | Conexión, SQL, tablas o repositorio SQLite concreto. |
| `src/presentation/persons/PersonForm.tsx`               | Controles y captura de nombre e identificación.                                                               | Datos de formulario de persona y validación inmediata básica.           | SQLite o casos de uso concretos.                     |
| `src/presentation/components/FormFeedback.tsx`          | Presentación reutilizable de mensajes de éxito/error, solo si reduce duplicación real.                        | Props de mensaje/estado y componentes visuales Ionic.                   | Casos de uso, repositorios, SQL o reglas de negocio. |

`FormFeedback.tsx` es prescindible: si solo se usa una vez o añade más complejidad que claridad, cada página puede presentar el mensaje con Ionic directamente. Los formularios también pueden vivir dentro de sus páginas si su separación no aporta claridad; se muestran separados para hacer explícita la opción de reutilizarlos o mantenerlos pequeños.

## Dependencias principales

```text
main.tsx → App.tsx → páginas de presentation
                         │
                         └── invocan casos de application

app/dependencies.ts ── construye ──> casos de application
       │                                  │
       │                                  ├── depende de domain
       │                                  └── define/usa puertos
       └── usa repositorios SQLite ───────┘

repositorios SQLite → puertos de application + domain + plugin SQLite
domain → ninguna capa externa
```

El punto de composición es la única ubicación que conecta implementaciones concretas con los casos de uso. Las páginas no importan `infrastructure`.

## Decisiones para mantener el alcance pequeño

- Los casos de uso son los servicios de aplicación; no se crea una capa `services` redundante.
- No se agrega repositorio genérico, ORM, contenedor IoC ni gestor global de estado.
- Se mantiene una página por registro y se extrae un formulario solo cuando facilita claridad o reutilización.
- Los modelos SQLite permanecen dentro de infraestructura; la UI conserva sus datos de formulario y la aplicación recibe datos tipados del dominio.
- La lista de archivos guía la implementación, pero no exige crear archivos vacíos antes de necesitarlos.
