import Fastify from 'fastify';

import { APP_NAME } from '../../config/app';

const port = Number(process.env.REVEAL_API_PORT ?? 3001);

const app = Fastify({ logger: true });

app.get('/health', async () => ({
  ok: true,
  service: 'reveal',
  app: APP_NAME,
}));

async function start() {
  await app.listen({ port, host: '0.0.0.0' });
}

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
