import React from "react";
import { Question } from "../types/question";
import "../styles/QuestionItem.css";

interface QuestionItemProps {
  question: Question;
  onSeeMoreClick: (questionId: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onSeeMoreClick,
}) => {
  // Helper function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="question-item">
      <div className="question-content">
        <div className="question-text">{question.questionText}</div>
        <div className="question-footer">
          <div className="question-details">
            <span className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{question.category}</span>
            </span>
            <span className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{question.type}</span>
            </span>
            <span className="detail-item">
              <span className="detail-label">Difficulty:</span>
              <span className="detail-value">{question.difficulty}</span>
            </span>
          </div>
          <button
            className="see-more-btn"
            onClick={() => onSeeMoreClick(question.id)}
          >
            See more info
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
