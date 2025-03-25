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
    date: initialQuestion?.date || new Date(),
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
        date: initialQuestion.date,
      });
    }
  }, [initialQuestion]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for difficulty to ensure it's a number
    const processedValue = name === "difficulty" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
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
      category: formData.category.toLowerCase() as "math" | "football",
      type: formData.type as "multi-choice" | "open-ended",
      correctAnswer: formData.correctAnswer.trim(),
      wrongAnswers:
        formData.type === "multi-choice"
          ? formData.wrongAnswers.filter((answer) => answer.trim() !== "")
          : undefined,
      difficulty: Number(formData.difficulty) as 1 | 2 | 3,
      date: new Date(),
    };

    onSubmit(submittedQuestion);
  };

  return (
    <div className="question-form-container">
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-content">
          <div className="form-sidebar">
            <div className="category-section">
              <h3>Category</h3>
              <div className="category-options">
                {["Football", "Math"].map((cat) => (
                  <div key={cat} className="category-option">
                    <input
                      type="radio"
                      id={cat.toLowerCase()}
                      name="category"
                      value={cat.toLowerCase()}
                      checked={formData.category === cat.toLowerCase()}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={cat.toLowerCase()}>{cat}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="difficulty-section">
              <h3>Difficulty</h3>
              <div className="difficulty-options">
                {[1, 2, 3].map((diff) => (
                  <div key={diff} className="difficulty-option">
                    <input
                      type="radio"
                      id={`difficulty-${diff}`}
                      name="difficulty"
                      value={diff}
                      checked={formData.difficulty === diff}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={`difficulty-${diff}`}>
                      {diff === 1 ? "Easy" : diff === 2 ? "Medium" : "Hard"}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-main-content">
            <div className="question-section">
              <label>Question:</label>
              <textarea
                name="questionText"
                placeholder="type..."
                value={formData.questionText}
                onChange={handleInputChange}
                className="question-text-input"
              />
            </div>

            <div className="type-section">
              <label>Answer type:</label>
              <div className="type-options">
                {["open-ended", "multi-choice"].map((type) => (
                  <div key={type} className="type-option">
                    <input
                      type="radio"
                      id={type}
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={type}>
                      {type === "open-ended" ? "Open-ended" : "Multiple Choice"}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="correct-answer-section">
              <label>Correct answer:</label>
              <textarea
                name="correctAnswer"
                placeholder="type..."
                value={formData.correctAnswer}
                onChange={handleInputChange}
                className="answer-input"
              />
            </div>

            {formData.type === "multi-choice" && (
              <div className="wrong-answers-section">
                {[0, 1].map((index) => (
                  <div key={index} className="wrong-answer-input">
                    <label>Wrong answer:</label>
                    <textarea
                      placeholder="type..."
                      value={formData.wrongAnswers[index]}
                      onChange={(e) =>
                        handleWrongAnswerChange(index, e.target.value)
                      }
                      className="answer-input"
                    />
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="submit-button">
              {mode === "add" ? "Add Question" : "Update Question"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
