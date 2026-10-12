import { CreateTaskInputSchema, type Task } from '@workflow/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AddResult = { ok: true } | { ok: false; error: string };

type TaskState = {
  tasks: Task[];
  add: (input: unknown) => AddResult;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clearDone: () => void;
};

export const useTasks = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      add: (input) => {
        const parsed = CreateTaskInputSchema.safeParse(input);
        if (!parsed.success) {
          return { ok: false, error: parsed.error.issues[0]?.message ?? 'Input tidak valid' };
        }
        const task: Task = {
          id: crypto.randomUUID(),
          title: parsed.data.title,
          priority: parsed.data.priority,
          done: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return { ok: true };
      },
      toggle: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      remove: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      clearDone: () => set((s) => ({ tasks: s.tasks.filter((t) => !t.done) })),
    }),
    { name: 'workflow-tasks', storage: createJSONStorage(() => localStorage) },
  ),
);
