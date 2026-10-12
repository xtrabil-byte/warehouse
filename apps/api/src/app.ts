import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { CreateTaskInputSchema, type Task } from '@workflow/types';

const MAX_BODY_BYTES = 1_000_000;

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('payload_too_large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

export function createApp(options: { corsOrigin?: string } = {}): Server {
  const corsOrigin = options.corsOrigin ?? '*';
  const tasks: Task[] = [];

  const send = (res: ServerResponse, status: number, body: unknown) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(body));
  };

  return createServer(async (req, res) => {
    const { method = 'GET', url = '/' } = req;
    const path = url.split('?')[0];

    if (method === 'OPTIONS') return send(res, 204, {});
    if (method === 'GET' && path === '/health') return send(res, 200, { status: 'ok' });
    if (method === 'GET' && path === '/tasks') return send(res, 200, { data: tasks });

    if (method === 'POST' && path === '/tasks') {
      try {
        const parsed = CreateTaskInputSchema.safeParse(await readJson(req));
        if (!parsed.success) {
          return send(res, 422, { error: 'validation_error', issues: parsed.error.issues });
        }
        const task: Task = {
          id: randomUUID(),
          title: parsed.data.title,
          priority: parsed.data.priority,
          done: false,
          createdAt: new Date().toISOString(),
        };
        tasks.push(task);
        return send(res, 201, { data: task });
      } catch (error) {
        const code = error instanceof Error ? error.message : 'bad_request';
        return send(res, code === 'payload_too_large' ? 413 : 400, { error: code });
      }
    }

    return send(res, 404, { error: 'not_found' });
  });
}
