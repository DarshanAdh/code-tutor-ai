import type { Request, Response } from 'express';
import { z } from 'zod';
import { Quiz } from '../models/Quiz';

const createQuizSchema = z.object({
  lessonId: z.string().min(1),
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string()).min(2),
        correctIndex: z.number().int().nonnegative(),
      })
    )
    .min(1),
});

export async function getQuiz(req: Request, res: Response) {
  const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
}

export async function setQuiz(req: Request, res: Response) {
  const parsed = createQuizSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.issues);
  const { lessonId, questions } = parsed.data;
  const doc = await Quiz.findOneAndUpdate(
    { lessonId },
    { lessonId, questions },
    { new: true, upsert: true }
  );
  res.json(doc);
}

