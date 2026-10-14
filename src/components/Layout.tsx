import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  CheckSquare,
  TrendingUp,
  Settings as SettingsIcon,
  Menu,
  GraduationCap,
  Network,
} from 'lucide-react';

export type PageId = 'inicio' | 'ciclo' | 'evaluaciones' | 'tareas' | 'rendimiento' | 'configuracion' | 'malla';

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
  { id: 'ciclo', label: 'Mi Ciclo', icon: BookOpen },
  { id: 'malla', label: 'Malla Curricular', icon: Network },
  { id: 'evaluaciones', label: 'Evaluaciones', icon: Calculator },
  { id: 'tareas', label: 'Tareas y Estudio', icon: CheckSquare },
  { id: 'rendimiento', label: 'Rendimiento', icon: TrendingUp },
  { id: 'configuracion', label: 'Configuración', icon: SettingsIcon },
];

interface LayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 flex-col z-30">
        <SidebarContent currentPage={currentPage} onNavigate={handleNavigate} />
      </aside>

      {/* Sidebar - Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col">
            <SidebarContent currentPage={currentPage} onNavigate={handleNavigate} />
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 flex items-center px-4 z-20">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-slate-200 hover:text-white"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <GraduationCap size={20} className="text-sky-400" />
          <span className="font-semibold text-slate-100">CampusFlow</span>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <main className="p-4 lg:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  currentPage,
  onNavigate,
}: {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center">
            <GraduationCap size={22} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-slate-100 font-bold text-lg leading-tight">CampusFlow</h1>
            <p className="text-slate-400 text-xs">ESAN</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-slate-700/50">
        <p className="text-slate-500 text-xs px-2 mb-1">Eslogan</p>
        <p className="text-slate-300 text-sm px-2 italic">"El mapa inteligente de tu carrera."</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-sky-500/15 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700/50">
        <p className="text-slate-600 text-xs">CampusFlow ESAN v1.0</p>
      </div>
    </>
  );
}

export { navItems };
