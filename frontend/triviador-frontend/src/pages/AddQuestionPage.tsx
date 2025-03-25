import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";
import "../styles/AddQuestionPage.css";

function AddQuestionPage() {
  const questionContext = useContext(QuestionContext);
  const navigate = useNavigate();

  if (!questionContext) {
    throw new Error("QuestionContext must be used within a QuestionProvider");
  }

  const { addQuestion } = questionContext;

  const handleAddQuestion = (newQuestion: Question) => {
    // Validate the question before adding
    if (!newQuestion.questionText.trim()) {
      alert("Question text is required!");
      return;
    }

    if (!newQuestion.correctAnswer.trim()) {
      alert("Correct answer is required!");
      return;
    }

    // Add the question
    addQuestion(newQuestion);

    // Navigate back to questions page
    navigate("/questions");
  };

  return (
    <div className="add-question-page-container">
      <QuestionForm onSubmit={handleAddQuestion} mode="add" />
    </div>
  );
}

export default AddQuestionPage;
