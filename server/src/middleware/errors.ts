import type { NextFunction, Request, Response } from 'express';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
}

