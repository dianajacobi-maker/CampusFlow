import { useApp } from '@/context/AppContext';
import { calculateGrades, getCourseFinalGrade } from '@/utils/grades';
import { formatDate, isThisWeek } from '@/utils/dates';
import { ProgressBar } from '@/components/ProgressBar';
import { BookOpen, CheckCircle2, Clock, Award, TrendingUp } from 'lucide-react';

export function RendimientoPage() {
  const { courses, tasks, studySessions, settings } = useApp();

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const totalHours = studySessions.reduce((s, sess) => s + sess.hours, 0);
  const weekHours = studySessions.filter((s) => isThisWeek(s.date)).reduce((s, sess) => s + sess.hours, 0);

  // Per-course grades
  const courseGrades = courses.map((c) => {
    const calc = calculateGrades(c, settings.gradingScale);
    const finalGrade = getCourseFinalGrade(c, settings.gradingScale);
    return {
      ...c,
      currentAverage: calc.currentAverage,
      evaluatedPercentage: calc.evaluatedPercentage,
      finalGrade,
      assessmentCount: c.assessments.length,
      completedAssessments: c.assessments.filter((a) => a.grade !== null).length,
    };
  });

  // Study hours by course
  const hoursByCourse = courses
    .map((c) => ({
      name: c.name,
      hours: studySessions.filter((s) => s.courseId === c.id).reduce((sum, s) => sum + s.hours, 0),
    }))
    .filter((h) => h.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  // Tasks completion rate
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  // Recent study sessions (last 10)
  const recentSessions = [...studySessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Rendimiento</h1>
        <p className="text-slate-500 mt-1">Resumen de tu actividad académica</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={<Award size={18} />} label="Tareas completadas" value={completedTasks.length.toString()} sub={`${pendingTasks.length} pendientes`} color="text-emerald-600 bg-emerald-50" />
        <StatBox icon={<Clock size={18} />} label="Horas totales" value={totalHours.toFixed(1)} sub={`${weekHours.toFixed(1)} esta semana`} color="text-sky-600 bg-sky-50" />
        <StatBox icon={<BookOpen size={18} />} label="Evaluaciones" value={courses.reduce((s, c) => s + c.assessments.filter((a) => a.grade !== null).length, 0).toString()} sub="registradas" color="text-violet-600 bg-violet-50" />
        <StatBox icon={<TrendingUp size={18} />} label="Tasa de cumplimiento" value={`${completionRate.toFixed(0)}%`} sub="de tareas" color="text-amber-600 bg-amber-50" />
      </div>

      {/* Course grades */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Notas por curso</h2>
        <div className="space-y-4">
          {courseGrades.length === 0 && <p className="text-slate-400 text-sm">No hay cursos registrados.</p>}
          {courseGrades.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-700">{c.name}</span>
                  {c.finalGrade !== null && c.finalGrade >= settings.passingGrade && (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-700">
                    {c.currentAverage !== null ? c.currentAverage.toFixed(1) : '—'}
                    <span className="text-slate-400 font-normal text-xs"> / {settings.gradingScale}</span>
                  </span>
                  {c.finalGrade !== null && (
                    <span className="text-xs text-slate-400 ml-2">Final: {c.finalGrade.toFixed(1)}</span>
                  )}
                </div>
              </div>
              <ProgressBar value={c.evaluatedPercentage} max={100} color={c.evaluatedPercentage === 100 ? 'bg-emerald-500' : 'bg-sky-500'} />
              <p className="text-xs text-slate-400 mt-1">
                {c.completedAssessments} de {c.assessmentCount} evaluaciones registradas · {c.evaluatedPercentage.toFixed(0)}% evaluado
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Study hours by course */}
      {hoursByCourse.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Horas de estudio por curso</h2>
          <div className="space-y-3">
            {hoursByCourse.map((h) => {
              const maxHours = hoursByCourse[0].hours;
              const pct = (h.hours / maxHours) * 100;
              return (
                <div key={h.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{h.name}</span>
                    <span className="text-slate-400">{h.hours.toFixed(1)}h</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task completion */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Cumplimiento de tareas</h2>
        <ProgressBar value={completedTasks.length} max={tasks.length || 1} color="bg-emerald-500" label="Completadas" />
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div>
            <p className="text-xl font-bold text-slate-700">{tasks.length}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-600">{completedTasks.length}</p>
            <p className="text-xs text-slate-400">Completadas</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-600">{pendingTasks.length}</p>
            <p className="text-xs text-slate-400">Pendientes</p>
          </div>
        </div>
      </div>

      {/* Recent study sessions */}
      {recentSessions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Sesiones de estudio recientes</h2>
          <div className="space-y-2">
            {recentSessions.map((s) => {
              const course = courses.find((c) => c.id === s.courseId);
              return (
                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 text-sm">
                  <Clock size={15} className="text-slate-400" />
                  <span className="text-slate-600 flex-1">{s.hours}h · {formatDate(s.date)}</span>
                  {course && <span className="text-xs text-slate-400">{course.name}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tasks.length === 0 && studySessions.length === 0 && courses.every((c) => c.assessments.length === 0) && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400 text-sm">
            Aún no tienes datos suficientes. Empieza registrando evaluaciones, tareas y sesiones de estudio.
          </p>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${color}`}>{icon}</div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      <p className="text-xs text-slate-300">{sub}</p>
    </div>
  );
}
