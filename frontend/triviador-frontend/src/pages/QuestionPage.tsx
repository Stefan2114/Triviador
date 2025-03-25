import React from "react";
import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QuestionContext } from "../context/QuestionProvider";
import "../styles/QuestionPage.css";

const QuestionPage: React.FC = () => {
  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error("QuestionContext not found");

  const { questions, deleteQuestion } = questionContext;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the question using the id from the URL parameters
  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div className="question-not-found">
        <h1>Question not found.</h1>
        <Link to="/questions" className="back-button">
          Back to Questions
        </Link>
      </div>
    );
  }

  const handleDeleteQuestion = () => {
    if (
      deleteQuestion &&
      window.confirm("Are you sure you want to delete this question?")
    ) {
      deleteQuestion(Number(id));
      navigate("/questions");
    }
  };

  return (
    <div className="question-detail-container">
      <div className="question-content">
        <div className="question-details">
          <div className="question-left-panel">
            <div className="question-category">
              <h2>Category</h2>
              <p>{question.category}</p>
            </div>
            <div className="question-difficulty">
              <h2>Difficulty</h2>
              <p>{question.difficulty}</p>
            </div>
          </div>
          <div className="question-right-panel">
            <h1 className="question-text">{question.questionText}</h1>
            <div className="question-type">
              <h2>Question Type</h2>
              <p>{question.type}</p>
            </div>
            <div className="question-answers">
              <h2>Answers</h2>
              {question.type === "multi-choice" ? (
                <>
                  <div className="correct-answer">
                    <h3>Correct Answer</h3>
                    <p>{question.correctAnswer}</p>
                  </div>
                  {question.wrongAnswers && (
                    <div className="wrong-answers">
                      <h3>Wrong Answers</h3>
                      <ul>
                        {question.wrongAnswers.map((answer, index) => (
                          <li key={index}>{answer}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="correct-answer">
                  <h3>Answer</h3>
                  <p>{question.correctAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="question-actions">
          <Link to={`/questions/edit/${question.id}`} className="edit-button">
            Edit Question
          </Link>
          <button onClick={handleDeleteQuestion} className="delete-button">
            Delete Question
          </button>
          <Link to="/questions" className="back-button">
            Back to Questions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
