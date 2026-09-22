import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import moduleRoutes from './routes/modules.js';
import employeeRoutes from './routes/employees.js';
import pfRoutes from './routes/pf.js';
import exitRoutes from './routes/exit.js';
import { HttpError } from './utils/httpError.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.clientUrls.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'finance-helper-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/pf', pfRoutes);
app.use('/api/exit', exitRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`Finance Helper API running on http://localhost:${config.port}`);
  });
}

export default app;
