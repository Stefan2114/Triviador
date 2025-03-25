export interface Question {
  id: number;
  questionText: string;
  category: "math" | "football";
  type: "multi-choice" | "open-ended";
  correctAnswer: string;
  wrongAnswers?: string[];
  difficulty: 1 | 2 | 3;
  date: Date; 
}