import type { Course, Cycle, CourseStatus } from '@/types';

export interface MallaStats {
  approvedCount: number;
  inProgressCount: number;
  pendingCount: number;
  retiredCount: number;
  approvedCredits: number;
  inProgressCredits: number;
  pendingCredits: number;
  totalCurricularCredits: number;
  progressPercentage: number | null;
  mallaIncomplete: boolean;
}

export function calculateMallaStats(courses: Course[]): MallaStats {
  const active = courses.filter((c) => !c.archived);

  const approved = active.filter((c) => c.status === 'aprobado');
  const inProgress = active.filter((c) => c.status === 'en_curso');
  const pending = active.filter((c) => c.status === 'pendiente');
  const retired = active.filter((c) => c.status === 'retirado');

  const approvedCredits = approved.reduce((s, c) => s + (isValidCredits(c.credits) ? c.credits : 0), 0);
  const inProgressCredits = inProgress.reduce((s, c) => s + (isValidCredits(c.credits) ? c.credits : 0), 0);

  // Pending credits: only from courses explicitly in the plan (pending status)
  const pendingCredits = pending.reduce((s, c) => s + (isValidCredits(c.credits) ? c.credits : 0), 0);

  // Total curricular credits = approved + in progress + pending (excludes retired)
  const totalCurricularCredits = approvedCredits + inProgressCredits + pendingCredits;

  // Progress percentage only when we have a complete malla (total > 0)
  const mallaIncomplete = totalCurricularCredits === 0;
  const progressPercentage = mallaIncomplete
    ? null
    : Math.round((approvedCredits / totalCurricularCredits) * 100);

  return {
    approvedCount: approved.length,
    inProgressCount: inProgress.length,
    pendingCount: pending.length,
    retiredCount: retired.length,
    approvedCredits,
    inProgressCredits,
    pendingCredits,
    totalCurricularCredits,
    progressPercentage,
    mallaIncomplete,
  };
}

function isValidCredits(n: number): boolean {
  return typeof n === 'number' && !isNaN(n) && isFinite(n) && n > 0;
}

export function getCoursesByCycle(courses: Course[], cycles: Cycle[]): Record<string, Course[]> {
  const sortedCycles = [...cycles].sort((a, b) => a.order - b.order);
  const map: Record<string, Course[]> = {};
  for (const cy of sortedCycles) {
    map[cy.id] = courses.filter((c) => c.cycleId === cy.id && !c.archived);
  }
  // Courses without cycle
  const unassigned = courses.filter((c) => c.cycleId === null && !c.archived);
  if (unassigned.length > 0) {
    map['__unassigned'] = unassigned;
  }
  return map;
}

export function detectCircularDependency(
  courses: Course[],
  courseId: string,
  newPrereqId: string,
): boolean {
  // Check if adding newPrereqId as prerequisite of courseId creates a cycle
  // A cycle exists if courseId is a direct or transitive prerequisite of newPrereqId
  const visited = new Set<string>();

  function isPrereqOf(target: string, source: string): boolean {
    if (visited.has(source)) return false;
    visited.add(source);
    const sourceCourse = courses.find((c) => c.id === source);
    if (!sourceCourse) return false;
    for (const pid of sourceCourse.prerequisiteIds) {
      if (pid === target) return true;
      if (isPrereqOf(target, pid)) return true;
    }
    return false;
  }

  // If courseId is already a prerequisite (direct or transitive) of newPrereqId, adding creates cycle
  return isPrereqOf(courseId, newPrereqId);
}

export function getPrerequisiteStatus(
  courses: Course[],
  prereqId: string,
): { name: string; status: CourseStatus | 'no_verificado' } {
  const prereq = courses.find((c) => c.id === prereqId);
  if (!prereq) return { name: 'Prerrequisito eliminado', status: 'no_verificado' };
  return { name: prereq.name, status: prereq.status };
}

export function sortCycles(cycles: Cycle[]): Cycle[] {
  return [...cycles].sort((a, b) => a.order - b.order);
}
