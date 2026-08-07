# CampusFlow - Diseño de Base de Datos

**Versión:** 1.0.0

---

# 1. Objetivo

Diseñar una estructura de datos flexible y escalable que permita administrar múltiples universidades, carreras, planes de estudio, cursos, reglas académicas y progreso individual de estudiantes.

La base de datos debe permitir que CampusFlow pueda crecer desde una herramienta personal hasta una plataforma utilizada por múltiples instituciones educativas.

---

# 2. Principios de diseño

## Escalabilidad

La información académica no estará escrita directamente en el código.

Cada universidad tendrá su propia configuración.

---

## Flexibilidad

El sistema debe soportar:

- Diferentes carreras.
- Diferentes planes curriculares.
- Diferentes límites de créditos.
- Diferentes sistemas de evaluación.
- Diferentes reglas académicas.

---

## Separación de información

Se separará:

- Información institucional.
- Información académica.
- Información del estudiante.
- Información de progreso.

---

# 3. Entidades principales

---

# Universidad

Representa una institución educativa.

Campos:

- id
- nombre
- país
- ciudad
- logo
- configuración académica

Ejemplo:

Universidad ESAN

---

# Carrera

Representa un programa académico.

Campos:

- id
- universidad_id
- nombre
- duración_ciclos
- créditos_totales
- descripción

Ejemplo:

Ingeniería de Software

---

# Plan de estudios

Representa una versión específica de una malla curricular.

Campos:

- id
- carrera_id
- nombre
- año_inicio
- estado

Permite manejar cambios futuros en la malla.

---

# Ciclo académico

Representa cada semestre o nivel.

Campos:

- id
- plan_estudio_id
- número_ciclo
- nombre

Ejemplo:

Ciclo I

---

# Curso

Representa una asignatura.

Campos:

- id
- ciclo_id
- nombre
- código
- créditos
- horas_teoría
- horas_práctica
- horas_laboratorio
- tipo
- obligatorio

---

# Prerrequisito

Relaciona cursos entre sí.

Campos:

- id
- curso_id
- curso_requerido_id

Permite relaciones como:

Precálculo → Cálculo I

Programación → Algoritmos

---

# Reglamento académico

Guarda las reglas propias de cada universidad.

Campos:

- id
- universidad_id
- máximo_créditos_normales
- máximo_créditos_especiales
- promedio_requerido
- escala_notas

Ejemplo:

Máximo normal: 22 créditos

Máximo especial: 24 créditos

Promedio requerido: 17

---

# Usuario

Representa al estudiante.

Campos:

- id
- nombre
- correo
- universidad_id
- carrera_id
- promedio_actual

---

# Progreso académico

Guarda el avance del estudiante.

Campos:

- id
- usuario_id
- curso_id
- estado
- nota
- fecha_aprobación

Estados:

- pendiente
- cursando
- aprobado
- desaprobado
- retirado

---

# Matrícula

Representa la selección de cursos por ciclo.

Campos:

- id
- usuario_id
- ciclo_académico
- créditos_totales
- estado

---

# Curso matriculado

Relaciona cursos con una matrícula.

Campos:

- id
- matrícula_id
- curso_id

---

# Horario

Representa los horarios.

Campos:

- id
- curso_id
- día
- hora_inicio
- hora_fin
- aula

---

# Logros

Sistema de gamificación.

Campos:

- id
- nombre
- descripción
- condición

Ejemplo:

Primer ciclo completado.

---

# Logros del usuario

Relaciona estudiantes con logros.

Campos:

- id
- usuario_id
- logro_id
- fecha_obtención

---

# 4. Relaciones principales

Universidad

↓

Carreras

↓

Planes de estudio

↓

Ciclos

↓

Cursos

↓

Prerrequisitos


Usuario

↓

Progreso académico

↓

Cursos aprobados

---

# 5. Futuras entidades

Para próximas versiones:

- calendario académico
- tareas
- evaluaciones
- notas parciales
- documentos
- recomendaciones IA
- comunidades estudiantiles
- comparación entre universidades

---

# 6. Consideraciones técnicas

Base de datos recomendada:

PostgreSQL

Servicio:

Supabase

Modelo:

Relacional

Prioridad:

Integridad de datos y escalabilidad.