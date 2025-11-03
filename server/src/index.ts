import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectToDatabase } from './config/mongo';
import api from './routes';

const app = express();

// Security headers
app.use(helmet());

// CORS: allow from env-configured origin(s)
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080')
  .split(',')
  .map((o) => o.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// Gzip/deflate responses
app.use(compression());

// Basic rate limiting for public API
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes (mounted under /api)
app.use('/api', api);

const port = process.env.PORT || 4000;
// Prefer MONGO_URI for consistency with docs; fall back to MONGODB_URI and then localhost
const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/codetutor';

// Redact credentials in logs
const redactedUri = mongoUri.replace(/:\/\/.*?:.*?@/, '://****:****@');
console.log('Connecting to MongoDB with URI:', redactedUri);

connectToDatabase(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening on :${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    // Optional dev-mode: allow starting server without DB if explicitly enabled
    if (process.env.ALLOW_START_WITHOUT_DB === '1' || process.env.ALLOW_START_WITHOUT_DB === 'true') {
      console.warn('Starting server without MongoDB connection (dev mode)');
      app.listen(port, () => {
        console.log(`server listening on :${port} (no DB connection)`);
      });
    } else {
      process.exit(1);
    }
  });
