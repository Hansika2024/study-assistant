import { StudyResultSchema } from "../schemas/studySchema";

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function hasDuplicates(values) {
  const normalized = values.map(normalizeText);
  return new Set(normalized).size !== normalized.length;
}

export function validateStudyResult(data) {
  const schemaResult = StudyResultSchema.safeParse(data);

  if (!schemaResult.success) {
    return {
      valid: false,
      message: "The generated study content is not valid.",
      data: null,
    };
  }

  const result = schemaResult.data;

  if (result.type === "quiz") {
    const questions = result.questions.map(
      (item) => item.question
    );

    if (hasDuplicates(questions)) {
      return {
        valid: false,
        message: "The generated quiz contains duplicate questions.",
        data: null,
      };
    }

    for (const question of result.questions) {
      if (hasDuplicates(question.options)) {
        return {
          valid: false,
          message: "The generated quiz contains duplicate options.",
          data: null,
        };
      }
    }
  }

  if (result.type === "flashcards") {
    const questions = result.cards.map(
      (item) => item.question
    );

    if (hasDuplicates(questions)) {
      return {
        valid: false,
        message: "The generated flashcards contain duplicate questions.",
        data: null,
      };
    }
  }

  return {
    valid: true,
    message: null,
    data: result,
  };
}