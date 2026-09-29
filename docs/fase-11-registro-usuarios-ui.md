# Fase 11: pantalla de registro de usuarios

## Responsabilidad de la pantalla

`src/presentation/users/UserRegistrationPage.tsx` mantiene el estado de los campos, envía la entrada al caso `RegisterUser` recibido por prop, muestra errores por campo y presenta el resultado. No conoce repositorios, esquema, consultas SQL ni el plugin SQLite. La composición de `RegisterUser` con infraestructura corresponde al punto de arranque de la aplicación, aún no creado.

## Contraseña

El requisito de esta fase incorpora contraseña al registro. Para que el campo sea funcional sin guardar texto plano, `RegisterUser` valida longitud mínima y usa el puerto `application/ports/PasswordHasher`. La implementación `infrastructure/security/WebCryptoPasswordHasher.ts` genera sal aleatoria y un hash PBKDF2-HMAC-SHA-256; el repositorio guarda hash/sal y devuelve al dominio/UI únicamente `id`, nombre y email. OWASP recomienda almacenar hashes adaptativos en vez de contraseñas en texto plano y actualmente recomienda 600.000 iteraciones para PBKDF2-HMAC-SHA-256 ([Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)).

Se actualizaron `UserRepository`, `CreateUserData`, `RegisterUser`, el esquema y `SqliteUserRepository` para admitir credenciales derivadas. El esquema asegura las columnas cuando encuentra una base previa del esquema anterior.

## Archivos

- `src/presentation/users/UserRegistrationPage.tsx`: formulario y presentación con Ionic.
- `src/application/ports/PasswordHasher.ts`: contrato sin dependencia de una API de plataforma.
- `src/application/use-cases/RegisterUser.ts`: ahora recibe nombre, email y contraseña; valida, deriva credenciales y usa el repositorio.
- `src/infrastructure/security/WebCryptoPasswordHasher.ts`: implementa hash/sal con Web Crypto.
- `src/domain/User.ts`, `src/domain/repositories/UserRepository.ts`: permiten al repositorio recibir material derivado sin añadirlo a la entidad que se devuelve.
- `src/infrastructure/database/sqlite/schema.ts`, `sqlite/database.ts`, `repositories/SqliteUserRepository.ts`: guardan la credencial derivada y añaden columnas ausentes a una base existente.

## Integración y dependencias

La página requiere una instancia `RegisterUser` mediante la prop `registerUser`; así no construye dependencias ni importa Infrastructure. El arranque futuro debe crear `new RegisterUser(new SqliteUserRepository(), new WebCryptoPasswordHasher())` y pasar esa instancia a la página.

El repositorio actual no declara React ni `@ionic/react` en su `package.json`; esas dependencias deben añadirse al configurar el scaffold Ionic React, según la indicación de no asumir librerías instaladas. No se implementó la ruta ni el punto de composición en esta fase.

