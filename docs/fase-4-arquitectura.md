# Fase 4: diseño arquitectónico

## Objetivo y alcance

Esta arquitectura separa interfaz, coordinación de operaciones, conceptos del negocio y acceso a SQLite. Está pensada para Ionic React + TypeScript y para poder implementarse durante el quiz sin introducir capas o patrones que el alcance no necesita.

La selección del plugin SQLite queda para la fase de configuración. Esta propuesta no presupone que ya exista una dependencia instalada.

## Estructura propuesta

```text
src/
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
│       │   └── initializeDatabase.ts
│       ├── SqliteUserRepository.ts
│       ├── SqliteProductRepository.ts
│       └── SqlitePersonRepository.ts
├── presentation/
│   ├── users/
│   │   ├── UserRegistrationPage.tsx
│   │   └── useUserRegistration.ts
│   ├── products/
│   │   ├── ProductRegistrationPage.tsx
│   │   └── useProductRegistration.ts
│   └── persons/
│       ├── PersonRegistrationPage.tsx
│       └── usePersonRegistration.ts
├── App.tsx
└── main.tsx
```

Los hooks de presentación son opcionales. Si la coordinación de estado de un formulario cabe claramente en el componente, puede mantenerse allí; no se debe crear un hook solo por cumplir una estructura. Del mismo modo, los tres repositorios pueden compartir detalles de conexión y utilidades SQLite sin crear una abstracción genérica antes de necesitarla.

## Responsabilidad de cada capa y carpeta

### `domain/`

Contiene los tipos o entidades de negocio (`User`, `Product`, `Person`) y, si resulta útil, validaciones que expresen reglas del negocio. No conoce Ionic, React, SQLite ni el plugin escogido. Mantiene las reglas pequeñas y explícitas.

### `application/`

- **`use-cases/`:** cada caso de uso coordina una acción concreta: validar los datos ya convertidos a tipos de dominio y pedir que se guarden. Expone un resultado o error que la UI pueda presentar, sin importar componentes Ionic.
- **`ports/`:** define las operaciones de repositorio que la aplicación necesita, como `save(user: User): Promise<void>`. Son interfaces TypeScript; no contienen SQL ni detalles de SQLite.

### `infrastructure/database/`

- **`sqlite/`:** encapsula la creación/configuración de la conexión y la inicialización del esquema.
- **`Sqlite*Repository.ts`:** implementa los puertos de aplicación mediante el plugin SQLite elegido, ejecuta las consultas parametrizadas y convierte filas SQLite a tipos de dominio cuando haga falta.

Esta carpeta es el único lugar donde se conocen el plugin, la conexión y las consultas SQL.

### `presentation/`

Organiza por funcionalidad. Cada página Ionic muestra el formulario, captura valores, presenta errores y confirma éxito o fallo. Puede delegar la gestión de estado del formulario a un hook local. No contiene SQL ni conoce tablas.

### `App.tsx` y `main.tsx`

Contienen el arranque y la composición de la aplicación: navegación de Ionic y conexión de dependencias concretas. El punto de composición puede importar implementaciones SQLite y suministrar repositorios a los casos de uso/páginas. Esta excepción localizada permite construir la aplicación; no autoriza a los componentes de formulario a importar infraestructura.

## Dependencias

Las dependencias de ejecución apuntan hacia las reglas más estables:

- `domain` no depende de otras capas.
- `application` depende de `domain` y declara los puertos que necesita.
- `infrastructure` depende de `application` para implementar sus puertos y de `domain` para mapear datos.
- `presentation` depende de `application` para invocar casos de uso y de `domain` para los tipos necesarios en formularios.
- El punto de composición (`main.tsx`/`App.tsx`) puede conocer `presentation` e `infrastructure` para ensamblar la aplicación.

Se deben evitar estas dependencias:

- Dominio o casos de uso importando React, Ionic o el plugin SQLite.
- Componentes de pantalla importando conexión, ejecutando consultas SQL o conociendo tablas.
- SQL o tipos de filas SQLite filtrándose hacia el dominio o la presentación.
- Infraestructura decidiendo cómo mostrar alertas o mensajes Ionic.
- Dependencias circulares entre las capas.

## Flujo de registro

1. La persona usuaria completa un formulario Ionic. Los controles entregan valores de formulario, a menudo como texto.
2. La página valida lo básico para dar respuesta inmediata y convierte los valores a tipos apropiados (por ejemplo, `price` de texto a `number`).
3. La página invoca el caso de uso correspondiente de `application`.
4. El caso de uso aplica o verifica las reglas necesarias y llama el método del puerto de repositorio.
5. La implementación `Sqlite*Repository` abre o usa la conexión encapsulada, ejecuta un `INSERT` parametrizado y traduce fallos técnicos a un error de persistencia entendible por la aplicación.
6. El resultado vuelve al caso de uso y a la página. La UI muestra confirmación o un mensaje de error apropiado.

## Cómo se evita SQL en React

Los componentes reciben o utilizan casos de uso, no conexiones SQLite ni repositorios concretos. Las interfaces de repositorio se declaran en `application/ports`; las implementaciones SQL viven en `infrastructure/database`. El punto de composición crea la implementación SQLite y la entrega al caso de uso. Así, la pantalla conoce una acción como `registerProduct(data)`, nunca una consulta, tabla o plugin.

## Crecimiento posterior

Si se añaden campos o reglas, se actualizan el tipo/regla de dominio, el caso de uso y su formulario o mapeo de almacenamiento según corresponda. Si cambia SQLite o el plugin, se sustituyen o modifican las implementaciones de infraestructura conservando el contrato del repositorio. Una nueva función puede seguir la misma organización por funcionalidad.

Para el quiz no se requieren contenedor de dependencias, bus de eventos, capa de servicios adicional, ORM, repositorio genérico, Redux ni una arquitectura de plugins. Solo se introducirían si una necesidad concreta futura los justifica.

## Diagrama textual de dependencias

```text
                           ┌─────────────────────────┐
                           │ main.tsx / App.tsx      │
                           │ composición y arranque  │
                           └──────────┬──────────────┘
                                      │ ensambla
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
          ┌─────────────────────┐          ┌─────────────────────┐
          │ Presentation        │          │ Infrastructure      │
          │ páginas Ionic       │          │ adaptadores SQLite  │
          └──────────┬──────────┘          └──────────┬──────────┘
                     │ invoca                          │ implementa
                     ▼                                 ▼
          ┌─────────────────────────────────────────────────────┐
          │ Application: casos de uso y puertos de repositorio  │
          └──────────────────────────┬──────────────────────────┘
                                     │ usa
                                     ▼
                          ┌─────────────────────┐
                          │ Domain              │
                          │ entidades y reglas  │
                          └─────────────────────┘

  Infrastructure también depende de los tipos del Domain para mapear filas.
  Domain no depende de ninguna otra capa.
```
