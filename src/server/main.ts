import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { logger } from './core/logger';
import { errorHandler } from './core/errorHandler';
import { authRouter } from './modules/auth/auth.routes';
import { catalogRouter } from './modules/catalog/catalog.routes';

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  // Security & Utility Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite HMR and inline scripts in dev
  }));
  app.use(cors());
  app.use(express.json());

  // API Routes
  const apiRouter = express.Router();
  
  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', phase: 2, message: 'Catalog module initialized' });
  });

  apiRouter.use('/auth', authRouter);
  apiRouter.use('/catalog', catalogRouter);

  // Mount API
  app.use('/api', apiRouter);

  // Vite Integration for Frontend
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Starting Vite in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    logger.info('Serving static production build...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to bootstrap server', err);
  process.exit(1);
});
