const { z } = require("zod");

const QuizQuestionSchema = z.object({
  question: z.string().trim().min(1),
  options: z
    .array(z.string().trim().min(1))
    .length(4),
  correct_answer: z
    .number()
    .int()
    .min(0)
    .max(3),
  explanation: z.string().trim().min(1),
});

const QuizSchema = z.object({
  type: z.literal("quiz"),
  title: z.string().trim().min(1),
  questions: z
    .array(QuizQuestionSchema)
    .min(5)
    .max(10),
});

const FlashcardSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

const FlashcardsSchema = z.object({
  type: z.literal("flashcards"),
  title: z.string().trim().min(1),
  cards: z
    .array(FlashcardSchema)
    .min(5)
    .max(10),
});

const StudyResultSchema = z.discriminatedUnion("type", [
  QuizSchema,
  FlashcardsSchema,
]);

module.exports = {
  QuizQuestionSchema,
  QuizSchema,
  FlashcardSchema,
  FlashcardsSchema,
  StudyResultSchema,
};