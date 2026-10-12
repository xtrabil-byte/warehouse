import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

let server: Server;
let base: string;

beforeAll(async () => {
  server = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('WORKFLOW API', () => {
  it('GET /health returns ok', async () => {
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('POST /tasks creates a task and GET /tasks lists it', async () => {
    const created = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tulis laporan', priority: 'high' }),
    });
    expect(created.status).toBe(201);

    const list = await (await fetch(`${base}/tasks`)).json();
    expect(list.data).toHaveLength(1);
    expect(list.data[0]).toMatchObject({ title: 'Tulis laporan', priority: 'high', done: false });
  });

  it('POST /tasks rejects an empty title', async () => {
    const res = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    });
    expect(res.status).toBe(422);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await fetch(`${base}/nope`);
    expect(res.status).toBe(404);
  });
});
