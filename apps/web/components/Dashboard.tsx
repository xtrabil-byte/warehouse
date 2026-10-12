'use client';

import type { Priority } from '@workflow/types';
import { useEffect, useState, type FormEvent } from 'react';
import { useTasks } from '@/stores/tasks';

const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

export function Dashboard() {
  const { tasks, add, toggle, remove, clearDone } = useTasks();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  // Data tersimpan di localStorage -> render daftar hanya setelah mount
  // supaya HTML statis dan hasil hydrate tidak berbeda.
  useEffect(() => setMounted(true), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = add({ title, priority });
    if (result.ok) {
      setTitle('');
      setError(null);
    } else {
      setError(result.error);
    }
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <section>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah tugas baru…"
          aria-label="Judul tugas"
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Prioritas"
          className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
        >
          <option value="high">Tinggi</option>
          <option value="medium">Sedang</option>
          <option value="low">Rendah</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Tambah
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
        <span>{mounted ? `${doneCount} dari ${tasks.length} selesai` : ' '}</span>
        {mounted && doneCount > 0 && (
          <button onClick={clearDone} className="underline hover:text-slate-800">
            Bersihkan yang selesai
          </button>
        )}
      </div>

      <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {mounted && tasks.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-slate-400">Belum ada tugas.</li>
        )}
        {mounted &&
          tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                aria-label={`Selesai: ${t.title}`}
              />
              <span className={`flex-1 text-sm ${t.done ? 'text-slate-400 line-through' : ''}`}>
                {t.title}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs ${PRIORITY_STYLE[t.priority]}`}>
                {t.priority}
              </span>
              <button
                onClick={() => remove(t.id)}
                aria-label={`Hapus: ${t.title}`}
                className="text-slate-400 hover:text-red-600"
              >
                ✕
              </button>
            </li>
          ))}
      </ul>
    </section>
  );
}
