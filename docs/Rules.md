# CampusFlow - Reglas Académicas del Sistema

**Versión:** 1.0.0

---

# 1. Objetivo

Este documento define las reglas académicas que controlan el funcionamiento interno de CampusFlow.

Las reglas deben ser configurables por universidad para permitir que diferentes instituciones puedan utilizar la plataforma.

---

# 2. Gestión de créditos

## Límite estándar de créditos

Cada universidad podrá definir un límite máximo de créditos permitido por ciclo.

Valor inicial:

```
Máximo permitido: 22 créditos
```

---

## Créditos adicionales con autorización

El sistema permitirá superar el límite estándar cuando el estudiante cumpla los requisitos establecidos por su universidad.

Configuración inicial:

```
Máximo permitido con autorización: 24 créditos
```

---

## Condición para exceder créditos

El estudiante podrá solicitar una carga académica especial cuando:

```
Promedio >= 17
```

El sistema deberá mostrar:

```
Carga especial disponible
```

---

# 3. Estados de cursos

Cada curso podrá tener los siguientes estados:

---

## Bloqueado

El estudiante no cumple los prerrequisitos necesarios.

Ejemplo:

Cálculo II bloqueado.

Motivo:

Debe aprobar Cálculo I.

---

## Disponible

El estudiante cumple todos los requisitos y puede matricularlo.

---

## En curso

El estudiante está llevando actualmente la asignatura.

---

## Aprobado

El estudiante completó satisfactoriamente el curso.

---

## Desaprobado

El estudiante no alcanzó la nota mínima.

---

## Retirado

El estudiante abandonó el curso durante el ciclo.

---

# 4. Sistema de prerrequisitos

Un curso podrá tener uno o varios prerrequisitos.

Ejemplo:

```
Programación

↓

Algoritmos y Estructura de Datos
```

Regla:

Un curso solo será desbloqueado cuando todos sus prerrequisitos estén aprobados.

---

# 5. Cálculo de progreso académico

CampusFlow calculará el progreso utilizando:

## Progreso por cursos

```
Cursos aprobados / Total de cursos
```

---

## Progreso por créditos

```
Créditos aprobados / Créditos totales
```

---

El dashboard mostrará ambos valores.

---

# 6. Planificación de matrícula

Antes de confirmar una matrícula el sistema validará:

---

## Validación de prerrequisitos

Pregunta:

¿El estudiante aprobó todos los cursos requeridos?

Si:

Continuar.

No:

Mostrar alerta.

---

## Validación de créditos

Pregunta:

¿La suma de créditos supera el límite permitido?

Si:

Mostrar advertencia.

---

## Validación de autorización

Si supera 22 créditos:

Verificar:

- promedio requerido
- permiso académico

---

# 7. Recomendación de cursos

El sistema podrá recomendar cursos considerando:

- cursos disponibles
- prerrequisitos cumplidos
- créditos máximos
- avance del estudiante

---

Ejemplo:

```
Cursos recomendados:

Cálculo II
Estadística II
Programación Orientada a Objetos

Total:

12 créditos
```

---

# 8. Simulación académica

El usuario podrá realizar escenarios hipotéticos.

Ejemplo:

¿Qué ocurre si desapruebo Cálculo I?

El sistema analizará:

- cursos afectados
- retraso estimado
- próximos ciclos bloqueados

---

# 9. Promedio académico

Cada universidad podrá configurar:

- escala de notas
- nota mínima aprobatoria
- fórmula del promedio ponderado

---

# 10. Alertas inteligentes

CampusFlow podrá generar alertas:

Ejemplo:

```
⚠ Este curso bloquea 3 asignaturas futuras.
```

```
⚠ Tu carga académica supera la recomendada.
```

```
✓ Cumples requisitos para solicitar créditos adicionales.
```

---

# 11. Configuración por universidad

Todas las reglas deben poder modificarse desde la configuración institucional.

Ejemplos:

- límite de créditos
- promedio mínimo
- escala de notas
- reglas de aprobación
- duración de carrera

---

# 12. Principio general

CampusFlow no reemplaza las normas oficiales de una universidad.

La plataforma funciona como una herramienta de planificación y apoyo académico.