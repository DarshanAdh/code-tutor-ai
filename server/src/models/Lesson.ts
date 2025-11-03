import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface LessonDocument extends Document {
  courseId: Types.ObjectId;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<LessonDocument>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

export const Lesson: Model<LessonDocument> =
  mongoose.models.Lesson || mongoose.model<LessonDocument>('Lesson', lessonSchema);

