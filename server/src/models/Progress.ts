import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProgressDocument extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  status: ProgressStatus;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<ProgressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    score: { type: Number },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const Progress: Model<ProgressDocument> =
  mongoose.models.Progress || mongoose.model<ProgressDocument>('Progress', progressSchema);

