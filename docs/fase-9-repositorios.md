# Fase 9: contratos e implementaciones de repositorio

## Decisión de ubicación

Por instrucción de esta fase, los contratos `UserRepository`, `ProductRepository` y `PersonRepository` viven en `domain/repositories/`. Es una opción válida cuando el dominio expresa qué operaciones de persistencia necesita para sus entidades. Infrastructure depende de esos contratos y los implementa; las entidades no dependen de Infrastructure ni del plugin.

En el diseño de la fase 4 los puertos se habían ubicado en `application/ports/`. La ubicación cambia aquí de forma deliberada para coincidir con esta instrucción; no se mantienen interfaces duplicadas en ambas capas.

## Archivos

- `src/domain/User.ts`, `Product.ts`, `Person.ts`: entidades y tipos de datos de creación, sin SQLite.
- `src/domain/repositories/UserRepository.ts`, `ProductRepository.ts`, `PersonRepository.ts`: contratos mínimos con `saveUser`, `saveProduct` y `savePerson`.
- `src/infrastructure/database/repositories/SqliteUserRepository.ts`, `SqliteProductRepository.ts`, `SqlitePersonRepository.ts`: implementaciones concretas basadas en la fachada de infraestructura `runSql`.

Cada método recibe datos de creación sin ID y devuelve la entidad guardada con el ID que SQLite generó. El adaptador convierte ese ID numérico a `string` para conservar el tipo de dominio previamente propuesto.

No se añaden métodos de búsqueda, actualización o eliminación: no son necesarios para el alcance actual.

## Flujo de dependencias

```text
Aplicación (futura) → contrato en Domain ← implementación SQLite en Infrastructure
                                            │
                                            └── usa fachada de database → plugin SQLite
```

Los repositorios usan placeholders (`?`) y pasan los datos como valores enlazados, de modo que los valores no se concatenan en el SQL. Cambiar el mecanismo de almacenamiento requiere reemplazar la implementación, manteniendo el contrato que usa la aplicación.

