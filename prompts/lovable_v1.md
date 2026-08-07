# CampusFlow - Prompt para Lovable

## Versión

0.1.0 - MVP Prototype

---

# Contexto del producto

Construye una aplicación web llamada **CampusFlow**.

CampusFlow es una plataforma inteligente de planificación académica universitaria cuyo objetivo es ayudar a los estudiantes a visualizar, organizar y optimizar su trayectoria académica.

Es una herramienta que funciona como un mapa interactivo de carrera donde el estudiante puede conocer:

- Qué cursos ha completado.
- Qué cursos puede llevar.
- Qué cursos están bloqueados.
- Qué requisitos necesita cumplir.
- Cuánto ha avanzado hacia su graduación.

---

# Identidad del producto

Nombre:

CampusFlow

Eslogan:

"El mapa inteligente de tu carrera."

Misión:

Empoderar a los estudiantes universitarios mediante una plataforma inteligente que les permita visualizar, planificar y optimizar su trayectoria académica, mejorando la toma de decisiones, el aprovechamiento del tiempo y su rendimiento durante toda la carrera.

---

# Objetivo del MVP

Crear una primera versión funcional donde un estudiante pueda:

1. Visualizar su malla curricular.
2. Ver cursos organizados por ciclos.
3. Marcar cursos aprobados.
4. Ver cursos desbloqueados automáticamente.
5. Identificar cursos bloqueados y sus prerrequisitos.
6. Consultar su progreso académico.

---

# Usuario principal

Estudiante universitario.

Ejemplo:

Carrera:

Ingeniería de Software

Universidad:

Universidad ESAN

Ciclo actual:

II

---

# Filosofía del diseño

La aplicación debe sentirse como una mezcla entre:

- Plataforma educativa moderna.
- Dashboard profesional.
- Sistema de progreso tipo videojuego.

El estudiante debe sentir que su carrera es un camino visible y alcanzable.

---

# Diseño visual y experiencia UX/UI

## Estilo general

Crear una interfaz moderna, limpia y profesional.

Inspiración:

- Aplicaciones SaaS modernas.
- Plataformas educativas.
- Herramientas de productividad.

Evitar:

- Diseños saturados.
- Exceso de tablas.
- Interfaces antiguas tipo sistema universitario tradicional.

---

# Identidad visual

## Colores principales

Color principal:

Azul oscuro.

Uso:

- Barra lateral.
- Encabezados.
- Elementos principales.

---

Color secundario:

Azul eléctrico.

Uso:

- Botones.
- Elementos interactivos.
- Destacados.

---

# Estados de cursos

Cada curso debe tener un estado visual:

## Aprobado

Color:

Verde.

Mostrar:

- Icono de check.
- Apariencia completada.
- Sensación de progreso.

---

## Disponible

Color:

Azul.

Mostrar:

- Curso desbloqueado.
- Acción para agregar al plan.

---

## En curso

Color:

Amarillo.

Mostrar:

- Curso actualmente matriculado.

---

## Bloqueado

Color:

Gris.

Mostrar:

- Icono de candado.
- Explicación del requisito faltante.

Ejemplo:

"Cálculo II bloqueado. Requiere aprobar Cálculo I."

---

# Tipografía

Usar:

Inter

La interfaz debe ser legible y profesional.

---

# Estructura principal de navegación

Crear una barra lateral:

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

# Pantalla 1: Dashboard

Crear una pantalla principal con:

## Encabezado

Mostrar:

- Nombre del estudiante.
- Carrera.
- Universidad.
- Ciclo actual.

---

## Tarjeta de progreso

Mostrar:

Ejemplo:

Ingeniería de Software

8% completado

Barra visual de progreso.

Mostrar también:

- Créditos aprobados.
- Cursos completados.
- Cursos restantes.

---

## Resumen académico

Mostrar tarjetas:

- Promedio actual.
- Créditos disponibles.
- Estado de carga académica.

Ejemplo:

"Puedes solicitar hasta 24 créditos con autorización."

---

## Cursos recomendados

Mostrar una sección:

"Próximos cursos recomendados"

Ejemplo:

- Algoritmos y Estructura de Datos.
- Arquitectura del Computador I.
- Ingeniería de Requerimientos.

---

# Pantalla 2: Mi Carrera

Esta será la pantalla principal del producto.

Mostrar la malla curricular completa.

Organizar cursos por ciclo:

```
Ciclo I

[Curso] [Curso] [Curso]


Ciclo II

[Curso] [Curso] [Curso]
```

---

Cada curso debe mostrarse como una tarjeta:

Información:

- Nombre del curso.
- Créditos.
- Ciclo.
- Estado.
- Prerrequisitos.

---

# Interacciones de cursos

Al hacer clic en un curso:

Mostrar:

- Información completa.
- Prerrequisitos.
- Cursos que desbloquea.
- Estado actual.

---

# Animaciones

Agregar animaciones suaves:

- Cambio de estado.
- Desbloqueo de cursos.
- Actualización del progreso.

No utilizar animaciones excesivas.

---

# Responsive Design

La aplicación debe adaptarse a:

- Desktop.
- Tablet.
- Móvil.
---

# Lógica académica del sistema

## Principio general

CampusFlow debe funcionar mediante reglas académicas configurables.

No debe tener valores escritos directamente en la interfaz.

Los datos deben provenir de archivos estructurados o una base de datos.

---

# Gestión de cursos

Cada curso debe contener:

- Nombre.
- Código (si existe).
- Ciclo.
- Créditos.
- Categoría.
- Prerrequisitos.
- Estado.

---

# Estados de cursos

El sistema debe calcular automáticamente el estado de cada curso.

---

## Curso aprobado

Condición:

El estudiante registra el curso como aprobado.

Resultado:

- Cambiar estado a aprobado.
- Actualizar progreso.
- Sumar créditos completados.
- Evaluar cursos dependientes.

---

## Curso disponible

Condición:

Todos los prerrequisitos están aprobados.

Resultado:

El estudiante puede planificarlo.

---

## Curso bloqueado

Condición:

Falta aprobar uno o más prerrequisitos.

Mostrar:

- Nombre del curso requerido.
- Explicación del bloqueo.

Ejemplo:

```
Cálculo II

Bloqueado

Necesitas aprobar:
Cálculo I
```

---

# Sistema de prerrequisitos

Los cursos deben conectarse mediante relaciones.

Ejemplo:

```
Precálculo
     ↓
Cálculo I
     ↓
Cálculo II
```

Otro ejemplo:

```
Programación
     ↓
Algoritmos y Estructura de Datos
     ↓
Análisis y Diseño de Algoritmos
```

Cuando un curso cambia a aprobado:

1. Revisar cursos relacionados.
2. Validar requisitos.
3. Desbloquear automáticamente los cursos disponibles.

---

# Sistema de créditos

CampusFlow debe controlar la carga académica.

Configuración inicial:

Créditos máximos normales:

22

Créditos máximos especiales:

24

---

# Carga especial

El estudiante puede superar 22 créditos cuando:

```
Promedio actual >= 17
```

Mostrar:

Si cumple:

```
✓ Puedes solicitar carga especial

Hasta 24 créditos
```

Si no cumple:

```
No disponible

Requiere promedio mínimo de 17
```

---

# Planificador académico

Permitir al estudiante seleccionar cursos futuros.

El sistema debe calcular:

- Créditos seleccionados.
- Cursos válidos.
- Cursos bloqueados.
- Exceso de créditos.

---

# Validaciones antes de matricular

Antes de agregar un curso:

Comprobar:

1. ¿Cumple prerrequisitos?
2. ¿Supera límite de créditos?
3. ¿Necesita autorización?

---

# Cálculo de progreso

Mostrar dos tipos de progreso:

## Progreso por cursos

Fórmula:

```
Cursos aprobados / Cursos totales x 100
```

---

## Progreso por créditos

Fórmula:

```
Créditos aprobados / Créditos totales x 100
```

---

# Recomendaciones académicas

El sistema debe sugerir cursos considerando:

- Cursos disponibles.
- Prerrequisitos.
- Créditos permitidos.
- Ciclo actual.

Ejemplo:

```
Recomendación:

Llevar Algoritmos y Estructura de Datos.

Motivo:

Desbloquea cursos importantes del siguiente ciclo.
```

---

# Datos iniciales del prototipo

Utilizar los archivos:

```
data/universities.json

data/careers.json

data/courses.json

data/prerequisites.json

data/student-example.json

data/config.json
```

Estos archivos representan la fuente inicial de información.

---

# Objetivo técnico

Crear un MVP funcional donde la lógica académica pueda demostrarse sin necesidad de conexión con sistemas universitarios externos.
---

# Requisitos técnicos y alcance del MVP

## Objetivo técnico

Construir una aplicación web funcional llamada CampusFlow.

La primera versión debe priorizar:

- Funcionamiento correcto.
- Buena experiencia de usuario.
- Código organizado.
- Facilidad de evolución futura.

---

# Arquitectura inicial

Separar la aplicación en:

## Datos

Contiene:

- Universidades.
- Carreras.
- Cursos.
- Prerrequisitos.
- Usuarios demo.
- Configuración.

Fuente inicial:

```
/data
```

---

## Componentes visuales

Crear componentes reutilizables:

Ejemplo:

```
components/

CourseCard

ProgressBar

DashboardCard

CycleSection

PrerequisiteBadge

Sidebar
```

---

# Tecnologías sugeridas

Utilizar una arquitectura moderna para aplicaciones web.

Preferencias:

- React.
- TypeScript.
- Tailwind CSS.
- Componentes reutilizables.

La solución debe mantenerse preparada para integrar posteriormente:

- Base de datos.
- Autenticación.
- Inteligencia artificial.
- Aplicación móvil.

---

# Pantallas requeridas para la versión 0.1

Crear únicamente:

## 1. Dashboard

Debe mostrar:

- Información del estudiante.
- Progreso académico.
- Créditos completados.
- Cursos disponibles.
- Recomendaciones.

---

## 2. Malla curricular

Debe mostrar:

- Todos los ciclos.
- Cursos organizados.
- Estados visuales.
- Prerrequisitos.

---

## 3. Detalle del curso

Al seleccionar un curso mostrar:

- Créditos.
- Categoría.
- Estado.
- Requisitos.
- Cursos desbloqueados.

---

## 4. Planificador

Permitir:

- Seleccionar cursos futuros.
- Calcular créditos.
- Validar límites académicos.

---

# Funciones fuera del alcance inicial

No implementar todavía:

- Chat con inteligencia artificial.
- Sistema social.
- Foro estudiantil.
- Aplicación móvil.
- Integraciones universitarias.
- Pagos.
- Marketplace.

Estas funciones pertenecen a futuras versiones.

---

# Experiencia esperada

El usuario debe sentir:

"Ahora entiendo mi carrera y sé qué debo hacer para avanzar."

La aplicación debe transformar una malla curricular estática en un mapa académico interactivo.

---

# Criterios de éxito del MVP

La primera versión será exitosa si permite:

✅ Ver una carrera completa organizada por ciclos.

✅ Marcar cursos aprobados.

✅ Actualizar progreso automáticamente.

✅ Desbloquear cursos según prerrequisitos.

✅ Calcular créditos disponibles.

✅ Mostrar recomendaciones básicas.

---

# Próximos pasos después del MVP

Futuras versiones podrán incorporar:

- Registro de usuarios.
- Varias universidades.
- Inteligencia artificial.
- Predicción de tiempo de graduación.
- Recomendaciones personalizadas.
- Aplicación móvil.