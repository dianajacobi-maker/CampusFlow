import type { Course } from '@/types';

export interface GradeCalculation {
  weightedSum: number;
  evaluatedWeight: number;
  pendingWeight: number;
  currentAverage: number | null;
  evaluatedPercentage: number;
  totalWeight: number;
  weightsComplete: boolean;
  minNeededGrade: number | null;
  targetImpossible: boolean;
  targetAchieved: boolean;
  pendingCount: number;
}

export function calculateGrades(course: Course, gradingScale: number): GradeCalculation {
  const assessments = course.assessments;
  const totalWeight = assessments.reduce((s, a) => s + (a.weight || 0), 0);
  const weightsComplete = Math.abs(totalWeight - 100) < 0.01;

  const completed = assessments.filter((a) => a.grade !== null && a.grade !== undefined);
  const pending = assessments.filter((a) => a.grade === null || a.grade === undefined);

  const evaluatedWeight = completed.reduce((s, a) => s + (a.weight || 0), 0);
  const pendingWeight = pending.reduce((s, a) => s + (a.weight || 0), 0);
  const weightedSum = completed.reduce((s, a) => s + (a.weight || 0) * (a.grade as number), 0);

  const currentAverage = evaluatedWeight > 0 ? weightedSum / evaluatedWeight : null;
  const evaluatedPercentage = totalWeight > 0 ? evaluatedWeight / totalWeight * 100 : 0;

  // Calculate minimum needed grade in pending assessments to reach target
  let minNeededGrade: number | null = null;
  let targetImpossible = false;
  let targetAchieved = false;

  const target = course.targetGrade;

  if (pending.length > 0 && pendingWeight > 0) {
    // Target = (weightedSum + pendingWeight * x) / totalWeight
    // x = (target * totalWeight - weightedSum) / pendingWeight
    const needed = (target * totalWeight - weightedSum) / pendingWeight;
    minNeededGrade = Math.round(needed * 100) / 100;

    if (needed > gradingScale) {
      targetImpossible = true;
    }
  } else if (pending.length === 0) {
    // All evaluated
    const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : null;
    targetAchieved = finalGrade !== null && finalGrade >= target;
  } else if (pendingWeight === 0 && pending.length > 0) {
    // Pending assessments with 0 weight - they don't affect the grade
    const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : null;
    targetAchieved = finalGrade !== null && finalGrade >= target;
  }

  return {
    weightedSum,
    evaluatedWeight,
    pendingWeight,
    currentAverage,
    evaluatedPercentage,
    totalWeight,
    weightsComplete,
    minNeededGrade,
    targetImpossible,
    targetAchieved,
    pendingCount: pending.length,
  };
}

export function formatGrade(grade: number | null, scale: number): string {
  if (grade === null || grade === undefined) return '—';
  return grade.toFixed(1) + ' / ' + scale;
}

export function getCourseFinalGrade(course: Course, gradingScale: number): number | null {
  const calc = calculateGrades(course, gradingScale);
  if (calc.pendingCount === 0 && calc.totalWeight > 0 && calc.weightsComplete) {
    return calc.weightedSum / calc.totalWeight;
  }
  if (calc.pendingWeight === 0 && calc.totalWeight > 0) {
    return calc.weightedSum / calc.totalWeight;
  }
  return null;
}
