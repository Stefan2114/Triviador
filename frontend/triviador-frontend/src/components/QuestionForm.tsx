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
    date: initialQuestion?.date || new Date(), // Use Date object
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
        date: initialQuestion.date, // Directly use the Date object
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
      date: new Date(), // Always use current date as Date object
    };

    onSubmit(submittedQuestion);
  };

  // If you want to show the date in the form, you'll need to format it
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="question-form-container">
      <form onSubmit={handleSubmit} className="question-form">
        <h2 className="form-title">
          {mode === "add" ? "Add New Question" : "Edit Question"}
        </h2>

        <div className="form-grid">
          {/* Optional: If you want to display the date */}
          <div className="form-row">
            <label>Date</label>
            <input
              type="date"
              value={formatDate(formData.date)}
              readOnly // Make it read-only since we're auto-assigning the date
              className="read-only-date"
            />
          </div>

          {/* Rest of the form remains the same */}
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

          {/* ... other form fields ... */}
        </div>

        <button type="submit" className="submit-button">
          {mode === "add" ? "Add Question" : "Update Question"}
        </button>
      </form>
    </div>
  );
}

export default QuestionForm;
