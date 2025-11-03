import type { Request, Response } from 'express';
import { z } from 'zod';
import { Course } from '../models/Course';

const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export async function listCourses(_req: Request, res: Response) {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
}

export async function createCourse(req: Request, res: Response) {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.issues);
  const created = await Course.create(parsed.data);
  res.status(201).json(created);
}

export async function getCourse(req: Request, res: Response) {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
}

export async function updateCourse(req: Request, res: Response) {
  const parsed = createCourseSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.issues);
  const updated = await Course.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ error: 'Course not found' });
  res.json(updated);
}

export async function deleteCourse(req: Request, res: Response) {
  const deleted = await Course.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Course not found' });
  res.status(204).send();
}

