# Fase 2: requisitos técnicos

## Alcance funcional

La aplicación debe ofrecer formularios para registrar usuarios, productos y personas, validar datos básicos, persistirlos localmente en SQLite e informar si cada operación tuvo éxito o falló.

El enunciado no determina los campos concretos. Los campos de abajo son una propuesta mínima de análisis y deberán confirmarse antes de implementarlos.

## Registro de usuarios

- **Entidad:** `User`.
- **Datos propuestos:** nombre y correo electrónico. La contraseña queda fuera de la propuesta mínima: el enunciado no pide autenticación y su inclusión exige decidir un manejo seguro.
- **Validaciones:** nombre requerido y no vacío; correo requerido y con formato válido.
- **Caso de uso:** `RegisterUser`; recibe y valida los datos de creación y coordina el guardado.
- **Pantalla:** formulario de registro de usuario.
- **Persistencia:** insertar en la tabla `users`.
- **Resultado esperado:** informar confirmación después de guardar correctamente.
- **Errores posibles:** datos inválidos o fallo al inicializar o escribir en SQLite. El correo duplicado solo aplica si se acuerda una regla de unicidad.

## Registro de productos

- **Entidad:** `Product`.
- **Datos propuestos:** nombre y precio.
- **Validaciones:** nombre requerido y no vacío; precio numérico, finito y mayor que cero.
- **Caso de uso:** `RegisterProduct`; recibe y valida los datos de creación y coordina el guardado.
- **Pantalla:** formulario de registro de producto.
- **Persistencia:** insertar en la tabla `products`.
- **Resultado esperado:** informar confirmación después de guardar correctamente.
- **Errores posibles:** datos inválidos o fallo al inicializar o escribir en SQLite.

## Registro de personas

- **Entidad:** `Person`.
- **Datos propuestos:** nombre e identificación.
- **Validaciones:** ambos valores requeridos y no vacíos.
- **Caso de uso:** `RegisterPerson`; recibe y valida los datos de creación y coordina el guardado.
- **Pantalla:** formulario de registro de persona.
- **Persistencia:** insertar en la tabla `persons`.
- **Resultado esperado:** informar confirmación después de guardar correctamente.
- **Errores posibles:** datos inválidos o fallo al inicializar o escribir en SQLite. La identificación duplicada solo aplica si se acuerda una regla de unicidad.

## Matriz de requisitos

| Requisito           | Entidad                     | UI                               | Caso de uso                    | Persistencia                 | Validaciones                                               |
| ------------------- | --------------------------- | -------------------------------- | ------------------------------ | ---------------------------- | ---------------------------------------------------------- |
| Registrar usuarios  | `User`                      | Formulario de usuario            | `RegisterUser`                 | Insertar en `users`          | Nombre y correo requeridos; formato de correo válido       |
| Registrar productos | `Product`                   | Formulario de producto           | `RegisterProduct`              | Insertar en `products`       | Nombre requerido; precio numérico, finito y mayor que cero |
| Registrar personas  | `Person`                    | Formulario de persona            | `RegisterPerson`               | Insertar en `persons`        | Nombre e identificación requeridos                         |
| Persistir registros | `User`, `Product`, `Person` | La pantalla informa el resultado | Cada caso coordina el registro | SQLite inserta cada registro | Gestionar errores de inicialización y escritura            |

## Requisitos no funcionales

- **Mantenibilidad:** organizar el código por responsabilidades y mantener las tres funciones localizables y modificables.
- **Separación de responsabilidades:** la UI captura y presenta; los casos de uso coordinan; infraestructura encapsula SQLite. Las reglas de negocio no dependen de Ionic.
- **Escalabilidad:** permitir ampliar campos o reglas sin concentrar las funciones en un componente o módulo. No se requiere añadir patrones innecesarios.
- **Claridad:** mantener nombres consistentes entre entidades, formularios, casos de uso y almacenamiento; comunicar éxito y error de manera comprensible.
- **Persistencia:** guardar los registros localmente en SQLite y manejar inicialización y errores de escritura.
- **Calidad del código:** usar tipos explícitos de TypeScript, validaciones coherentes y dependencias controladas entre capas.

## Decisiones pendientes

Confirmar los campos propuestos antes de implementarlos. En particular, decidir si usuario incluye contraseña y, de ser así, cómo se manejará; decidir también si correo e identificación deben ser únicos. Ninguna de esas reglas adicionales está exigida por el enunciado.
