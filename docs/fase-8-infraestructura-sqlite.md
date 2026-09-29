# Fase 8: infraestructura SQLite

## Archivos creados

- `src/infrastructure/database/DatabaseError.ts`: error normalizado de infraestructura; evita filtrar un tipo del plugin a la aplicación.
- `src/infrastructure/database/index.ts`: fachada de inicialización, ejecución DDL/DML, consultas y exportación del error. Repositorios futuros pueden importar desde aquí sin importar el plugin.
- `src/infrastructure/database/sqlite/config.ts`: nombre y versión de la base.
- `src/infrastructure/database/sqlite/schema.ts`: esquema idempotente de `users`, `products` y `persons`.
- `src/infrastructure/database/sqlite/database.ts`: aplicación del esquema a una conexión ya abierta.
- `src/infrastructure/database/sqlite/connection.ts`: singleton de conexión, inicialización específica de web, apertura y persistencia del web store.

El archivo de entrada disponible en `src/infrastructure/database/index.ts` solo exporta funciones de infraestructura. Componentes y casos de uso no deben utilizarla directamente; los repositorios futuros serán sus consumidores. Ningún archivo de presentación importa el plugin.

## Dependencias esperadas

El repositorio aún no contiene `package.json` ni `@capacitor/core`. Al crear/configurar el scaffold Ionic, se deberá instalar una versión de `@capacitor-community/sqlite` compatible con la versión de Capacitor del scaffold, además del soporte web documentado (`jeep-sqlite`, `sql.js` y su `sql-wasm.wasm` en `public/assets`). Este trabajo no crea un `package.json` ni instala dependencias porque todavía no existe una aplicación configurada.

En la plataforma web, la infraestructura registra el custom element, inicializa el web store y llama `saveToStore` después de escribir. En Android/iOS se usa la conexión nativa mediante el plugin.

## Prueba manual mínima

Después de instalar las dependencias y arrancar un proyecto Ionic que use Capacitor, ejecutar temporalmente esta función desde un punto de arranque/desarrollo (no dejarla ligada a cada arranque de producción):

```ts
import {
  initializeDatabase,
  querySql,
  runSql,
} from "./infrastructure/database";

type SmokeRow = { id: number; name: string; email: string };

export async function checkSQLite(): Promise<void> {
  const email = `sqlite-smoke-${Date.now()}@example.test`;
  let inserted = false;

  try {
    await initializeDatabase();
    await runSql("INSERT INTO users (name, email) VALUES (?, ?)", [
      "SQLite smoke test",
      email,
    ]);
    inserted = true;

    const rows = await querySql<SmokeRow>(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email],
    );

    if (rows.length !== 1 || rows[0].name !== "SQLite smoke test") {
      throw new Error("La lectura de prueba no devolvió el registro esperado.");
    }

    console.info("SQLite OK", rows[0]);
  } finally {
    if (inserted) {
      await runSql("DELETE FROM users WHERE email = ?", [email]);
    }
  }
}
```

Resultado esperado: `SQLite OK` con `id`, `name` y `email` en consola. Ejecutar en navegador comprueba el adaptador web/IndexedDB; para comprobar SQLite nativo también debe ejecutarse en Android o iOS con el proyecto sincronizado (`npx cap sync`).

## Limitación actual

No fue posible compilar o ejecutar la prueba en este repositorio: a la fecha de implementación solo existen el README y la documentación, sin scaffold Ionic, `package.json`, dependencias, punto de entrada ni plataformas nativas. La prueba es ejecutable una vez configurados esos prerrequisitos.
