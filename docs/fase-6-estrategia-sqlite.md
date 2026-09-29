# Fase 6: estrategia para SQLite

## Recomendación

Usar `@capacitor-community/sqlite` como adaptador de base de datos para la aplicación Ionic React + Capacitor. El plugin ofrece una API TypeScript común con implementación nativa para iOS/Android y soporte web mediante `jeep-sqlite`. Su repositorio documenta ejemplos de Ionic React y su versión principal actual se alinea con Capacitor 8 (`peerDependencies` requiere `@capacitor/core >=8`).

La elección de versión concreta debe hacerse después de conocer la versión instalada de Capacitor. El repositorio analizado aún no tenía `package.json` ni aplicación Ionic, por lo que no se deben instalar versiones a ciegas.

## Dependencias necesarias

- **`@capacitor-community/sqlite`:** plugin principal; expone conexión, creación/consulta de bases y abstracción sobre plataformas Capacitor.
- **`jeep-sqlite`:** componente Stencil que proporciona la implementación web usada por el plugin.
- **`sql.js` y su archivo `sql-wasm.wasm`:** motor SQLite compilado a WebAssembly usado en el navegador. La guía web oficial requiere que el archivo WASM se encuentre disponible en los assets públicos de la aplicación.
- **`@capacitor/core`:** dependencia base de la aplicación Capacitor y peer dependency del plugin. Debe coincidir con la generación de Capacitor del proyecto.

La integración web además debe cargar/registrar `jeep-sqlite`, crear el elemento en el DOM cuando la plataforma es `web` e inicializar su web store antes de abrir la base. El detalle de scripts de copia WASM y del punto de arranque se implementará después de confirmar el scaffold real de Ionic/Vite.

Referencias oficiales del proyecto: [README e instalación](https://github.com/capacitor-community/sqlite), [uso web](https://github.com/capacitor-community/sqlite/blob/master/docs/Web-Usage.md), [API](https://github.com/capacitor-community/sqlite/blob/master/docs/API.md) y [versiones publicadas](https://github.com/capacitor-community/sqlite/releases).

## Cómo funciona por plataforma

### Android e iOS

Capacitor enruta las llamadas al plugin nativo, que crea y opera una base SQLite local en el almacenamiento privado de la aplicación. Los registros persisten entre ejecuciones de la app. El sistema operativo y la implementación del plugin gestionan la ubicación física; el dominio y los casos de uso no deberían depender de rutas de archivos.

El plugin actual utiliza SQLCipher incluso con bases no cifradas. Su README advierte que puede aplicar la regulación estadounidense de exportación de cifrado y exigir un reporte anual de auto-clasificación. Para un ejercicio académico sin datos sensibles, no se necesita activar cifrado explícito; aun así, esa nota del plugin debe conocerse.

### Navegador durante desarrollo

El navegador no ejecuta el SQLite nativo del teléfono. `jeep-sqlite` ejecuta SQLite en memoria con `sql.js`/WebAssembly y guarda la base del navegador en IndexedDB mediante LocalForage. La API del plugin permite ejercitar operaciones SQL similares, pero el almacenamiento, ciclo de vida, rendimiento y entorno son diferentes al dispositivo.

La guía indica inicializar el web store y guardar la base al llamar `saveToStore`, cerrar la base o cerrar la conexión. Por tanto, la implementación web debe respetar el ciclo de guardado del plugin; no se debe asumir que cada consulta SQL escribe automáticamente en IndexedDB.

La persistencia web queda asociada al origen/perfil del navegador y puede perderse al limpiar los datos del sitio. No equivale a la base SQLite nativa y no se debe usar como evidencia única de funcionamiento en Android/iOS.

## Persistencia y ciclo de vida

- Usar una base local con nombre estable y crear las tablas mediante inicialización idempotente (`CREATE TABLE IF NOT EXISTS`).
- Inicializar plugin, store web cuando aplique, conexión y esquema una sola vez en el arranque antes de habilitar registros.
- Mantener la conexión o recuperarla de forma controlada; evitar que cada componente abra su propia conexión.
- En web, asegurar el guardado a IndexedDB mediante el ciclo documentado del plugin (`saveToStore`/cierre adecuado).
- Usar sentencias parametrizadas para insertar valores capturados y convertir errores técnicos a errores de persistencia comprensibles.
- Validar la persistencia definitiva también en emulador/dispositivo; el navegador no reemplaza esa comprobación.

## Encapsulación por capas

```text
infrastructure/
└── database/
    ├── sqlite/
    │   ├── connection.ts
    │   ├── initializeDatabase.ts
    │   └── schema.ts
    └── repositories/
        ├── SqliteUserRepository.ts
        ├── SqliteProductRepository.ts
        └── SqlitePersonRepository.ts
```

- `connection.ts`: importa `@capacitor-community/sqlite`, configura/crea la conexión compartida y resuelve particularidades de plataforma, incluyendo la inicialización web.
- `initializeDatabase.ts`: espera la disponibilidad del plugin/store, abre la base y aplica el esquema requerido.
- `schema.ts`: contiene únicamente SQL de tablas e índices necesarios para los tres registros.
- `Sqlite*Repository.ts`: implementa el puerto definido en `application`, ejecuta SQL parametrizado, convierte filas al dominio y devuelve fallos de persistencia sin mensajes Ionic.

El punto de composición `src/app/dependencies.ts` conecta los repositorios con los casos de uso. Solo `infrastructure/database/**` importa el plugin SQLite. Casos de uso y presentación reciben interfaces/acciones de aplicación; nunca `SQLiteConnection`, `SQLiteDBConnection`, nombres de tabla ni SQL.

## Alternativas consideradas

- **Usar solo IndexedDB/`localStorage`:** práctico para una app exclusivamente web, pero no cumple el requisito de SQLite en Android/iOS. `localStorage` tampoco es una base relacional.
- **Instalar bindings SQLite solo de JavaScript para Node:** no se integra directamente con los runtimes nativos Capacitor de Android/iOS.
- **Usar un plugin Capacitor con web engine:** es la opción recomendada porque mantiene una API multiplataforma y ofrece un modo web para desarrollo. `@capacitor-community/sqlite` dispone de ejemplos Ionic React, implementación web publicada y soporte nativo.

## Límites y decisiones pendientes

- Confirmar versión de Capacitor al crear la aplicación y fijar una versión compatible del plugin.
- Confirmar build tool/estructura de entrada Vite antes de definir la carga del componente y copia de WASM.
- Mantener las consultas de inserción y el esquema limitados a los campos acordados en dominio; esta fase no agrega funcionalidades.
