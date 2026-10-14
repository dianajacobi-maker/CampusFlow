import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Layout, type PageId } from '@/components/Layout';
import { InicioPage } from '@/pages/InicioPage';
import { CicloPage } from '@/pages/CicloPage';
import { EvaluacionesPage } from '@/pages/EvaluacionesPage';
import { TareasPage } from '@/pages/TareasPage';
import { RendimientoPage } from '@/pages/RendimientoPage';
import { ConfiguracionPage } from '@/pages/ConfiguracionPage';
import { MallaPage } from '@/pages/MallaPage';

function App() {
  const [page, setPage] = useState<PageId>('inicio');

  return (
    <AppProvider>
      <Layout currentPage={page} onNavigate={setPage}>
        {page === 'inicio' && <InicioPage onNavigate={setPage} />}
        {page === 'ciclo' && <CicloPage />}
        {page === 'malla' && <MallaPage />}
        {page === 'evaluaciones' && <EvaluacionesPage />}
        {page === 'tareas' && <TareasPage />}
        {page === 'rendimiento' && <RendimientoPage />}
        {page === 'configuracion' && <ConfiguracionPage />}
      </Layout>
    </AppProvider>
  );
}

export default App;
