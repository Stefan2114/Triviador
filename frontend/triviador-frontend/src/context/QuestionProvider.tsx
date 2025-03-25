import React, { createContext, useState, ReactNode } from "react";
import { Question } from "../types/question";

interface QuestionContextType {
  questions: Question[];
  addQuestion: (question: Question) => void;
  deleteQuestion?: (id: number) => void;
  updateQuestion?: (question: Question) => void;
}

export const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

export const QuestionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<Question[]>([
    // Math Questions
    {
      id: 1,
      questionText: "What is the derivative of x²?",
      category: "math",
      type: "open-ended",
      correctAnswer: "2x",
      difficulty: 2,
      date: new Date("2024-01-15"),
    },
    {
      id: 2,
      questionText: "Solve the equation: 2x + 5 = 13",
      category: "math",
      type: "open-ended",
      correctAnswer: "4",
      difficulty: 1,
      date: new Date("2024-01-16"),
    },
    {
      id: 3,
      questionText: "What is the area of a circle with radius 5?",
      category: "math",
      type: "multi-choice",
      correctAnswer: "78.54",
      wrongAnswers: ["50", "100"],
      difficulty: 2,
      date: new Date("2024-01-17"),
    },
    {
      id: 4,
      questionText: "What is 15% of 200?",
      category: "math",
      type: "open-ended",
      correctAnswer: "30",
      difficulty: 1,
      date: new Date("2024-01-18"),
    },
    {
      id: 5,
      questionText: "Solve: 3x - 7 = 20",
      category: "math",
      type: "open-ended",
      correctAnswer: "9",
      difficulty: 2,
      date: new Date("2024-01-19"),
    },
    {
      id: 6,
      questionText: "What is the square root of 144?",
      category: "math",
      type: "multi-choice",
      correctAnswer: "12",
      wrongAnswers: ["10", "14"],
      difficulty: 1,
      date: new Date("2024-01-20"),
    },
    {
      id: 7,
      questionText: "Calculate the volume of a cube with side 4",
      category: "math",
      type: "open-ended",
      correctAnswer: "64",
      difficulty: 2,
      date: new Date("2024-01-21"),
    },
    {
      id: 8,
      questionText: "What is 3² × 4?",
      category: "math",
      type: "open-ended",
      correctAnswer: "36",
      difficulty: 1,
      date: new Date("2024-01-22"),
    },
    {
      id: 9,
      questionText: "Find the perimeter of a rectangle 5 by 8",
      category: "math",
      type: "multi-choice",
      correctAnswer: "26",
      wrongAnswers: ["20", "30"],
      difficulty: 2,
      date: new Date("2024-01-23"),
    },
    {
      id: 10,
      questionText: "What is the sine of 90 degrees?",
      category: "math",
      type: "multi-choice",
      correctAnswer: "1",
      wrongAnswers: ["0", "0.5"],
      difficulty: 3,
      date: new Date("2024-01-24"),
    },
    {
      id: 11,
      questionText: "Solve: log₂(8) = ?",
      category: "math",
      type: "open-ended",
      correctAnswer: "3",
      difficulty: 3,
      date: new Date("2024-01-25"),
    },
    {
      id: 12,
      questionText: "What is the sum of angles in a triangle?",
      category: "math",
      type: "multi-choice",
      correctAnswer: "180",
      wrongAnswers: ["90", "360"],
      difficulty: 2,
      date: new Date("2024-01-26"),
    },
    {
      id: 13,
      questionText: "What is 5! (5 factorial)?",
      category: "math",
      type: "open-ended",
      correctAnswer: "120",
      difficulty: 2,
      date: new Date("2024-01-27"),
    },
    {
      id: 14,
      questionText: "Solve: x² = 64",
      category: "math",
      type: "multi-choice",
      correctAnswer: "8",
      wrongAnswers: ["6", "10"],
      difficulty: 2,
      date: new Date("2024-01-28"),
    },
    {
      id: 15,
      questionText: "What is 1/4 as a decimal?",
      category: "math",
      type: "multi-choice",
      correctAnswer: "0.25",
      wrongAnswers: ["0.5", "0.1"],
      difficulty: 1,
      date: new Date("2024-01-29"),
    },

    // Football Questions
    {
      id: 16,
      questionText: "Who won the 2022 FIFA World Cup?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "Argentina",
      wrongAnswers: ["France", "Brazil"],
      difficulty: 1,
      date: new Date("2024-02-01"),
    },
    {
      id: 17,
      questionText: "In which year was the first FIFA World Cup held?",
      category: "football",
      type: "open-ended",
      correctAnswer: "1930",
      difficulty: 3,
      date: new Date("2024-02-02"),
    },
    {
      id: 18,
      questionText:
        "How many players are on a football field per team during a match?",
      category: "football",
      type: "open-ended",
      correctAnswer: "11",
      difficulty: 1,
      date: new Date("2024-02-03"),
    },
    {
      id: 19,
      questionText: "Who has won the most Ballon d'Or awards?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "Lionel Messi",
      wrongAnswers: ["Cristiano Ronaldo", "Pele"],
      difficulty: 2,
      date: new Date("2024-02-04"),
    },
    {
      id: 20,
      questionText: "Which country has won the most World Cup titles?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "Brazil",
      wrongAnswers: ["Germany", "Italy"],
      difficulty: 2,
      date: new Date("2024-02-05"),
    },
    {
      id: 21,
      questionText: "What is the diameter of a standard football?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "22 cm",
      wrongAnswers: ["20 cm", "24 cm"],
      difficulty: 3,
      date: new Date("2024-02-06"),
    },
    {
      id: 22,
      questionText: "In which year was the Premier League founded?",
      category: "football",
      type: "open-ended",
      correctAnswer: "1992",
      difficulty: 2,
      date: new Date("2024-02-07"),
    },
    {
      id: 23,
      questionText:
        "Who scored the most goals in a single World Cup tournament?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "Miroslav Klose",
      wrongAnswers: ["Ronaldo", "Pelé"],
      difficulty: 3,
      date: new Date("2024-02-08"),
    },
    {
      id: 24,
      questionText: "What is the maximum length of a football pitch?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "120 meters",
      wrongAnswers: ["100 meters", "110 meters"],
      difficulty: 2,
      date: new Date("2024-02-09"),
    },
    {
      id: 25,
      questionText: "Who won the UEFA Champions League in 2023?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "Manchester City",
      wrongAnswers: ["Real Madrid", "Inter Milan"],
      difficulty: 1,
      date: new Date("2024-02-10"),
    },
    {
      id: 26,
      questionText: "What color is the penalty spot?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "White",
      wrongAnswers: ["Black", "Red"],
      difficulty: 1,
      date: new Date("2024-02-11"),
    },
    {
      id: 27,
      questionText: "How long does a standard football match last?",
      category: "football",
      type: "open-ended",
      correctAnswer: "90 minutes",
      difficulty: 1,
      date: new Date("2024-02-12"),
    },
    {
      id: 28,
      questionText: "Which country invented football?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "England",
      wrongAnswers: ["Brazil", "Italy"],
      difficulty: 2,
      date: new Date("2024-02-13"),
    },
    {
      id: 29,
      questionText: "What is the offside rule in football?",
      category: "football",
      type: "open-ended",
      correctAnswer:
        "A player is in an offside position if they are closer to the opponent's goal line than both the ball and the second-last opponent",
      difficulty: 3,
      date: new Date("2024-02-14"),
    },
    {
      id: 30,
      questionText:
        "How many substitutions are allowed in a standard football match?",
      category: "football",
      type: "multi-choice",
      correctAnswer: "5",
      wrongAnswers: ["3", "4"],
      difficulty: 2,
      date: new Date("2024-02-15"),
    },
  ]);

  const addQuestion = (newQuestion: Question) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  return (
    <QuestionContext.Provider
      value={{
        questions,
        addQuestion,
        deleteQuestion,
        updateQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
