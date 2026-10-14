import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/Modal';
import { Field, inputClass, buttonPrimary, buttonDanger } from '@/components/ui';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import type { Course, CourseStatus } from '@/types';

const statusLabels: Record<CourseStatus, string> = {
  en_curso: 'En curso',
  aprobado: 'Aprobado',
  pendiente: 'Pendiente',
  retirado: 'Retirado',
};

const statusColors: Record<CourseStatus, string> = {
  en_curso: 'bg-sky-100 text-sky-700',
  aprobado: 'bg-emerald-100 text-emerald-700',
  pendiente: 'bg-amber-100 text-amber-700',
  retirado: 'bg-slate-200 text-slate-600',
};

export function CicloPage() {
  const { courses, addCourse, updateCourse, deleteCourse, settings, cycles } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    credits: 3,
    schedule: '',
    professor: '',
    status: 'en_curso' as CourseStatus,
    cycleId: null as string | null,
  });

  const openCreate = () => {
    setForm({ name: '', code: '', credits: 3, schedule: '', professor: '', status: 'en_curso', cycleId: null });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setForm({
      name: c.name,
      code: c.code,
      credits: c.credits,
      schedule: c.schedule,
      professor: c.professor,
      status: c.status,
      cycleId: c.cycleId,
    });
    setEditingId(c.id);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateCourse(editingId, form);
    } else {
      addCourse(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mi Ciclo {settings.currentCycle}</h1>
          <p className="text-slate-500 mt-1">Gestiona tus cursos del ciclo actual</p>
        </div>
        <button onClick={openCreate} className={buttonPrimary + ' flex items-center gap-2'}>
          <Plus size={16} /> Nuevo curso
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-sky-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{course.name}</h3>
                  {course.code && <p className="text-xs text-slate-400">{course.code}</p>}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[course.status]}`}>
                {statusLabels[course.status]}
              </span>
            </div>

            <div className="text-sm space-y-1 text-slate-500 flex-1">
              <p><span className="text-slate-400">Créditos:</span> {course.credits}</p>
              {course.schedule && <p><span className="text-slate-400">Horario:</span> {course.schedule}</p>}
              {course.professor && <p><span className="text-slate-400">Profesor:</span> {course.professor}</p>}
              <p><span className="text-slate-400">Evaluaciones:</span> {course.assessments.length}</p>
              {course.cycleId && <p><span className="text-slate-400">Ciclo:</span> {cycles.find((c) => c.id === course.cycleId)?.name}</p>}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <button onClick={() => openEdit(course)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600">
                <Edit2 size={15} /> Editar
              </button>
              <button
                onClick={() => setConfirmDelete(course.id)}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 ml-auto"
              >
                <Trash2 size={15} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No tienes cursos registrados.</p>
        </div>
      )}

      {/* Modal create/edit */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar curso' : 'Nuevo curso'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre del curso">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Cálculo I" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Código (opcional)">
              <input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ej. MA101" />
            </Field>
            <Field label="Créditos">
              <input type="number" min={0} max={10} className={inputClass} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Ciclo académico">
            <select className={inputClass} value={form.cycleId ?? ''} onChange={(e) => setForm({ ...form, cycleId: e.target.value || null })}>
              <option value="">Sin ciclo</option>
              {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Horario (opcional)">
            <input className={inputClass} value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Ej. Lun y Mié 10:00-12:00" />
          </Field>
          <Field label="Profesor (opcional)">
            <input className={inputClass} value={form.professor} onChange={(e) => setForm({ ...form, professor: e.target.value })} placeholder="Nombre del profesor" />
          </Field>
          <Field label="Estado">
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })}>
              <option value="pendiente">Pendiente</option>
              <option value="en_curso">En curso</option>
              <option value="aprobado">Aprobado</option>
              <option value="retirado">Retirado</option>
            </select>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancelar</button>
            <button type="submit" className={buttonPrimary}>{editingId ? 'Guardar cambios' : 'Crear curso'}</button>
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Eliminar curso" maxWidth="max-w-sm">
        <p className="text-slate-600 text-sm mb-5">
          ¿Seguro que quieres eliminar este curso? También se eliminarán las tareas y evaluaciones asociadas.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
          <button
            onClick={() => {
              if (confirmDelete) deleteCourse(confirmDelete);
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
