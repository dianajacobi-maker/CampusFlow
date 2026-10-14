import type { AppState, Course, Task, StudySession, Settings, Assessment, CourseStatus, Priority, Cycle, Attempt } from '@/types';
import { initialData } from '@/data/initialData';

const validStatuses: CourseStatus[] = ['en_curso', 'aprobado', 'pendiente', 'retirado'];
const validPriorities: Priority[] = ['alta', 'media', 'baja'];

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function clampNum(val: unknown, min: number, max: number, fallback: number): number {
  const n = typeof val === 'number' && !isNaN(val) && isFinite(val) ? val : fallback;
  return Math.max(min, Math.min(max, n));
}

function sanitizeAssessment(raw: unknown): Assessment {
  const a = (raw ?? {}) as Partial<Assessment>;
  return {
    id: typeof a.id === 'string' && a.id ? a.id : genId(),
    name: typeof a.name === 'string' ? a.name : 'Evaluación',
    weight: clampNum(a.weight, 0, 100, 0),
    grade: a.grade === null || a.grade === undefined ? null : clampNum(a.grade, 0, 9999, 0),
  };
}

function sanitizeAttempt(raw: unknown): Attempt {
  const a = (raw ?? {}) as Partial<Attempt>;
  return {
    id: typeof a.id === 'string' && a.id ? a.id : genId(),
    period: typeof a.period === 'string' ? a.period : '',
    status: validStatuses.includes(a.status as CourseStatus) ? (a.status as CourseStatus) : 'pendiente',
    finalGrade: a.finalGrade === null || a.finalGrade === undefined ? null : clampNum(a.finalGrade, 0, 9999, 0),
    credits: clampNum(a.credits, 0, 20, 0),
    observations: typeof a.observations === 'string' ? a.observations : '',
  };
}

function sanitizeCourse(raw: unknown): Course {
  const c = (raw ?? {}) as Partial<Course>;
  return {
    id: typeof c.id === 'string' && c.id ? c.id : genId(),
    name: typeof c.name === 'string' ? c.name : 'Curso sin nombre',
    code: typeof c.code === 'string' ? c.code : '',
    credits: clampNum(c.credits, 0, 20, 3),
    schedule: typeof c.schedule === 'string' ? c.schedule : '',
    professor: typeof c.professor === 'string' ? c.professor : '',
    status: validStatuses.includes(c.status as CourseStatus) ? (c.status as CourseStatus) : 'en_curso',
    assessments: Array.isArray(c.assessments) ? c.assessments.map(sanitizeAssessment) : [],
    targetGrade: clampNum(c.targetGrade, 0, 9999, 14),
    cycleId: typeof c.cycleId === 'string' || c.cycleId === null ? (c.cycleId as string | null) : null,
    finalGrade: c.finalGrade === null || c.finalGrade === undefined ? null : clampNum(c.finalGrade, 0, 9999, 0),
    prerequisiteIds: Array.isArray(c.prerequisiteIds) ? c.prerequisiteIds.filter((id) => typeof id === 'string') : [],
    observations: typeof c.observations === 'string' ? c.observations : '',
    archived: typeof c.archived === 'boolean' ? c.archived : false,
    attempts: Array.isArray(c.attempts) ? c.attempts.map(sanitizeAttempt) : [],
  };
}

function sanitizeTask(raw: unknown): Task {
  const t = (raw ?? {}) as Partial<Task>;
  return {
    id: typeof t.id === 'string' && t.id ? t.id : genId(),
    title: typeof t.title === 'string' ? t.title : 'Tarea sin título',
    courseId: typeof t.courseId === 'string' ? t.courseId : null,
    dueDate: typeof t.dueDate === 'string' ? t.dueDate : new Date().toISOString().slice(0, 10),
    priority: validPriorities.includes(t.priority as Priority) ? (t.priority as Priority) : 'media',
    estimatedTime: clampNum(t.estimatedTime, 0, 999, 1),
    completed: typeof t.completed === 'boolean' ? t.completed : false,
  };
}

function sanitizeStudySession(raw: unknown): StudySession {
  const s = (raw ?? {}) as Partial<StudySession>;
  return {
    id: typeof s.id === 'string' && s.id ? s.id : genId(),
    date: typeof s.date === 'string' ? s.date : new Date().toISOString().slice(0, 10),
    hours: clampNum(s.hours, 0, 24, 1),
    courseId: typeof s.courseId === 'string' ? s.courseId : null,
  };
}

function sanitizeSettings(raw: unknown): Settings {
  const s = (raw ?? {}) as Partial<Settings>;
  const scale = clampNum(s.gradingScale, 1, 100, 20);
  return {
    name: typeof s.name === 'string' ? s.name : 'Estudiante',
    career: typeof s.career === 'string' ? s.career : 'Ingeniería de Software',
    university: typeof s.university === 'string' ? s.university : 'Universidad ESAN',
    currentCycle: typeof s.currentCycle === 'string' ? s.currentCycle : '2026-II',
    gradingScale: scale,
    passingGrade: clampNum(s.passingGrade, 0, scale, Math.min(11, scale)),
  };
}

function sanitizeCycle(raw: unknown): Cycle {
  const c = (raw ?? {}) as Partial<Cycle>;
  return {
    id: typeof c.id === 'string' && c.id ? c.id : genId(),
    name: typeof c.name === 'string' ? c.name : 'Ciclo sin nombre',
    order: clampNum(c.order, 0, 999, 0),
  };
}

export function sanitizeState(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return structuredClone(initialData);
  const s = raw as Partial<AppState>;
  return {
    settings: sanitizeSettings(s.settings),
    courses: Array.isArray(s.courses) ? s.courses.map(sanitizeCourse) : structuredClone(initialData.courses),
    tasks: Array.isArray(s.tasks) ? s.tasks.map(sanitizeTask) : [],
    studySessions: Array.isArray(s.studySessions) ? s.studySessions.map(sanitizeStudySession) : [],
    weeklyGoalHours: clampNum(s.weeklyGoalHours, 1, 168, 20),
    cycles: Array.isArray(s.cycles) && s.cycles.length > 0 ? s.cycles.map(sanitizeCycle) : structuredClone(initialData.cycles),
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data: AppState | null;
}

export function validateImportedData(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['El archivo no contiene un objeto JSON válido.'], data: null };
  }

  const s = raw as Partial<AppState>;

  if (!s.settings || typeof s.settings !== 'object') {
    errors.push('Falta la sección "settings" o no es un objeto válido.');
  }

  if (s.courses !== undefined && !Array.isArray(s.courses)) {
    errors.push('"courses" debe ser una lista.');
  }

  if (s.tasks !== undefined && !Array.isArray(s.tasks)) {
    errors.push('"tasks" debe ser una lista.');
  }

  if (s.studySessions !== undefined && !Array.isArray(s.studySessions)) {
    errors.push('"studySessions" debe ser una lista.');
  }

  if (s.cycles !== undefined && !Array.isArray(s.cycles)) {
    errors.push('"cycles" debe ser una lista.');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  const data = sanitizeState(raw);
  return { valid: true, errors: [], data };
}
