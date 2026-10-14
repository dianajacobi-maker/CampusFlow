import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/Modal';
import { Field, inputClass, buttonPrimary, buttonDanger, buttonSecondary } from '@/components/ui';
import { ProgressBar } from '@/components/ProgressBar';
import {
  calculateMallaStats,
  getCoursesByCycle,
  detectCircularDependency,
  getPrerequisiteStatus,
  sortCycles,
} from '@/utils/malla';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit2,
  Archive,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Layers,
  Search,
  Network,
  ArrowRightLeft,
} from 'lucide-react';
import type { Course, CourseStatus, Attempt } from '@/types';

const statusLabels: Record<CourseStatus, string> = {
  en_curso: 'En curso',
  aprobado: 'Aprobado',
  pendiente: 'Pendiente',
  retirado: 'Retirado',
};

const statusBadgeColors: Record<CourseStatus, string> = {
  en_curso: 'bg-sky-100 text-sky-700 border-sky-200',
  aprobado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
  retirado: 'bg-slate-200 text-slate-600 border-slate-300',
};

const statusIcon: Record<CourseStatus, typeof CheckCircle2> = {
  en_curso: Clock,
  aprobado: CheckCircle2,
  pendiente: AlertTriangle,
  retirado: XCircle,
};

type StatusFilter = 'all' | CourseStatus;

export function MallaPage() {
  const {
    courses,
    cycles,
    settings,
    addCourse,
    updateCourse,
    deleteCourse,
    archiveCourse,
    unarchiveCourse,
    moveCourseToCycle,
    addCycle,
    updateCycle,
    deleteCycle,
    reorderCycles,
    togglePrerequisite,
    addAttempt,
    deleteAttempt,
  } = useApp();

  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set(cycles.map((c) => c.id)));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null  );
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [cycleModalOpen, setCycleModalOpen] = useState(false);
  const [cycleForm, setCycleForm] = useState({ name: '', id: null as string | null });

  const stats = useMemo(() => calculateMallaStats(courses), [courses]);
  const sortedCycles = useMemo(() => sortCycles(cycles), [cycles]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (!showArchived && c.archived) return false;
      if (showArchived && !c.archived) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [courses, statusFilter, searchQuery, showArchived]);

  const coursesByCycle = useMemo(() => getCoursesByCycle(filteredCourses, sortedCycles), [filteredCourses, sortedCycles]);

  const toggleCycle = (id: string) => {
    setExpandedCycles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCreate = () => {
    setEditingCourse(null);
    setIsCreating(true);
  };

  const openEdit = (course: Course) => {
    setSelectedCourse(null);
    setEditingCourse(course);
    setIsCreating(false);
  };

  const openDetail = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCycleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cycleForm.name.trim()) return;
    if (cycleForm.id) {
      updateCycle(cycleForm.id, { name: cycleForm.name.trim() });
    } else {
      addCycle(cycleForm.name.trim());
    }
    setCycleForm({ name: '', id: null });
    setCycleModalOpen(false);
  };

  const moveCycle = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sortedCycles.length) return;
    const ids = sortedCycles.map((c) => c.id);
    [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
    reorderCycles(ids);
  };

  const unassignedCourses = coursesByCycle['__unassigned'] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Network size={26} className="text-sky-600" /> Malla Curricular
          </h1>
          <p className="text-slate-500 mt-1">Plan de estudios organizado por ciclos académicos</p>
        </div>
        <button onClick={openCreate} className={buttonPrimary + ' flex items-center gap-2'}>
          <Plus size={16} /> Nueva asignatura
        </button>
      </div>

      {/* Stats panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Layers size={18} className="text-sky-600" /> Resumen de carrera
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatChip icon={<CheckCircle2 size={16} />} label="Aprobadas" value={stats.approvedCount} color="text-emerald-600 bg-emerald-50" />
          <StatChip icon={<Clock size={16} />} label="En curso" value={stats.inProgressCount} color="text-sky-600 bg-sky-50" />
          <StatChip icon={<AlertTriangle size={16} />} label="Pendientes" value={stats.pendingCount} color="text-amber-600 bg-amber-50" />
          <StatChip icon={<XCircle size={16} />} label="Retiradas" value={stats.retiredCount} color="text-slate-500 bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <CreditBox label="Créditos aprobados" value={stats.approvedCredits} color="text-emerald-600" />
          <CreditBox label="Créditos en curso" value={stats.inProgressCredits} color="text-sky-600" />
          <CreditBox label="Créditos pendientes" value={stats.pendingCredits} color="text-amber-600" />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          {stats.mallaIncomplete ? (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                Malla incompleta: registra los cursos y créditos para calcular el avance.
              </p>
            </div>
          ) : (
            <>
              <ProgressBar value={stats.progressPercentage ?? 0} max={100} color="bg-emerald-500" label="Avance académico" />
              <p className="text-xs text-slate-400 mt-2">
                {stats.approvedCredits} de {stats.totalCurricularCredits} créditos curriculares ({stats.progressPercentage}%)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Buscar por nombre o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">Todos los estados</option>
          <option value="en_curso">En curso</option>
          <option value="aprobado">Aprobado</option>
          <option value="pendiente">Pendiente</option>
          <option value="retirado">Retirado</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="rounded" />
          Ver archivadas
        </label>
        <button onClick={() => { setCycleForm({ name: '', id: null }); setCycleModalOpen(true); }} className={buttonSecondary + ' flex items-center gap-1.5 ml-auto'}>
          <Plus size={15} /> Nuevo ciclo
        </button>
      </div>

      {/* Cycles with course blocks */}
      <div className="space-y-4">
        {sortedCycles.map((cycle, index) => {
          const cycleCourses = coursesByCycle[cycle.id] ?? [];
          const expanded = expandedCycles.has(cycle.id);
          return (
            <div key={cycle.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                <button onClick={() => toggleCycle(cycle.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                  {expanded ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
                  <h3 className="font-semibold text-slate-700 truncate">{cycle.name}</h3>
                  <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{cycleCourses.length}</span>
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveCycle(index, -1)} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30" aria-label="Mover arriba">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => moveCycle(index, 1)} disabled={index === sortedCycles.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30" aria-label="Mover abajo">
                    <ChevronRight size={16} />
                  </button>
                  <button onClick={() => { setCycleForm({ name: cycle.name, id: cycle.id }); setCycleModalOpen(true); }} className="p-1 text-slate-400 hover:text-sky-600" aria-label="Editar ciclo">
                    <Edit2 size={14} />
                  </button>
                  {cycles.length > 1 && (
                    <button onClick={() => deleteCycle(cycle.id)} className="p-1 text-slate-400 hover:text-red-500" aria-label="Eliminar ciclo">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {expanded && (
                <div className="p-4">
                  {cycleCourses.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No hay asignaturas en este ciclo.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cycleCourses.map((course) => (
                        <CourseBlock key={course.id} course={course} courses={courses} settings={settings} onClick={() => openDetail(course)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Unassigned courses */}
        {unassignedCourses.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
              <button onClick={() => toggleCycle('__unassigned')} className="flex items-center gap-2 text-left">
                {expandedCycles.has('__unassigned') ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                <h3 className="font-semibold text-slate-700">Sin ciclo asignado</h3>
                <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{unassignedCourses.length}</span>
              </button>
            </div>
            {expandedCycles.has('__unassigned') && (
              <div className="p-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unassignedCourses.map((course) => (
                    <CourseBlock key={course.id} course={course} courses={courses} settings={settings} onClick={() => openDetail(course)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {filteredCourses.length === 0 && !showArchived && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <Network size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'No se encontraron asignaturas con los filtros actuales.'
                : 'No tienes asignaturas en la malla. Crea tu primera asignatura o asigna un ciclo a tus cursos existentes.'}
            </p>
          </div>
        )}
      </div>

      {/* Detail panel */}
      <CourseDetailModal
        course={selectedCourse}
        courses={courses}
        settings={settings}
        onClose={() => setSelectedCourse(null)}
        onEdit={(c) => openEdit(c)}
        onArchive={(id) => { archiveCourse(id); setSelectedCourse(null); }}
        onUnarchive={(id) => { unarchiveCourse(id); setSelectedCourse(null); }}
        onDelete={(id) => { setConfirmDelete(id); setSelectedCourse(null); }}
        onTogglePrereq={togglePrerequisite}
        onMoveCycle={moveCourseToCycle}
        cycles={sortedCycles}
        onAddAttempt={addAttempt}
        onDeleteAttempt={deleteAttempt}
      />

      {/* Edit/Create modal */}
      <CourseEditModal
        course={editingCourse}
        isCreating={isCreating}
        cycles={sortedCycles}
        settings={settings}
        onClose={() => { setEditingCourse(null); setIsCreating(false); }}
        onSave={(data) => {
          if (editingCourse) {
            updateCourse(editingCourse.id, data);
          } else {
            addCourse(data);
          }
          setEditingCourse(null);
          setIsCreating(false);
        }}
      />

      {/* Cycle modal */}
      <Modal open={cycleModalOpen} onClose={() => setCycleModalOpen(false)} title={cycleForm.id ? 'Editar ciclo' : 'Nuevo ciclo'} maxWidth="max-w-sm">
        <form onSubmit={handleCycleSubmit} className="space-y-4">
          <Field label="Nombre del ciclo">
            <input className={inputClass} value={cycleForm.name} onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })} placeholder="Ej. Ciclo 2027-I" required autoFocus />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCycleModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
            <button type="submit" className={buttonPrimary}>{cycleForm.id ? 'Guardar' : 'Crear'}</button>
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Eliminar asignatura" maxWidth="max-w-md">
        <DeleteWarning courseId={confirmDelete} courses={courses} onConfirm={(id) => { deleteCourse(id); setConfirmDelete(null); }} onCancel={() => setConfirmDelete(null)} />
      </Modal>
    </div>
  );
}

// --- Course Block ---
function CourseBlock({ course, courses, settings, onClick }: { course: Course; courses: Course[]; settings: { gradingScale: number; passingGrade: number }; onClick: () => void }) {
  const Icon = statusIcon[course.status];
  const hasUnapprovedPrereqs = course.prerequisiteIds.some((pid) => {
    const p = courses.find((c) => c.id === pid);
    return p && p.status !== 'aprobado';
  });

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-lg border border-slate-200 p-4 hover:border-sky-300 hover:shadow-sm transition-all flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm text-slate-800 truncate">{course.name}</h4>
          {course.code && <p className="text-xs text-slate-400 mt-0.5">{course.code}</p>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${statusBadgeColors[course.status]}`}>
          {statusLabels[course.status]}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><BookOpen size={12} /> {course.credits} cr.</span>
        {course.finalGrade !== null && (
          <span className="flex items-center gap-1">
            <Award size={12} /> {course.finalGrade.toFixed(1)}/{settings.gradingScale}
          </span>
        )}
        {course.prerequisiteIds.length > 0 && (
          <span className={`flex items-center gap-1 ${hasUnapprovedPrereqs ? 'text-amber-600' : 'text-emerald-600'}`}>
            <Layers size={12} /> {course.prerequisiteIds.length} req.
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <Icon size={12} className="text-slate-400" />
        <span className="text-slate-500">{statusLabels[course.status]}</span>
      </div>
    </button>
  );
}

// --- Course Detail Modal ---
function CourseDetailModal({
  course,
  courses,
  settings,
  onClose,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onTogglePrereq,
  onMoveCycle,
  cycles,
  onAddAttempt,
  onDeleteAttempt,
}: {
  course: Course | null;
  courses: Course[];
  settings: { gradingScale: number; passingGrade: number };
  onClose: () => void;
  onEdit: (c: Course) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePrereq: (courseId: string, prereqId: string) => void;
  onMoveCycle: (courseId: string, cycleId: string | null) => void;
  cycles: { id: string; name: string; order: number }[];
  onAddAttempt: (courseId: string, a: Omit<Attempt, 'id'>) => void;
  onDeleteAttempt: (courseId: string, attemptId: string) => void;
}) {
  const [showPrereqEditor, setShowPrereqEditor] = useState(false);
  const [showAttemptForm, setShowAttemptForm] = useState(false);
  const [attemptForm, setAttemptForm] = useState({
    period: '',
    status: 'pendiente' as CourseStatus,
    finalGrade: '',
    credits: 3,
    observations: '',
  });

  if (!course) return null;

  // Get fresh course data from courses array
  const current = courses.find((c) => c.id === course.id) ?? course;

  const handleAttemptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grade = attemptForm.finalGrade === '' ? null : Math.max(0, Math.min(settings.gradingScale, Number(attemptForm.finalGrade)));
    onAddAttempt(current.id, {
      period: attemptForm.period,
      status: attemptForm.status,
      finalGrade: grade,
      credits: Math.max(0, attemptForm.credits),
      observations: attemptForm.observations,
    });
    setAttemptForm({ period: '', status: 'pendiente', finalGrade: '', credits: 3, observations: '' });
    setShowAttemptForm(false);
  };

  const prereqStatuses = current.prerequisiteIds.map((pid) => ({
    id: pid,
    ...getPrerequisiteStatus(courses, pid),
  }));

  return (
    <Modal open={course !== null} onClose={onClose} title={current.name} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Status badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadgeColors[current.status]}`}>
            {statusLabels[current.status]}
          </span>
          {current.archived && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-medium">
              Archivada
            </span>
          )}
          {current.code && <span className="text-xs text-slate-400">Código: {current.code}</span>}
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Créditos" value={current.credits.toString()} />
          <InfoRow label="Ciclo" value={cycles.find((c) => c.id === current.cycleId)?.name ?? 'Sin asignar'} />
          <InfoRow label="Nota final" value={current.finalGrade !== null ? `${current.finalGrade.toFixed(1)} / ${settings.gradingScale}` : 'No registrada'} />
          <InfoRow label="Escala" value={`0 - ${settings.gradingScale}`} />
          {current.schedule && <InfoRow label="Horario" value={current.schedule} />}
          {current.professor && <InfoRow label="Profesor" value={current.professor} />}
          <InfoRow label="Evaluaciones" value={current.assessments.length.toString()} />
          <InfoRow label="Prerrequisitos" value={current.prerequisiteIds.length.toString()} />
        </div>

        {current.observations && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase mb-1">Observaciones</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{current.observations}</p>
          </div>
        )}

        {/* Move to cycle */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase mb-2">Cambiar de ciclo</p>
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={15} className="text-slate-400" />
            <select
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={current.cycleId ?? ''}
              onChange={(e) => onMoveCycle(current.id, e.target.value || null)}
            >
              <option value="">Sin ciclo</option>
              {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-400 uppercase">Prerrequisitos</p>
            <button onClick={() => setShowPrereqEditor(!showPrereqEditor)} className="text-xs text-sky-600 hover:text-sky-700 font-medium">
              {showPrereqEditor ? 'Cerrar' : 'Editar'}
            </button>
          </div>
          {prereqStatuses.length > 0 ? (
            <div className="space-y-2">
              {prereqStatuses.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-sm">
                  {p.status === 'aprobado' ? (
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                  ) : p.status === 'no_verificado' ? (
                    <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                  ) : (
                    <Clock size={15} className="text-amber-500 flex-shrink-0" />
                  )}
                  <span className="flex-1 text-slate-600">{p.name}</span>
                  <span className="text-xs text-slate-400">{statusLabels[p.status as CourseStatus] ?? 'No verificado'}</span>
                </div>
              ))}
              {prereqStatuses.some((p) => p.status !== 'aprobado') && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Tienes prerrequisitos que aún no están aprobados. Verifica tu plan de estudios antes de llevar este curso.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Sin prerrequisitos configurados.</p>
          )}

          {showPrereqEditor && (
            <div className="mt-3 border border-slate-200 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
              {courses.filter((c) => c.id !== current.id && !c.archived).map((c) => {
                const selected = current.prerequisiteIds.includes(c.id);
                const wouldCreateCycle = detectCircularDependency(courses, current.id, c.id);
                return (
                  <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={wouldCreateCycle && !selected}
                      onChange={() => onTogglePrereq(current.id, c.id)}
                      className="rounded"
                    />
                    <span className={wouldCreateCycle && !selected ? 'text-slate-300' : 'text-slate-600'}>
                      {c.name}
                      {wouldCreateCycle && !selected && <span className="text-xs text-red-400 ml-1">(dependencia circular)</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Attempts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-400 uppercase">Historial de intentos</p>
            <button onClick={() => setShowAttemptForm(!showAttemptForm)} className="text-xs text-sky-600 hover:text-sky-700 font-medium">
              {showAttemptForm ? 'Cerrar' : '+ Añadir intento'}
            </button>
          </div>
          {current.attempts.length > 0 ? (
            <div className="space-y-2">
              {current.attempts.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 text-sm">
                  <div className="flex-1">
                    <p className="text-slate-600 font-medium">{a.period || 'Sin periodo'}</p>
                    <p className="text-xs text-slate-400">
                      {statusLabels[a.status]} · {a.credits} cr. · {a.finalGrade !== null ? `Nota: ${a.finalGrade.toFixed(1)}` : 'Sin nota'}
                    </p>
                    {a.observations && <p className="text-xs text-slate-400 mt-0.5">{a.observations}</p>}
                  </div>
                  <button onClick={() => onDeleteAttempt(current.id, a.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No hay intentos registrados.</p>
          )}

          {showAttemptForm && (
            <form onSubmit={handleAttemptSubmit} className="mt-3 border border-slate-200 rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Periodo">
                  <input className={inputClass} value={attemptForm.period} onChange={(e) => setAttemptForm({ ...attemptForm, period: e.target.value })} placeholder="Ej. 2026-II" />
                </Field>
                <Field label="Estado">
                  <select className={inputClass} value={attemptForm.status} onChange={(e) => setAttemptForm({ ...attemptForm, status: e.target.value as CourseStatus })}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En curso</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="retirado">Retirado</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Nota (0-${settings.gradingScale})`} hint="Vacío = sin nota">
                  <input type="number" min={0} max={settings.gradingScale} step={0.5} className={inputClass} value={attemptForm.finalGrade} onChange={(e) => setAttemptForm({ ...attemptForm, finalGrade: e.target.value })} placeholder="Sin nota" />
                </Field>
                <Field label="Créditos">
                  <input type="number" min={0} max={20} className={inputClass} value={attemptForm.credits} onChange={(e) => setAttemptForm({ ...attemptForm, credits: Number(e.target.value) })} />
                </Field>
              </div>
              <Field label="Observaciones">
                <input className={inputClass} value={attemptForm.observations} onChange={(e) => setAttemptForm({ ...attemptForm, observations: e.target.value })} placeholder="Notas sobre este intento" />
              </Field>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAttemptForm(false)} className="px-3 py-1.5 text-sm text-slate-600">Cancelar</button>
                <button type="submit" className={buttonPrimary}>Añadir</button>
              </div>
            </form>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <button onClick={() => onEdit(current)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600">
            <Edit2 size={15} /> Editar
          </button>
          {current.archived ? (
            <button onClick={() => onUnarchive(current.id)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600">
              <Archive size={15} /> Desarchivar
            </button>
          ) : (
            <button onClick={() => onArchive(current.id)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-amber-600">
              <Archive size={15} /> Archivar
            </button>
          )}
          <button onClick={() => onDelete(current.id)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 ml-auto">
            <Trash2 size={15} /> Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- Course Edit/Create Modal ---
function CourseEditModal({
  course,
  isCreating,
  cycles,
  settings,
  onClose,
  onSave,
}: {
  course: Course | null;
  isCreating: boolean;
  cycles: { id: string; name: string; order: number }[];
  settings: { gradingScale: number; passingGrade: number };
  onClose: () => void;
  onSave: (data: Partial<Course>) => void;
}) {
  const [form, setForm] = useState({
    name: course?.name ?? '',
    code: course?.code ?? '',
    credits: course?.credits ?? 3,
    schedule: course?.schedule ?? '',
    professor: course?.professor ?? '',
    status: course?.status ?? 'en_curso' as CourseStatus,
    cycleId: course?.cycleId ?? null as string | null,
    finalGrade: course?.finalGrade !== null && course?.finalGrade !== undefined ? String(course.finalGrade) : '',
    observations: course?.observations ?? '',
  });

  const [statusWarning, setStatusWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const gradeNum = form.finalGrade === '' || isNaN(Number(form.finalGrade)) ? null : Math.max(0, Math.min(settings.gradingScale, Number(form.finalGrade)));
    onSave({
      name: form.name.trim(),
      code: form.code,
      credits: Math.max(0, form.credits),
      schedule: form.schedule,
      professor: form.professor,
      status: form.status,
      cycleId: form.cycleId,
      finalGrade: gradeNum,
      observations: form.observations,
    });
  };

  const handleStatusChange = (newStatus: CourseStatus) => {
    if (course && course.status === 'aprobado' && (newStatus === 'pendiente' || newStatus === 'en_curso')) {
      setStatusWarning(true);
    } else {
      setStatusWarning(false);
    }
    setForm({ ...form, status: newStatus });
  };

  return (
    <Modal open={course !== null || isCreating} onClose={onClose} title={isCreating ? 'Nueva asignatura' : 'Editar asignatura'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre del curso">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Cálculo I" required autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Código (opcional)">
            <input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ej. MA101" />
          </Field>
          <Field label="Créditos">
            <input type="number" min={0} max={20} className={inputClass} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} />
          </Field>
        </div>
        <Field label="Ciclo académico">
          <select className={inputClass} value={form.cycleId ?? ''} onChange={(e) => setForm({ ...form, cycleId: e.target.value || null })}>
            <option value="">Sin ciclo</option>
            {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Horario (opcional)">
            <input className={inputClass} value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Ej. Lun y Mié 10:00-12:00" />
          </Field>
          <Field label="Profesor (opcional)">
            <input className={inputClass} value={form.professor} onChange={(e) => setForm({ ...form, professor: e.target.value })} placeholder="Nombre del profesor" />
          </Field>
        </div>
        <Field label="Estado">
          <select className={inputClass} value={form.status} onChange={(e) => handleStatusChange(e.target.value as CourseStatus)}>
            <option value="pendiente">Pendiente</option>
            <option value="en_curso">En curso</option>
            <option value="aprobado">Aprobado</option>
            <option value="retirado">Retirado</option>
          </select>
        </Field>
        {statusWarning && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              Cambiar un curso aprobado a pendiente o en curso puede afectar las estadísticas de avance.
            </p>
          </div>
        )}
        <Field label={`Nota final (0 - ${settings.gradingScale})`} hint="Vacío = no registrada. No se asigna nota automáticamente.">
          <input
            type="number"
            min={0}
            max={settings.gradingScale}
            step={0.5}
            className={inputClass}
            value={form.finalGrade}
            onChange={(e) => setForm({ ...form, finalGrade: e.target.value })}
            placeholder="No registrada"
          />
        </Field>
        <Field label="Observaciones (opcional)">
          <textarea className={inputClass + ' min-h-[60px] resize-y'} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Notas personales sobre este curso" />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
          <button type="submit" className={buttonPrimary}>{isCreating ? 'Crear asignatura' : 'Guardar cambios'}</button>
        </div>
      </form>
    </Modal>
  );
}

// --- Delete Warning ---
function DeleteWarning({ courseId, courses, onConfirm, onCancel }: { courseId: string | null; courses: Course[]; onConfirm: (id: string) => void; onCancel: () => void }) {
  if (!courseId) return null;
  const course = courses.find((c) => c.id === courseId);
  if (!course) return null;
  const hasAssessments = course.assessments.length > 0;
  const hasAttempts = course.attempts.length > 0;

  return (
    <div className="space-y-4">
      <p className="text-slate-600 text-sm">
        ¿Seguro que quieres eliminar <strong>{course.name}</strong>?
      </p>
      {(hasAssessments || hasAttempts) && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-medium">Se eliminarán permanentemente:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {hasAssessments && <li>{course.assessments.length} evaluaciones registradas</li>}
              {hasAttempts && <li>{course.attempts.length} intentos académicos</li>}
              <li>Las tareas asociadas a este curso</li>
            </ul>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-400">Esta acción no se puede deshacer. Considera archivar la asignatura en su lugar.</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
        <button onClick={() => onConfirm(courseId)} className={buttonDanger}>Eliminar</button>
      </div>
    </div>
  );
}

// --- Helpers ---
function StatChip({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-lg font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function CreditBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-lg border border-slate-200">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 font-medium">{value}</p>
    </div>
  );
}
