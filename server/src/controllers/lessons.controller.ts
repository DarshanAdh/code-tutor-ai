import type { Request, Response } from 'express';
import { z } from 'zod';
import { Lesson } from '../models/Lesson';

const createLessonSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
});

export async function listLessons(req: Request, res: Response) {
  const { courseId } = req.query;
  const filter: any = {};
  if (courseId) filter.courseId = courseId;
  const lessons = await Lesson.find(filter).sort({ createdAt: -1 });
  res.json(lessons);
}

export async function createLesson(req: Request, res: Response) {
  const parsed = createLessonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.issues);
  const created = await Lesson.create(parsed.data);
  res.status(201).json(created);
}

export async function getLesson(req: Request, res: Response) {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
}

export async function updateLesson(req: Request, res: Response) {
  const parsed = createLessonSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.issues);
  const updated = await Lesson.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ error: 'Lesson not found' });
  res.json(updated);
}

export async function deleteLesson(req: Request, res: Response) {
  const deleted = await Lesson.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Lesson not found' });
  res.status(204).send();
}

