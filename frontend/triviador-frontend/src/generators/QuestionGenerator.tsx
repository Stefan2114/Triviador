import React, { useContext, useEffect, useCallback } from "react";
import { faker } from "@faker-js/faker";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";

const QuestionGenerator: React.FC = () => {
  const questionContext = useContext(QuestionContext);

  if (!questionContext) {
    throw new Error("QuestionContext not found");
  }

  const { addQuestion, questions } = questionContext;

  const generateRandomQuestion = useCallback((): Question => {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000), // Ensure unique ID
      questionText: faker.lorem.sentence() + "?",
      category: faker.helpers.arrayElement(["math", "football"]),
      type: faker.helpers.arrayElement(["multi-choice", "open-ended"]),
      correctAnswer: faker.lorem.word(),
      wrongAnswers: faker.lorem.words(3).split(" "),
      difficulty: faker.helpers.arrayElement([1, 2, 3]) as 1 | 2 | 3,
      date: faker.date.recent(),
    };
  }, []);

  useEffect(() => {
    // Only add initial questions if there are none
    if (questions.length === 0) {
      for (let i = 0; i < 5; i++) {
        addQuestion(generateRandomQuestion());
      }
    }

    // Set up interval to add questions every 10 seconds
    const intervalId = setInterval(() => {
      addQuestion(generateRandomQuestion());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [addQuestion, generateRandomQuestion, questions.length]);

  return null;
};

export default QuestionGenerator;
