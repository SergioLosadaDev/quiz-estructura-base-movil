# Quiz — Construcción de estructura base de una aplicación

**Programación Móvil · CORHUILA**

> ### 🏆 Regla de oro
>
> Las buenas prácticas vistas hasta el momento en el curso **no son negociables**. Ya deben saberlas.

---

**Duración:** 70 minutos
**Horario:** 7:00 a. m. – 8:10 a. m.

## Objetivo

Construir la estructura base de una aplicación funcional, partiendo del repositorio y trabajando sobre la rama indicada por el docente.

El propósito principal de la actividad es evidenciar cómo cada estudiante aborda, organiza y plantea una solución de software, priorizando una estructura clara, mantenible y coherente antes que la cantidad de funcionalidades desarrolladas.

## Requerimientos funcionales mínimos

La aplicación deberá utilizar SQLite como base de datos e incluir, como mínimo, las siguientes funcionalidades:

1. **Registro de usuarios**
   - Pantalla para registrar un usuario.
   - Persistencia de la información en SQLite.
2. **Registro de productos**
   - Pantalla para registrar productos.
   - Persistencia de la información en SQLite.
3. **Registro de personas**
   - Pantalla para registrar personas.
   - Persistencia de la información en SQLite.

No se requiere construir un sistema completo ni desarrollar funcionalidades adicionales que no hayan sido solicitadas.

## Criterio principal de evaluación

La mayor parte de la valoración estará concentrada en la estructura inicial de la solución.

Se evaluará especialmente:

- Organización de carpetas y archivos.
- Separación adecuada de responsabilidades.
- Estructura preparada para crecer.
- Configuración y acceso a SQLite.
- Separación entre interfaz, lógica de aplicación y persistencia.
- Claridad de nombres.
- Consistencia del código.
- Capacidad para justificar las decisiones tomadas.
- Aplicación ejecutable o, como mínimo, una base funcional correctamente integrada.

## Estructura esperada

No es obligatorio utilizar exactamente una arquitectura específica. Sin embargo, debe evitarse concentrar toda la aplicación en uno o pocos archivos.

Como referencia conceptual:

```
src/
├── application/
├── domain/
├── infrastructure/
│   └── database/
├── presentation/
│   ├── users/
│   ├── products/
│   └── persons/
└── main
```

La estructura exacta dependerá de la tecnología utilizada. Lo importante será demostrar una separación lógica y justificable de responsabilidades.

## Uso de Inteligencia Artificial

Para esta actividad es **obligatorio** utilizar herramientas de Inteligencia Artificial como apoyo durante el desarrollo.

La IA puede utilizarse para:

- proponer una estructura inicial;
- analizar alternativas de arquitectura;
- generar código base;
- resolver errores;
- revisar código;
- generar consultas o estructuras SQLite;
- explicar decisiones técnicas;
- mejorar la organización de la solución.

Sin embargo, el estudiante deberá ser capaz de:

- explicar el código generado;
- justificar por qué utilizó determinada estructura;
- identificar qué partes fueron apoyadas por IA;
- realizar modificaciones sobre la solución;
- demostrar que comprende el funcionamiento de lo desarrollado.

No se calificará únicamente el resultado generado por IA, sino la forma en que el estudiante utiliza la herramienta para construir y comprender la solución.

## Trabajo con Git

El desarrollo deberá realizarse sobre la rama previamente indicada del repositorio.

Durante la actividad se espera mantener un historial de trabajo comprensible.

Ejemplo:

```bash
git checkout <rama-indicada>
git pull
```

Posteriormente:

```bash
git status
git add .
git commit -m "feat: create base application structure"
```

**No crear una rama diferente salvo autorización.**

## Distribución sugerida del tiempo

| Hora        | Actividad                                                    |
| ----------- | ------------------------------------------------------------ |
| 7:00 – 7:10 | Análisis del problema y definición de estructura             |
| 7:10 – 7:25 | Creación de la estructura base y configuración de SQLite     |
| 7:25 – 7:45 | Implementación de registro de usuarios, personas y productos |
| 7:45 – 8:00 | Integración, ejecución y corrección de errores               |
| 8:00 – 8:10 | Revisión final, commit y explicación de la solución          |

## Entregable

Al finalizar los 70 minutos, el repositorio deberá contener como mínimo:

- [ ] Estructura base de la aplicación
- [ ] Configuración de SQLite
- [ ] Persistencia implementada
- [ ] Pantalla de registro de usuarios
- [ ] Pantalla de registro de productos
- [ ] Pantalla de registro de personas
- [ ] Código organizado por responsabilidades
- [ ] Aplicación ejecutable o base funcional demostrable
- [ ] Cambios registrados en Git

## Propósito de la actividad

La actividad no busca determinar quién desarrolla más funcionalidades en 70 minutos. Busca evidenciar cómo el estudiante analiza un problema, utiliza herramientas de IA, estructura una solución de software, implementa una base funcional y puede explicar técnicamente las decisiones que tomó.

La estructura base y el proceso de solución tienen mayor peso que terminar una aplicación grande.

---

Universidad: Corporación Universitaria del Huila - CORHUILA
