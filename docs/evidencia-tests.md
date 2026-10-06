# Evidencia de ejecución de tests — Backend

Fecha de ejecución: 06/10/2026 12:41 · Comando: `npm test` (test runner de Node, `node:test`)

| Archivo | Tipo | Qué prueba |
|---|---|---|
| `tests/validation.test.ts` | Unitario | Validación de ids, textos, emails y enums |
| `tests/password.test.ts` | Unitario | Hash y verificación de contraseñas |
| `tests/precios.test.ts` | Unitario | Precio vigente de un producto |
| `tests/reservas.test.ts` | Unitario | Superposición de horarios de reservas |
| `tests/api.integration.test.ts` | Integración | La API real: health check, 401 sin token, login inválido, 403 por rol, listado de mesas y validación |

```
✔ GET / responde que el servidor está funcionando (120.399278ms)
✔ una ruta protegida sin token devuelve 401 (10.488897ms)
✔ el login con datos incompletos devuelve 400 (44.049716ms)
✔ el login con credenciales incorrectas devuelve 401 (420.582624ms)
✔ un Cocinero no puede ver los usuarios (403) (14.886246ms)
✔ un Mozo puede listar las mesas y recibe una lista (23.516133ms)
✔ crear una mesa con capacidad inválida devuelve 400 con un mensaje claro (11.107139ms)
✔ el hash no guarda la contraseña en texto plano (101.977963ms)
✔ verifyPassword acepta la contraseña correcta y rechaza una incorrecta (260.507764ms)
✔ dos hashes de la misma contraseña son distintos (salt aleatorio) (160.841302ms)
✔ verifyPassword devuelve false si el hash guardado no tiene el formato esperado (0.551984ms)
✔ usa el último precio cargado antes de la fecha de la comanda (1.812823ms)
✔ si la comanda es anterior al primer precio, usa el primer precio (0.390453ms)
✔ si el producto no tiene precios devuelve null (0.270647ms)
✔ el rango va DURACION_RESERVA_HORAS antes y después de la reserva (2.033453ms)
✔ una reserva 1 hora después cae dentro del rango (se pisan) (0.474807ms)
✔ una reserva 3 horas después queda fuera del rango (no se pisan) (0.409432ms)
✔ parsePositiveId acepta enteros positivos (también como texto) (2.949576ms)
✔ parsePositiveId rechaza 0, negativos, decimales y texto (1.608531ms)
✔ requireText recorta espacios y rechaza textos vacíos (0.723551ms)
✔ parseEmail pasa a minúsculas y valida el formato (0.995782ms)
✔ parseOpcion solo acepta valores de la lista (0.761273ms)
ℹ tests 22
ℹ suites 0
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1632.54308
```
