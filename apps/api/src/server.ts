import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 4000);
const server = createApp({ corsOrigin: process.env.CORS_ORIGIN ?? '*' });

server.listen(port, () => {
  console.log(`WORKFLOW API listening on http://localhost:${port}`);
});
