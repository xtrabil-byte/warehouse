import { z } from 'zod';

export const PrioritySchema = z.enum(['low', 'medium', 'high']);
export type Priority = z.infer<typeof PrioritySchema>;

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Judul tugas wajib diisi').max(200, 'Maksimal 200 karakter'),
  priority: PrioritySchema,
  done: z.boolean(),
  createdAt: z.string().datetime(),
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = z.object({
  title: TaskSchema.shape.title,
  priority: PrioritySchema.default('medium'),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
