# CampusFlow - Guía de Diseño UI/UX

**Versión:** 1.0.0

---

# 1. Objetivo del diseño

CampusFlow debe transmitir:

- Claridad.
- Organización.
- Progreso.
- Inteligencia.
- Motivación.

La experiencia debe sentirse como una mezcla entre:

- Plataforma educativa.
- Dashboard profesional.
- Sistema de progreso de videojuego.

El estudiante debe sentir que su carrera es un camino visible y alcanzable.

---

# 2. Principios de diseño

## Simplicidad

La información académica debe ser fácil de interpretar.

Evitar:

- Pantallas saturadas.
- Tablas extensas.
- Información innecesaria.

---

## Visualización del progreso

El avance académico debe ser visible constantemente.

Ejemplo:

```
Ingeniería de Software

42% completado

████████░░░░░░░░
```

---

## Feedback inmediato

Cada acción del usuario debe generar respuesta visual.

Ejemplo:

Al aprobar un curso:

- Cambio de color.
- Animación de desbloqueo.
- Actualización del progreso.

---

# 3. Identidad visual

## Estilo general

Moderno.

Minimalista.

Profesional.

Inspirado en:

- Productos SaaS.
- Aplicaciones de productividad.
- Plataformas educativas modernas.

---

# 4. Paleta de colores

## Color principal

Azul oscuro

Uso:

- Navegación.
- Encabezados.
- Elementos principales.

Representa:

- Confianza.
- Tecnología.
- Educación.

---

## Color secundario

Azul eléctrico

Uso:

- Botones.
- Elementos interactivos.
- Destacados.

---

## Estados académicos

### Aprobado

Verde

Significado:

Curso completado.

---

### Disponible

Azul

Significado:

Curso listo para matricular.

---

### En curso

Amarillo

Significado:

Curso actualmente llevado.

---

### Bloqueado

Gris

Significado:

Requiere requisitos previos.

---

### Desaprobado

Rojo

Significado:

Curso pendiente de recuperación.

---

# 5. Tipografía

Fuente recomendada:

Inter

Características:

- Moderna.
- Legible.
- Profesional.

---

# 6. Navegación principal

La aplicación tendrá una barra lateral:

```
CampusFlow

🏠 Dashboard

🎓 Mi Carrera

📚 Cursos

📊 Estadísticas

🗓 Planificador

🏆 Logros

⚙ Configuración
```

---

# 7. Dashboard

Pantalla principal.

Debe mostrar:

## Tarjeta de progreso

Información:

- Carrera.
- Porcentaje completado.
- Créditos aprobados.
- Cursos pendientes.

---

## Resumen académico

Mostrar:

- Promedio.
- Ciclo actual.
- Créditos disponibles.

---

## Próximos cursos recomendados

Ejemplo:

```
Próximo ciclo recomendado:

✓ Algoritmos
✓ Estadística II
✓ Física I
```

---

# 8. Malla curricular interactiva

La pantalla principal del producto.

Los cursos serán tarjetas.

Ejemplo:

```
┌─────────────────┐
│ Programación    │
│ 5 créditos      │
│                 │
│ 🟢 Aprobado     │
└─────────────────┘
```

---

# 9. Estados visuales de cursos

## Aprobado

Características:

- Color verde.
- Icono de check.
- Animación positiva.

---

## Disponible

Características:

- Destacado.
- Botón para agregar a planificación.

---

## Bloqueado

Características:

- Opacidad reducida.
- Icono de candado.
- Mostrar requisitos.

---

# 10. Experiencia tipo videojuego

Agregar elementos de motivación:

- Experiencia académica.
- Niveles.
- Logros.
- Progreso visual.

Ejemplo:

```
Nivel 3

2500 XP

Próximo logro:

Completar 50 créditos
```

---

# 11. Responsive Design

Debe funcionar en:

- Computadora.
- Tablet.
- Celular.

---

# 12. Modo oscuro

Debe incluir:

- Tema claro.
- Tema oscuro.

---

# 13. Animaciones

Usar animaciones suaves:

- Desbloqueo de cursos.
- Cambio de progreso.
- Obtención de logros.

Evitar animaciones excesivas.

---

# 14. Componentes principales

## CourseCard

Tarjeta individual de curso.

Debe mostrar:

- Nombre.
- Créditos.
- Estado.
- Prerrequisitos.

---

## ProgressBar

Barra de avance académico.

---

## CreditCalculator

Calculadora de créditos.

---

## RecommendationCard

Sugerencias académicas.

---

## AchievementCard

Sistema de logros.

---

# 15. Objetivo final de experiencia

Cuando un estudiante abra CampusFlow debe pensar:

"Ahora entiendo exactamente dónde estoy, qué me falta y qué debo hacer para terminar mi carrera."