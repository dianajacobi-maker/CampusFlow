import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateGrades } from '@/utils/grades';
import { Modal } from '@/components/Modal';
import { Field, inputClass, buttonPrimary, buttonDanger } from '@/components/ui';
import { ProgressBar } from '@/components/ProgressBar';
import { Plus, Trash2, AlertTriangle, CheckCircle2, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { Assessment } from '@/types';

export function EvaluacionesPage() {
  const { courses, settings, addAssessment, updateAssessment, deleteAssessment, updateCourse } = useApp();
  const activeCourses = courses.filter((c) => c.status === 'en_curso');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(activeCourses[0]?.id ?? null);
  const [confirmDelete, setConfirmDelete] = useState<{ courseId: string; assessmentId: string } | null>(null);

  const [form, setForm] = useState({ name: '', weight: 10, grade: '' });

  const openCreate = (courseId: string) => {
    setEditingCourseId(courseId);
    setForm({ name: '', weight: 10, grade: '' });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId || !form.name.trim()) return;
    const weightNum = isNaN(form.weight) ? 0 : Math.max(0, Math.min(100, form.weight));
    const gradeNum = form.grade === '' || isNaN(Number(form.grade)) ? null : Math.max(0, Math.min(settings.gradingScale, Number(form.grade)));
    addAssessment(editingCourseId, {
      name: form.name.trim(),
      weight: weightNum,
      grade: gradeNum,
    });
    setModalOpen(false);
  };

  const handleGradeChange = (courseId: string, assessmentId: string, value: string) => {
    const gradeNum = value === '' || isNaN(Number(value)) ? null : Math.max(0, Math.min(settings.gradingScale, Number(value)));
    updateAssessment(courseId, assessmentId, { grade: gradeNum });
  };

  const handleWeightChange = (courseId: string, assessmentId: string, value: number) => {
    const clamped = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
    updateAssessment(courseId, assessmentId, { weight: clamped });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Evaluaciones y Calculadora</h1>
        <p className="text-slate-500 mt-1">Registra evaluaciones, pesos y notas. Calcula automáticamente tu promedio.</p>
      </div>

      {activeCourses.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400">No tienes cursos en curso. Crea o activa cursos en "Mi Ciclo".</p>
        </div>
      )}

      <div className="space-y-4">
        {activeCourses.map((course) => {
          const calc = calculateGrades(course, settings.gradingScale);
          const expanded = expandedId === course.id;
          return (
            <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Course header */}
              <button
                onClick={() => setExpandedId(expanded ? null : course.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-left min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{course.name}</h3>
                    <p className="text-xs text-slate-400">
                      {course.assessments.length} evaluaciones · {calc.weightsComplete ? 'Pesos completos' : `Pesos: ${calc.totalWeight}%`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">
                      {calc.currentAverage !== null ? calc.currentAverage.toFixed(1) : '—'}
                      <span className="text-slate-400 text-sm font-normal"> / {settings.gradingScale}</span>
                    </p>
                  </div>
                  {expanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </button>

              {expanded && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                  {/* Summary */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <SummaryBox label="Promedio actual" value={calc.currentAverage !== null ? calc.currentAverage.toFixed(2) : '—'} sub={`de ${settings.gradingScale}`} />
                    <SummaryBox label="% evaluado" value={`${calc.evaluatedPercentage.toFixed(0)}%`} sub={`${calc.evaluatedWeight}% de ${calc.totalWeight}%`} />
                    <SummaryBox label="Evaluaciones pendientes" value={calc.pendingCount.toString()} sub={`${calc.pendingWeight}% del peso`} />
                  </div>

                  <ProgressBar value={calc.totalWeight} max={100} color={calc.weightsComplete ? 'bg-emerald-500' : 'bg-amber-500'} label="Suma de pesos" />

                  {/* Target grade */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <Target size={18} className="text-sky-600 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Nota objetivo:</span>
                    <input
                      type="number"
                      min={0}
                      max={settings.gradingScale}
                      step={0.5}
                      className="w-20 px-2 py-1 rounded border border-slate-300 text-sm text-center"
                      value={course.targetGrade}
                      onChange={(e) => updateCourse(course.id, { targetGrade: Math.max(0, Math.min(settings.gradingScale, Number(e.target.value))) })}
                    />
                    <span className="text-sm text-slate-400">/ {settings.gradingScale}</span>
                  </div>

                  {/* Target analysis */}
                  {calc.targetImpossible ? (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">
                        El objetivo de {course.targetGrade} es matemáticamente imposible. Necesitarías más de {settings.gradingScale} en las evaluaciones pendientes.
                      </p>
                    </div>
                  ) : calc.targetAchieved ? (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700">
                        Con las notas actuales ya alcanzas el objetivo de {course.targetGrade}.
                      </p>
                    </div>
                  ) : calc.minNeededGrade !== null ? (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-50 border border-sky-200">
                      <Target size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-sky-700">
                        Necesitas un promedio de <strong>{calc.minNeededGrade.toFixed(2)}</strong> en las {calc.pendingCount} evaluaciones pendientes para alcanzar el objetivo de {course.targetGrade}.
                      </p>
                    </div>
                  ) : null}

                  {!calc.weightsComplete && course.assessments.length > 0 && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Los pesos suman {calc.totalWeight}% y deben sumar 100% para que el cálculo sea completo.
                      </p>
                    </div>
                  )}

                  {/* Assessments table */}
                  {course.assessments.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                            <th className="text-left py-2 px-2 font-medium">Evaluación</th>
                            <th className="text-center py-2 px-2 font-medium w-24">Peso %</th>
                            <th className="text-center py-2 px-2 font-medium w-28">Nota</th>
                            <th className="text-center py-2 px-2 font-medium w-20">Aporte</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.assessments.map((a: Assessment) => (
                            <tr key={a.id} className="border-b border-slate-50">
                              <td className="py-2.5 px-2 text-slate-700">{a.name}</td>
                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={a.weight}
                                  onChange={(e) => handleWeightChange(course.id, a.id, Number(e.target.value))}
                                  className="w-16 px-1 py-1 rounded border border-slate-200 text-center text-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
                                />
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={settings.gradingScale}
                                  step={0.5}
                                  value={a.grade ?? ''}
                                  onChange={(e) => handleGradeChange(course.id, a.id, e.target.value)}
                                  placeholder="—"
                                  className="w-20 px-1 py-1 rounded border border-slate-200 text-center text-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
                                />
                              </td>
                              <td className="py-2.5 px-2 text-center text-slate-500 text-xs">
                                {a.grade !== null ? ((a.weight * a.grade) / 100).toFixed(2) : '—'}
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <button
                                  onClick={() => setConfirmDelete({ courseId: course.id, assessmentId: a.id })}
                                  className="text-slate-300 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <button onClick={() => openCreate(course.id)} className={buttonPrimary + ' flex items-center gap-2'}>
                    <Plus size={16} /> Añadir evaluación
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal add assessment */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva evaluación">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre de la evaluación">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Examen parcial" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Peso (%)" hint="Porcentaje sobre la nota final">
              <input type="number" min={0} max={100} className={inputClass} value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} />
            </Field>
            <Field label={`Nota (0 - ${settings.gradingScale})`} hint="Déjala vacía si es pendiente">
              <input
                type="number"
                min={0}
                max={settings.gradingScale}
                step={0.5}
                className={inputClass}
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="Pendiente"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
            <button type="submit" className={buttonPrimary}>Añadir</button>
          </div>
        </form>
      </Modal>

      {/* Confirm delete assessment */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Eliminar evaluación" maxWidth="max-w-sm">
        <p className="text-slate-600 text-sm mb-5">¿Seguro que quieres eliminar esta evaluación?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
          <button
            onClick={() => {
              if (confirmDelete) deleteAssessment(confirmDelete.courseId, confirmDelete.assessmentId);
              setConfirmDelete(null);
            }}
            className={buttonDanger}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

function SummaryBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-800 mt-0.5">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}
