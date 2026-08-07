# CampusFlow - Historias de Usuario

**Versión:** 1.0.0

---

# 1. Objetivo

Este documento describe las principales interacciones que los usuarios podrán realizar dentro de CampusFlow.

Cada historia representa una necesidad del usuario y servirá como guía para el desarrollo de funcionalidades.

---

# 2. Usuario principal: Estudiante

---

# US-001 Crear una cuenta

## Historia

Como estudiante quiero crear una cuenta para guardar mi progreso académico.

## Criterios de aceptación

- El usuario puede registrarse con correo y contraseña.
- Puede seleccionar universidad y carrera.
- Su información queda almacenada.
- Puede acceder desde diferentes dispositivos.

---

# US-002 Configurar perfil académico

## Historia

Como estudiante quiero configurar mi carrera para visualizar mi malla curricular personalizada.

## Criterios de aceptación

El usuario puede seleccionar:

- Universidad.
- Carrera.
- Plan de estudios.
- Ciclo actual.

---

# US-003 Visualizar malla curricular

## Historia

Como estudiante quiero ver mi carrera organizada por ciclos para entender mi ruta académica.

## Criterios de aceptación

La malla debe mostrar:

- Cursos por ciclo.
- Créditos.
- Estado del curso.
- Prerrequisitos.
- Avance general.

---

# US-004 Marcar cursos aprobados

## Historia

Como estudiante quiero marcar los cursos que aprobé para actualizar mi progreso.

## Criterios de aceptación

Al aprobar un curso:

- Cambia su estado.
- Aumenta el progreso.
- Actualiza créditos.
- Desbloquea cursos disponibles.

---

# US-005 Visualizar cursos bloqueados

## Historia

Como estudiante quiero conocer por qué un curso está bloqueado.

## Criterios de aceptación

El sistema debe mostrar:

- Curso requerido.
- Motivo del bloqueo.
- Ruta necesaria para desbloquearlo.

Ejemplo:

```
Cálculo II bloqueado

Necesitas aprobar:

Cálculo I
```

---

# US-006 Planificar matrícula

## Historia

Como estudiante quiero seleccionar cursos futuros para saber si puedo llevarlos.

## Criterios de aceptación

El sistema valida:

- Prerrequisitos.
- Créditos máximos.
- Reglas académicas.

---

# US-007 Controlar carga académica

## Historia

Como estudiante quiero conocer si mi carga académica es adecuada.

## Criterios de aceptación

El sistema muestra:

- Créditos actuales.
- Límite permitido.
- Advertencias.

Ejemplo:

```
18 / 22 créditos

Carga recomendada
```

---

# US-008 Solicitar carga especial

## Historia

Como estudiante quiero saber si puedo superar el límite normal de créditos.

## Criterios de aceptación

El sistema verifica:

- Promedio actual.
- Requisitos institucionales.
- Créditos máximos.

Ejemplo:

```
Promedio: 17.4

Puedes solicitar hasta 24 créditos.
```

---

# US-009 Consultar estadísticas

## Historia

Como estudiante quiero analizar mi avance académico.

## Criterios de aceptación

Debe mostrar:

- Cursos aprobados.
- Créditos completados.
- Porcentaje de carrera.
- Ciclos restantes.

---

# US-010 Simular escenarios

## Historia

Como estudiante quiero probar diferentes decisiones antes de matricularme.

## Criterios de aceptación

El sistema permite:

- Agregar cursos hipotéticos.
- Ver cursos afectados.
- Analizar retrasos.

Ejemplo:

```
Si desapruebas Cálculo I:

Se bloquean:
- Cálculo II
- Física
```

---

# US-011 Recibir recomendaciones

## Historia

Como estudiante quiero recibir sugerencias para organizar mi siguiente ciclo.

## Criterios de aceptación

El sistema recomienda:

- Cursos disponibles.
- Carga equilibrada.
- Ruta eficiente.

---

# US-012 Visualizar logros

## Historia

Como estudiante quiero recibir reconocimiento por mis avances.

## Criterios de aceptación

El sistema muestra:

- Logros obtenidos.
- Próximos objetivos.
- Progreso.

---

# 3. Usuario administrador universitario

---

# US-013 Gestionar universidad

## Historia

Como administrador quiero registrar información académica de mi institución.

## Criterios de aceptación

Puede administrar:

- Universidad.
- Carreras.
- Planes de estudio.
- Cursos.
- Reglas académicas.

---

# US-014 Actualizar mallas curriculares

## Historia

Como administrador quiero modificar la malla cuando exista una actualización curricular.

## Criterios de aceptación

Puede:

- Crear nuevos cursos.
- Modificar créditos.
- Cambiar prerrequisitos.

---

# US-015 Configurar reglas académicas

## Historia

Como administrador quiero establecer las normas de mi universidad.

## Criterios de aceptación

Puede configurar:

- Máximo de créditos.
- Promedios requeridos.
- Escala de notas.
- Condiciones especiales.

---

# 4. Futuras historias con inteligencia artificial

---

# US-016 Asistente académico IA

Como estudiante quiero preguntarle a una IA sobre mi carrera.

Ejemplos:

"¿Qué cursos puedo llevar?"

"¿Cuándo terminaría si llevo 24 créditos?"

"¿Qué cursos debería priorizar?"

---

# US-017 Optimización de trayectoria

Como estudiante quiero recibir una ruta académica optimizada.

La IA analizará:

- Cursos pendientes.
- Rendimiento.
- Tiempo disponible.
- Reglas universitarias.

---

# 5. Prioridad del MVP

## Alta prioridad

- US-002
- US-003
- US-004
- US-005
- US-006
- US-007

## Media prioridad

- US-009
- US-010
- US-011
- US-012

## Futura

- US-013
- US-014
- US-015
- US-016
- US-017