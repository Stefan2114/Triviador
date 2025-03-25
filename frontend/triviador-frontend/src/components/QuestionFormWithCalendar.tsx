import React, { useState, useEffect } from "react";
import { Question } from "../types/question";
import "../styles/QuestionForm.css";

interface QuestionFormProps {
  initialQuestion?: Question;
  onSubmit: (question: Question) => void;
  mode?: "add" | "edit";
}

function QuestionForm({
  initialQuestion,
  onSubmit,
  mode = "add",
}: QuestionFormProps) {
  const [formData, setFormData] = useState({
    questionText: initialQuestion?.questionText || "",
    category: initialQuestion?.category || "math",
    type: initialQuestion?.type || "open-ended",
    correctAnswer: initialQuestion?.correctAnswer || "",
    wrongAnswers: initialQuestion?.wrongAnswers
      ? [...initialQuestion.wrongAnswers, "", ""].slice(0, 2)
      : ["", ""],
    difficulty: initialQuestion?.difficulty || 1,
    date: initialQuestion?.date || new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialQuestion) {
      setFormData({
        questionText: initialQuestion.questionText,
        category: initialQuestion.category,
        type: initialQuestion.type,
        correctAnswer: initialQuestion.correctAnswer,
        wrongAnswers: initialQuestion.wrongAnswers
          ? [...initialQuestion.wrongAnswers, "", ""].slice(0, 2)
          : ["", ""],
        difficulty: initialQuestion.difficulty,
        date: initialQuestion.date || new Date().toISOString().split("T")[0],
      });
    }
  }, [initialQuestion]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWrongAnswerChange = (index: number, value: string) => {
    const updatedWrongAnswers = [...formData.wrongAnswers];
    updatedWrongAnswers[index] = value;
    setFormData((prev) => ({ ...prev, wrongAnswers: updatedWrongAnswers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.questionText.trim()) {
      alert("Question text is required!");
      return;
    }

    if (!formData.correctAnswer.trim()) {
      alert("Correct answer is required!");
      return;
    }

    if (formData.type === "multi-choice") {
      const validWrongAnswers = formData.wrongAnswers.filter(
        (answer) => answer.trim() !== ""
      );
      if (validWrongAnswers.length !== 2) {
        alert("2 wrong answers are required for multiple-choice questions");
        return;
      }
    }

    const submittedQuestion: Question = {
      id: initialQuestion?.id || Date.now(),
      questionText: formData.questionText.trim(),
      category: formData.category as "math" | "football",
      type: formData.type as "multi-choice" | "open-ended",
      correctAnswer: formData.correctAnswer.trim(),
      wrongAnswers:
        formData.type === "multi-choice"
          ? formData.wrongAnswers.filter((answer) => answer.trim() !== "")
          : undefined,
      difficulty: Number(formData.difficulty) as 1 | 2 | 3,
      date: formData.date,
    };

    onSubmit(submittedQuestion);
  };

  return (
    <div className="question-form-container">
      <form onSubmit={handleSubmit} className="question-form">
        <h2 className="form-title">
          {mode === "add" ? "Add New Question" : "Edit Question"}
        </h2>

        <div className="form-grid">
          <div className="form-row">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="math">Math</option>
              <option value="football">Football</option>
            </select>
          </div>

          <div className="form-row">
            <label>Question Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="open-ended">Open-ended</option>
              <option value="multi-choice">Multiple Choice</option>
            </select>
          </div>

          <div className="form-row full-width">
            <label>Question Text</label>
            <input
              type="text"
              name="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              placeholder="Enter your question"
              required
            />
          </div>

          <div className="form-row full-width">
            <label>Correct Answer</label>
            <input
              type="text"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleInputChange}
              placeholder="Enter the correct answer"
              required
            />
          </div>

          {formData.type === "multi-choice" && (
            <div className="form-row full-width">
              <label>Wrong Answers</label>
              {formData.wrongAnswers.map((answer, index) => (
                <input
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(e) =>
                    handleWrongAnswerChange(index, e.target.value)
                  }
                  placeholder={`Wrong Answer ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="form-row">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              <option value={1}>Easy (1)</option>
              <option value={2}>Medium (2)</option>
              <option value={3}>Hard (3)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {mode === "add" ? "Add Question" : "Update Question"}
        </button>
      </form>
    </div>
  );
}

export default QuestionForm;
