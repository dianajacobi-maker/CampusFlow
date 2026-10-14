import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialData, STORAGE_KEY } from '@/data/initialData';
import { sanitizeState, validateImportedData, type ValidationResult } from '@/utils/validation';
import type { AppState, Course, Task, StudySession, Settings, Assessment, Cycle, Attempt, CourseStatus } from '@/types';

interface AppContextValue extends AppState {
  // Settings
  updateSettings: (s: Partial<Settings>) => void;
  setWeeklyGoalHours: (h: number) => void;
  // Courses
  addCourse: (c: Omit<Course, 'id' | 'assessments' | 'targetGrade' | 'prerequisiteIds' | 'observations' | 'archived' | 'attempts' | 'finalGrade' | 'cycleId'> & { targetGrade?: number; cycleId?: string | null; finalGrade?: number | null; prerequisiteIds?: string[]; observations?: string; archived?: boolean }) => void;
  updateCourse: (id: string, c: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  archiveCourse: (id: string) => void;
  unarchiveCourse: (id: string) => void;
  moveCourseToCycle: (courseId: string, cycleId: string | null) => void;
  // Assessments
  addAssessment: (courseId: string, a: Omit<Assessment, 'id'>) => void;
  updateAssessment: (courseId: string, assessmentId: string, a: Partial<Assessment>) => void;
  deleteAssessment: (courseId: string, assessmentId: string) => void;
  // Prerequisites
  togglePrerequisite: (courseId: string, prereqId: string) => void;
  // Attempts
  addAttempt: (courseId: string, a: Omit<Attempt, 'id'>) => void;
  deleteAttempt: (courseId: string, attemptId: string) => void;
  // Cycles
  addCycle: (name: string) => void;
  updateCycle: (id: string, c: Partial<Cycle>) => void;
  deleteCycle: (id: string) => void;
  reorderCycles: (ids: string[]) => void;
  // Tasks
  addTask: (t: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // Study sessions
  addStudySession: (s: Omit<StudySession, 'id'>) => void;
  deleteStudySession: (id: string) => void;
  // Backup
  exportData: () => string;
  importData: (jsonString: string) => ValidationResult;
  // Reset
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [rawState, setRawState] = useLocalStorage<AppState>(STORAGE_KEY, initialData);
  const state = sanitizeState(rawState);

  const setState = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setRawState((prev) => updater(sanitizeState(prev)));
    },
    [setRawState],
  );

  const updateSettings = useCallback(
    (s: Partial<Settings>) =>
      setState((prev) => ({ ...prev, settings: { ...prev.settings, ...s } })),
    [setState],
  );

  const setWeeklyGoalHours = useCallback(
    (h: number) => setState((prev) => ({ ...prev, weeklyGoalHours: Math.max(1, Math.min(168, h)) })),
    [setState],
  );

  const addCourse = useCallback(
    (c: Omit<Course, 'id' | 'assessments' | 'targetGrade' | 'prerequisiteIds' | 'observations' | 'archived' | 'attempts' | 'finalGrade' | 'cycleId'> & { targetGrade?: number; cycleId?: string | null; finalGrade?: number | null; prerequisiteIds?: string[]; observations?: string; archived?: boolean }) =>
      setState((prev) => ({
        ...prev,
        courses: [
          ...prev.courses,
          {
            id: uid(),
            assessments: [],
            targetGrade: c.targetGrade ?? prev.settings.passingGrade + 3,
            cycleId: c.cycleId ?? null,
            finalGrade: c.finalGrade ?? null,
            prerequisiteIds: c.prerequisiteIds ?? [],
            observations: c.observations ?? '',
            archived: c.archived ?? false,
            attempts: [],
            ...c,
          },
        ],
      })),
    [setState],
  );

  const updateCourse = useCallback(
    (id: string, c: Partial<Course>) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((course) => (course.id === id ? { ...course, ...c } : course)),
      })),
    [setState],
  );

  const deleteCourse = useCallback(
    (id: string) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            prerequisiteIds: c.prerequisiteIds.filter((pid) => pid !== id),
          })),
        tasks: prev.tasks.filter((t) => t.courseId !== id),
      })),
    [setState],
  );

  const archiveCourse = useCallback(
    (id: string) => setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => c.id === id ? { ...c, archived: true } : c),
    })),
    [setState],
  );

  const unarchiveCourse = useCallback(
    (id: string) => setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => c.id === id ? { ...c, archived: false } : c),
    })),
    [setState],
  );

  const moveCourseToCycle = useCallback(
    (courseId: string, cycleId: string | null) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => (c.id === courseId ? { ...c, cycleId } : c)),
      })),
    [setState],
  );

  const addAssessment = useCallback(
    (courseId: string, a: Omit<Assessment, 'id'>) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId ? { ...c, assessments: [...c.assessments, { ...a, id: uid() }] } : c,
        ),
      })),
    [setState],
  );

  const updateAssessment = useCallback(
    (courseId: string, assessmentId: string, a: Partial<Assessment>) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                assessments: c.assessments.map((asmt) =>
                  asmt.id === assessmentId ? { ...asmt, ...a } : asmt,
                ),
              }
            : c,
        ),
      })),
    [setState],
  );

  const deleteAssessment = useCallback(
    (courseId: string, assessmentId: string) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? { ...c, assessments: c.assessments.filter((a) => a.id !== assessmentId) }
            : c,
        ),
      })),
    [setState],
  );

  const togglePrerequisite = useCallback(
    (courseId: string, prereqId: string) => {
      if (courseId === prereqId) return; // Prevent self-prerequisite
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => {
          if (c.id !== courseId) return c;
          const has = c.prerequisiteIds.includes(prereqId);
          return {
            ...c,
            prerequisiteIds: has
              ? c.prerequisiteIds.filter((pid) => pid !== prereqId)
              : [...c.prerequisiteIds, prereqId],
          };
        }),
      }));
    },
    [setState],
  );

  const addAttempt = useCallback(
    (courseId: string, a: Omit<Attempt, 'id'>) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId ? { ...c, attempts: [...c.attempts, { ...a, id: uid() }] } : c,
        ),
      })),
    [setState],
  );

  const deleteAttempt = useCallback(
    (courseId: string, attemptId: string) =>
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? { ...c, attempts: c.attempts.filter((a) => a.id !== attemptId) }
            : c,
        ),
      })),
    [setState],
  );

  const addCycle = useCallback(
    (name: string) =>
      setState((prev) => ({
        ...prev,
        cycles: [...prev.cycles, { id: uid(), name, order: prev.cycles.length }],
      })),
    [setState],
  );

  const updateCycle = useCallback(
    (id: string, c: Partial<Cycle>) =>
      setState((prev) => ({
        ...prev,
        cycles: prev.cycles.map((cy) => (cy.id === id ? { ...cy, ...c } : cy)),
      })),
    [setState],
  );

  const deleteCycle = useCallback(
    (id: string) =>
      setState((prev) => {
        if (prev.cycles.length <= 1) return prev; // Keep at least one cycle
        return {
          ...prev,
          cycles: prev.cycles.filter((cy) => cy.id !== id),
          courses: prev.courses.map((c) =>
            c.cycleId === id ? { ...c, cycleId: null } : c,
          ),
        };
      }),
    [setState],
  );

  const reorderCycles = useCallback(
    (ids: string[]) =>
      setState((prev) => ({
        ...prev,
        cycles: prev.cycles
          .map((cy) => {
            const idx = ids.indexOf(cy.id);
            return { ...cy, order: idx === -1 ? cy.order : idx };
          })
          .sort((a, b) => a.order - b.order),
      })),
    [setState],
  );

  const addTask = useCallback(
    (t: Omit<Task, 'id' | 'completed'>) =>
      setState((prev) => ({
        ...prev,
        tasks: [{ ...t, id: uid(), completed: false }, ...prev.tasks],
      })),
    [setState],
  );

  const updateTask = useCallback(
    (id: string, t: Partial<Task>) =>
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...t } : task)),
      })),
    [setState],
  );

  const deleteTask = useCallback(
    (id: string) =>
      setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) })),
    [setState],
  );

  const toggleTask = useCallback(
    (id: string) =>
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      })),
    [setState],
  );

  const addStudySession = useCallback(
    (s: Omit<StudySession, 'id'>) =>
      setState((prev) => ({
        ...prev,
        studySessions: [{ ...s, id: uid() }, ...prev.studySessions],
      })),
    [setState],
  );

  const deleteStudySession = useCallback(
    (id: string) =>
      setState((prev) => ({
        ...prev,
        studySessions: prev.studySessions.filter((s) => s.id !== id),
      })),
    [setState],
  );

  const exportData = useCallback(() => {
    return JSON.stringify(sanitizeState(rawState), null, 2);
  }, [rawState]);

  const importData = useCallback(
    (jsonString: string): ValidationResult => {
      try {
        const parsed = JSON.parse(jsonString);
        const result = validateImportedData(parsed);
        if (result.valid && result.data) {
          setRawState(result.data);
        }
        return result;
      } catch {
        return {
          valid: false,
          errors: ['El archivo no es un JSON válido. Verifica que el archivo sea correcto.'],
          data: null,
        };
      }
    },
    [setRawState],
  );

  const resetAll = useCallback(() => {
    setRawState(structuredClone(initialData));
  }, [setRawState]);

  const value: AppContextValue = {
    ...state,
    updateSettings,
    setWeeklyGoalHours,
    addCourse,
    updateCourse,
    deleteCourse,
    archiveCourse,
    unarchiveCourse,
    moveCourseToCycle,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    togglePrerequisite,
    addAttempt,
    deleteAttempt,
    addCycle,
    updateCycle,
    deleteCycle,
    reorderCycles,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addStudySession,
    deleteStudySession,
    exportData,
    importData,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
