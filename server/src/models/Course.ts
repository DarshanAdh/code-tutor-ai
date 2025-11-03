import mongoose, { Schema, Document, Model } from 'mongoose';

export interface CourseDocument extends Document {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<CourseDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Course: Model<CourseDocument> =
  mongoose.models.Course || mongoose.model<CourseDocument>('Course', courseSchema);

