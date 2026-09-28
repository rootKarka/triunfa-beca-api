import { Router } from 'express';
import { addClient, removeClient } from '../../../shared/events/broadcaster.js';

const router = Router();

router.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('\n');

  addClient(res);

  const latido = setInterval(() => res.write(': ping\n\n'), 25000);

  req.on('close', () => {
    clearInterval(latido);
    removeClient(res);
  });
});

export default router;