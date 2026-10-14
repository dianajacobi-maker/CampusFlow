export type CourseStatus = 'en_curso' | 'aprobado' | 'pendiente' | 'retirado';
export type Priority = 'alta' | 'media' | 'baja';

export interface Assessment {
  id: string;
  name: string;
  weight: number;
  grade: number | null;
}

export interface Attempt {
  id: string;
  period: string;
  status: CourseStatus;
  finalGrade: number | null;
  credits: number;
  observations: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  schedule: string;
  professor: string;
  status: CourseStatus;
  assessments: Assessment[];
  targetGrade: number;
  // Malla fields — all optional with defaults for backward compatibility
  cycleId: string | null;
  finalGrade: number | null;
  prerequisiteIds: string[];
  observations: string;
  archived: boolean;
  attempts: Attempt[];
}

export interface Task {
  id: string;
  title: string;
  courseId: string | null;
  dueDate: string;
  priority: Priority;
  estimatedTime: number;
  completed: boolean;
}

export interface StudySession {
  id: string;
  date: string;
  hours: number;
  courseId: string | null;
}

export interface Settings {
  name: string;
  career: string;
  university: string;
  currentCycle: string;
  gradingScale: number;
  passingGrade: number;
}

export interface Cycle {
  id: string;
  name: string;
  order: number;
}

export interface AppState {
  settings: Settings;
  courses: Course[];
  tasks: Task[];
  studySessions: StudySession[];
  weeklyGoalHours: number;
  cycles: Cycle[];
}
