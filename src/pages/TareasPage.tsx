import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/Modal';
import { Field, inputClass, buttonPrimary, buttonDanger } from '@/components/ui';
import { ProgressBar } from '@/components/ProgressBar';
import { Plus, Trash2, Check, Clock, Target } from 'lucide-react';
import { formatDate, daysUntil, isThisWeek, todayISO, getWeekDays } from '@/utils/dates';
import type { Priority } from '@/types';

const priorityLabels: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

const priorityColors: Record<Priority, string> = {
  alta: 'bg-red-100 text-red-700',
  media: 'bg-amber-100 text-amber-700',
  baja: 'bg-slate-100 text-slate-600',
};

export function TareasPage() {
  const { courses, tasks, studySessions, weeklyGoalHours, setWeeklyGoalHours, addTask, deleteTask, toggleTask, addStudySession, deleteStudySession } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const [form, setForm] = useState({
    title: '',
    courseId: '' as string | null,
    dueDate: todayISO(),
    priority: 'media' as Priority,
    estimatedTime: 1,
  });

  const [studyForm, setStudyForm] = useState({
    date: todayISO(),
    hours: 1,
    courseId: '' as string | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      courseId: form.courseId || null,
      dueDate: form.dueDate,
      priority: form.priority,
      estimatedTime: form.estimatedTime,
    });
    setForm({ title: '', courseId: null, dueDate: todayISO(), priority: 'media', estimatedTime: 1 });
    setModalOpen(false);
  };

  const handleStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studyForm.hours <= 0) return;
    addStudySession({
      date: studyForm.date,
      hours: studyForm.hours,
      courseId: studyForm.courseId || null,
    });
    setStudyForm({ date: todayISO(), hours: 1, courseId: null });
    setStudyModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'pending' ? !t.completed : t.completed,
  );
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const weekSessions = studySessions.filter((s) => isThisWeek(s.date));
  const weekHours = weekSessions.reduce((sum, s) => sum + s.hours, 0);
  const weekDays = getWeekDays();
  const hoursByDay = weekDays.map((d) => ({
    ...d,
    hours: studySessions.filter((s) => s.date === d.date).reduce((sum, s) => sum + s.hours, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tareas y Estudio</h1>
        <p className="text-slate-500 mt-1">Gestiona tus tareas y registra tus sesiones de estudio</p>
      </div>

      {/* Weekly study goal */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Target size={18} className="text-sky-600" /> Objetivo semanal
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={80}
              className="w-16 px-2 py-1 rounded border border-slate-300 text-sm text-center"
              value={weeklyGoalHours}
              onChange={(e) => setWeeklyGoalHours(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>
        <ProgressBar value={weekHours} max={weeklyGoalHours} color={weekHours >= weeklyGoalHours ? 'bg-emerald-500' : 'bg-sky-500'} label="Horas de estudio esta semana" />

        {/* Daily breakdown */}
        <div className="grid grid-cols-7 gap-1 mt-4">
          {hoursByDay.map((d) => {
            const maxDayHours = Math.max(...hoursByDay.map((h) => h.hours), 1);
            const h = Math.min(100, (d.hours / maxDayHours) * 100);
            return (
              <div key={d.date} className="text-center">
                <div className="h-20 flex items-end justify-center">
                  <div className="w-6 bg-sky-200 rounded-t" style={{ height: `${d.hours > 0 ? Math.max(8, h) : 2}%` }} title={`${d.hours}h`} />
                </div>
                <p className="text-xs text-slate-400 mt-1 capitalize">{d.label}</p>
                <p className="text-xs font-medium text-slate-600">{d.hours}h</p>
              </div>
            );
          })}
        </div>

        <button onClick={() => setStudyModalOpen(true)} className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1.5">
          <Plus size={15} /> Registrar sesión de estudio
        </button>

        {/* Study sessions list */}
        {weekSessions.length > 0 && (
          <div className="mt-4 space-y-2">
            {weekSessions.map((s) => {
              const course = courses.find((c) => c.id === s.courseId);
              return (
                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 text-sm">
                  <Clock size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 flex-1">
                    {s.hours}h · {formatDate(s.date)} {course ? `· ${course.name}` : ''}
                  </span>
                  <button onClick={() => deleteStudySession(s.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-semibold text-slate-800">Tareas</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {(['pending', 'completed', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    filter === f ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {f === 'pending' ? 'Pendientes' : f === 'completed' ? 'Completadas' : 'Todas'}
                </button>
              ))}
            </div>
            <button onClick={() => setModalOpen(true)} className={buttonPrimary + ' flex items-center gap-1.5'}>
              <Plus size={16} /> Nueva
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {sortedTasks.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">No hay tareas en esta vista.</p>
          )}
          {sortedTasks.map((task) => {
            const course = courses.find((c) => c.id === task.courseId);
            const days = daysUntil(task.dueDate);
            return (
              <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200'}`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-sky-400'
                  }`}
                >
                  {task.completed && <Check size={12} className="text-white" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {course && <span className="text-xs text-slate-400">{course.name}</span>}
                    <span className="text-xs text-slate-400">· {formatDate(task.dueDate)}</span>
                    {!task.completed && (
                      <span className={`text-xs font-medium ${days < 0 ? 'text-red-600' : days <= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {days < 0 ? 'Vencida' : days === 0 ? 'Vence hoy' : `${days} días`}
                      </span>
                    )}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority]}
                    </span>
                    {task.estimatedTime > 0 && <span className="text-xs text-slate-400">· {task.estimatedTime}h est.</span>}
                  </div>
                </div>
                <button onClick={() => setConfirmDelete(task.id)} className="text-slate-300 hover:text-red-500 flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: new task */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva tarea">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Título">
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej. Entregar laboratorio 3" required />
          </Field>
          <Field label="Curso (opcional)">
            <select className={inputClass} value={form.courseId ?? ''} onChange={(e) => setForm({ ...form, courseId: e.target.value || null })}>
              <option value="">Sin curso</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha límite">
              <input type="date" className={inputClass} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
            <Field label="Prioridad">
              <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </Field>
          </div>
          <Field label="Tiempo estimado (horas)">
            <input type="number" min={0} max={40} step={0.5} className={inputClass} value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: Number(e.target.value) })} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
            <button type="submit" className={buttonPrimary}>Crear tarea</button>
          </div>
        </form>
      </Modal>

      {/* Modal: study session */}
      <Modal open={studyModalOpen} onClose={() => setStudyModalOpen(false)} title="Registrar sesión de estudio">
        <form onSubmit={handleStudySubmit} className="space-y-4">
          <Field label="Fecha">
            <input type="date" className={inputClass} value={studyForm.date} onChange={(e) => setStudyForm({ ...studyForm, date: e.target.value })} required />
          </Field>
          <Field label="Horas estudiadas">
            <input type="number" min={0.5} max={24} step={0.5} className={inputClass} value={studyForm.hours} onChange={(e) => setStudyForm({ ...studyForm, hours: Number(e.target.value) })} required />
          </Field>
          <Field label="Curso (opcional)">
            <select className={inputClass} value={studyForm.courseId ?? ''} onChange={(e) => setStudyForm({ ...studyForm, courseId: e.target.value || null })}>
              <option value="">Sin curso específico</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setStudyModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
            <button type="submit" className={buttonPrimary}>Registrar</button>
          </div>
        </form>
      </Modal>

      {/* Confirm delete task */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Eliminar tarea" maxWidth="max-w-sm">
        <p className="text-slate-600 text-sm mb-5">¿Seguro que quieres eliminar esta tarea?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
          <button
            onClick={() => {
              if (confirmDelete) deleteTask(confirmDelete);
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
