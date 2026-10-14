import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/Modal';
import { Field, inputClass, buttonPrimary, buttonDanger, buttonSecondary } from '@/components/ui';
import { validateImportedData, type ValidationResult } from '@/utils/validation';
import { Save, RotateCcw, Check, Download, Upload, AlertTriangle } from 'lucide-react';

export function ConfiguracionPage() {
  const { settings, updateSettings, resetAll, exportData, importData } = useApp();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importPreview, setImportPreview] = useState<{ result: ValidationResult; json: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `campusflow-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? '';
      let result: ValidationResult;
      try {
        const parsed = JSON.parse(text);
        result = validateImportedData(parsed);
      } catch {
        result = { valid: false, errors: ['El archivo no es un JSON válido. Verifica que el archivo sea correcto.'], data: null };
      }
      setImportPreview({ result, json: text });
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = () => {
    if (importPreview?.result.valid && importPreview.json) {
      const result = importData(importPreview.json);
      if (result.valid && result.data) {
        setForm(result.data.settings);
      }
    }
    setImportPreview(null);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
        <p className="text-slate-500 mt-1">Personaliza tu perfil y preferencias académicas</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-slate-800 mb-4">Perfil</h2>
          <div className="space-y-4">
            <Field label="Nombre">
              <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Carrera">
                <input className={inputClass} value={form.career} onChange={(e) => setForm({ ...form, career: e.target.value })} />
              </Field>
              <Field label="Universidad">
                <input className={inputClass} value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
              </Field>
            </div>
            <Field label="Ciclo actual">
              <input className={inputClass} value={form.currentCycle} onChange={(e) => setForm({ ...form, currentCycle: e.target.value })} placeholder="Ej. 2026-II" />
            </Field>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h2 className="font-semibold text-slate-800 mb-4">Escala de notas</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Escala máxima" hint="Nota máxima posible (ej. 20 en Perú)">
              <input
                type="number"
                min={1}
                max={100}
                className={inputClass}
                value={form.gradingScale}
                onChange={(e) => setForm({ ...form, gradingScale: Math.max(1, Number(e.target.value)) })}
              />
            </Field>
            <Field label="Nota mínima aprobatoria" hint="Nota mínima para aprobar (ej. 11)">
              <input
                type="number"
                min={0}
                max={form.gradingScale}
                className={inputClass}
                value={form.passingGrade}
                onChange={(e) => setForm({ ...form, passingGrade: Math.min(form.gradingScale, Math.max(0, Number(e.target.value))) })}
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className={buttonPrimary + ' flex items-center gap-2'}>
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* Backup section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-2">Copia de seguridad</h2>
        <p className="text-sm text-slate-500 mb-4">
          Exporta tus datos a un archivo o importa una copia de seguridad anterior. La importación valida el archivo antes de reemplazar tus datos.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className={buttonSecondary + ' flex items-center gap-2'}>
            <Download size={16} /> Exportar datos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button onClick={() => fileInputRef.current?.click()} className={buttonSecondary + ' flex items-center gap-2'}>
            <Upload size={16} /> Importar copia
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-semibold text-red-700 mb-2">Restablecer datos</h2>
        <p className="text-sm text-slate-500 mb-4">
          Elimina todos tus cursos, tareas, evaluaciones y sesiones de estudio. Los datos volverán a la configuración inicial.
        </p>
        <button onClick={() => setConfirmReset(true)} className={buttonDanger + ' flex items-center gap-2'}>
          <RotateCcw size={15} /> Restablecer todo
        </button>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Restablecer datos" maxWidth="max-w-sm">
        <p className="text-slate-600 text-sm mb-5">
          Esta acción eliminará permanentemente todos tus datos y no se puede deshacer. ¿Estás seguro?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmReset(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
          <button
            onClick={() => {
              resetAll();
              setConfirmReset(false);
              setForm({
                name: 'Estudiante',
                career: 'Ingeniería de Software',
                university: 'Universidad ESAN',
                currentCycle: '2026-II',
                gradingScale: 20,
                passingGrade: 11,
              });
            }}
            className={buttonDanger}
          >
            Sí, restablecer
          </button>
        </div>
      </Modal>

      {/* Import preview modal */}
      <Modal
        open={importPreview !== null}
        onClose={() => setImportPreview(null)}
        title="Importar copia de seguridad"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {importPreview?.result.valid ? (
            <>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <Check size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-700">
                  <p className="font-medium">Archivo válido</p>
                  {importPreview.result.data && (
                    <ul className="mt-1 space-y-0.5 text-emerald-600">
                      <li>{importPreview.result.data.courses.length} cursos</li>
                      <li>{importPreview.result.data.tasks.length} tareas</li>
                      <li>{importPreview.result.data.studySessions.length} sesiones de estudio</li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Esta acción reemplazará todos tus datos actuales. Te recomendamos exportar una copia antes de continuar.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setImportPreview(null)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
                <button onClick={handleConfirmImport} className={buttonPrimary}>Importar y reemplazar</button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">El archivo no es válido</p>
                  <ul className="mt-1 list-disc list-inside space-y-0.5">
                    {importPreview?.result.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={() => setImportPreview(null)} className="px-4 py-2 text-sm text-slate-600">Cerrar</button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
