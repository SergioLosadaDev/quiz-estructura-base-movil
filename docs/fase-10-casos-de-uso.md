# Fase 10: casos de uso de registro

## Implementación

- `src/application/RegistrationResult.ts` define el resultado discriminado de operación correcta/error, códigos de validación y persistencia y errores por campo.
- `src/application/use-cases/RegisterUser.ts` normaliza nombre/correo, valida campos y correo y guarda mediante `UserRepository`.
- `src/application/use-cases/RegisterProduct.ts` normaliza nombre, valida nombre y precio finito positivo y guarda mediante `ProductRepository`.
- `src/application/use-cases/RegisterPerson.ts` normaliza y valida nombre/identificación y guarda mediante `PersonRepository`.

Los casos de uso reciben el contrato por constructor, dependen de tipos/contratos de Domain y no importan Ionic, React, Infrastructure o SQLite. Los fallos del repositorio se traducen a mensajes de persistencia estables para presentar en la UI; los detalles internos del error técnico no se exponen a la capa de presentación.

## Flujo de dependencias

```text
UI futura → Application (caso de uso) → contrato del repositorio en Domain
                                           ↑
                         Infrastructure implementa el contrato → SQLite
```
