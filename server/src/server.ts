import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment.js';
import { apiRateLimit } from './middleware/rateLimitMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import analysis from './routes/analysisRoutes.js';
import context from './routes/contextRoutes.js';
import ambiguity from './routes/ambiguityRoutes.js';
import semantic from './routes/semanticRoutes.js';
import clarification from './routes/clarificationRoutes.js';
import rewrite from './routes/rewriteRoutes.js';
import history from './routes/historyRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Allow requests from Vite dev server, localhost, 127.0.0.1, LAN addresses, and configured client origin
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin) ||
      /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin) ||
      origin === env.clientOrigin
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly fallback to eliminate CORS fetch failures
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '256kb' }));
app.use('/api', apiRateLimit);

app.get('/api/health', async (_req, res) => {
  let nlpStatus: 'online' | 'offline' = 'offline';
  try {
    const response = await fetch(`${env.nlpUrl}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (response.ok) nlpStatus = 'online';
  } catch {
    // Keep the health endpoint available so the UI can explain which service is missing.
  }
  res.json({ status: 'ok', service: 'contexta-api', nlpEngine: env.nlpUrl, nlpStatus });
});

app.use('/api/analyze', analysis);
app.use('/api/context', context);
app.use('/api/references', ambiguity);
app.use('/api', ambiguity);
app.use('/api/semantic', semantic);
app.use('/api/clarifications', clarification);
app.use('/api/rewrite', rewrite);
app.use('/api/history', history);

app.use(errorMiddleware);

app.listen(env.port, () => console.log(`Contexta API listening on http://localhost:${env.port}`));
