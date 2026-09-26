function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function hasDuplicateValues(values) {
  const normalizedValues = values.map(normalizeText);

  return new Set(normalizedValues).size !== normalizedValues.length;
}

function validateLogicalContent(data) {
  if (data.type === "quiz") {
    const questionTexts = data.questions.map(
      (question) => question.question
    );

    if (hasDuplicateValues(questionTexts)) {
      return {
        valid: false,
        message: "Generated quiz contains duplicate questions.",
      };
    }

    for (const question of data.questions) {
      if (hasDuplicateValues(question.options)) {
        return {
          valid: false,
          message: "Generated quiz contains duplicate options.",
        };
      }
    }
  }

  if (data.type === "flashcards") {
    const cardQuestions = data.cards.map(
      (card) => card.question
    );

    if (hasDuplicateValues(cardQuestions)) {
      return {
        valid: false,
        message: "Generated flashcards contain duplicate questions.",
      };
    }
  }

  return {
    valid: true,
  };
}

module.exports = {
  validateLogicalContent,
};