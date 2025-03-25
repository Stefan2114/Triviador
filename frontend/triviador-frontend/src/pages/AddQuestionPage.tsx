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
    addQuestion(newQuestion);
    navigate("/questions");
  };

  return (
    <div className="add-question-page-container">
      <div className="add-question-content">
        <QuestionForm onSubmit={handleAddQuestion} mode="add" />
      </div>
    </div>
  );
}

export default AddQuestionPage;
