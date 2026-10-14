import { useApp } from '@/context/AppContext';
import { calculateGrades } from '@/utils/grades';
import { daysUntil, formatDate, isThisWeek } from '@/utils/dates';
import { ProgressBar } from '@/components/ProgressBar';
import { TrendingUp, BookOpen, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import type { PageId } from '@/components/Layout';

export function InicioPage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const { settings, courses, tasks, studySessions, weeklyGoalHours } = useApp();

  const activeCourses = courses.filter((c) => c.status === 'en_curso');
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const upcomingTasks = [...pendingTasks]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const weekSessions = studySessions.filter((s) => isThisWeek(s.date));
  const weekHours = weekSessions.reduce((sum, s) => sum + s.hours, 0);

  const upcomingExams = courses
    .filter((c) => c.status === 'en_curso')
    .flatMap((c) =>
      c.assessments
        .filter((a) => a.grade === null)
        .map((a) => ({ courseName: c.name, assessmentName: a.name, courseId: c.id })),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Panel de control</h1>
        <p className="text-slate-500 mt-1">
          {settings.name} · {settings.career} · Ciclo {settings.currentCycle}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen size={20} />}
          label="Cursos en curso"
          value={activeCourses.length.toString()}
          color="bg-sky-50 text-sky-600"
        />
        <StatCard
          icon={<CheckSquare size={20} />}
          label="Tareas pendientes"
          value={pendingTasks.length.toString()}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Horas esta semana"
          value={weekHours.toFixed(1)}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Tareas completadas"
          value={completedTasks.length.toString()}
          color="bg-violet-50 text-violet-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cursos en curso */}
        <Card>
          <CardHeader title="Cursos en curso" onAction={() => onNavigate('ciclo')} actionLabel="Ver todos" />
          <div className="space-y-3">
            {activeCourses.length === 0 && (
              <p className="text-slate-400 text-sm">No tienes cursos en curso.</p>
            )}
            {activeCourses.map((course) => {
              const calc = calculateGrades(course, settings.gradingScale);
              return (
                <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">{course.name}</p>
                    <p className="text-xs text-slate-400">{course.credits} créditos</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-slate-700">
                      {calc.currentAverage !== null ? calc.currentAverage.toFixed(1) : '—'}
                      <span className="text-slate-400 font-normal"> / {settings.gradingScale}</span>
                    </p>
                    <p className="text-xs text-slate-400">{calc.evaluatedPercentage.toFixed(0)}% evaluado</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Próximas tareas */}
        <Card>
          <CardHeader title="Próximas tareas" onAction={() => onNavigate('tareas')} actionLabel="Ver todas" />
          <div className="space-y-3">
            {upcomingTasks.length === 0 && (
              <p className="text-slate-400 text-sm">No tienes tareas pendientes.</p>
            )}
            {upcomingTasks.map((task) => {
              const days = daysUntil(task.dueDate);
              const course = courses.find((c) => c.id === task.courseId);
              return (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority === 'alta'
                        ? 'bg-red-500'
                        : task.priority === 'media'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-700 text-sm truncate">{task.title}</p>
                    <p className="text-xs text-slate-400">
                      {course?.name ?? 'Sin curso'} · {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium flex-shrink-0 ${
                      days < 0
                        ? 'text-red-600'
                        : days <= 2
                          ? 'text-amber-600'
                          : 'text-slate-400'
                    }`}
                  >
                    {days < 0 ? 'Vencida' : days === 0 ? 'Hoy' : `${days}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Objetivo semanal */}
        <Card>
          <CardHeader title="Objetivo semanal de estudio" onAction={() => onNavigate('tareas')} actionLabel="Gestionar" />
          <div className="space-y-4">
            <ProgressBar
              value={weekHours}
              max={weeklyGoalHours}
              color={weekHours >= weeklyGoalHours ? 'bg-emerald-500' : 'bg-sky-500'}
              label="Horas de estudio"
            />
            <p className="text-sm text-slate-500">
              {weekHours >= weeklyGoalHours
                ? `Has alcanzado tu objetivo de ${weeklyGoalHours} horas.`
                : `Te faltan ${(weeklyGoalHours - weekHours).toFixed(1)} horas para tu objetivo.`}
            </p>
          </div>
        </Card>

        {/* Evaluaciones pendientes */}
        <Card>
          <CardHeader title="Evaluaciones pendientes" onAction={() => onNavigate('evaluaciones')} actionLabel="Ver" />
          <div className="space-y-3">
            {upcomingExams.length === 0 && (
              <p className="text-slate-400 text-sm">No tienes evaluaciones pendientes.</p>
            )}
            {upcomingExams.map((exam, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-slate-700 text-sm truncate">{exam.assessmentName}</p>
                  <p className="text-xs text-slate-400">{exam.courseName}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border border-slate-200 p-5">{children}</div>;
}

function CardHeader({ title, onAction, actionLabel }: { title: string; onAction?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold text-slate-800">{title}</h2>
      {onAction && actionLabel && (
        <button onClick={onAction} className="text-sm text-sky-600 hover:text-sky-700 font-medium">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
