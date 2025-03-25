import React from "react";
import { Question } from "../types/question";
import "../styles/QuestionItem.css";

interface QuestionItemProps {
  question: Question;
  onSeeMoreClick: (questionId: number) => void;
  difficultyCounts: Record<number, number>;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onSeeMoreClick,
  difficultyCounts,
}) => {
  // Determine color based on difficulty distribution
  const getDifficultyColor = () => {
    const counts = Object.values(difficultyCounts);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    if (difficultyCounts[question.difficulty] === minCount) {
      return "#FF6B6B"; // Red for lowest count
    }
    if (difficultyCounts[question.difficulty] === maxCount) {
      return "#4CAF50"; // Green for highest count
    }
    return "#8884d8"; // Default color
  };

  return (
    <div
      className="question-item"
      style={{
        borderLeft: `5px solid ${getDifficultyColor()}`,
        backgroundColor: `${getDifficultyColor()}10`, // Slight background tint
      }}
    >
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
              <span
                className="detail-value"
                style={{
                  backgroundColor: getDifficultyColor(),
                  color: "white",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                {question.difficulty}
              </span>
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
