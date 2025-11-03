import { Router } from 'express';
import aiTutorRoutes from './ai-tutor.routes';
import authRoutes from './auth.routes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'CodeTutor AI Backend is running'
  });
});

// Mount route modules
router.use('/ai-tutor', aiTutorRoutes);
router.use('/auth', authRoutes);

// Progress routes (if needed separately)
router.get('/progress/:userId', (req, res) => {
  // Placeholder for progress endpoint
  res.json({
    totalLessons: 12,
    completedLessons: 8,
    totalQuizzes: 15,
    correctAnswers: 12,
    streak: 5,
    points: 1250
  });
});

export default router;
