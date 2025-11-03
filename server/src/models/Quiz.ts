import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizDocument extends Document {
  lessonId: Types.ObjectId;
  questions: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<QuizQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
});

const quizSchema = new Schema<QuizDocument>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

export const Quiz: Model<QuizDocument> = mongoose.models.Quiz || mongoose.model<QuizDocument>('Quiz', quizSchema);

