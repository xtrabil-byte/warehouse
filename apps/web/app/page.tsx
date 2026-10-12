import { ApiStatus } from '@/components/ApiStatus';
import { Dashboard } from '@/components/Dashboard';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">WORKFLOW</h1>
          <p className="text-sm text-slate-500">Asisten produktivitas kerja pribadi</p>
        </div>
        <ApiStatus />
      </header>
      <Dashboard />
    </main>
  );
}
