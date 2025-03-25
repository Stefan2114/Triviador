import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";

function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionContext = useContext(QuestionContext);

  if (!questionContext) {
    throw new Error("QuestionContext must be used within a QuestionProvider");
  }

  const { questions, updateQuestion } = questionContext;
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined
  );

  useEffect(() => {
    // Find the question to edit
    const questionToEdit = questions.find((q) => q.id === Number(id));

    if (!questionToEdit) {
      // Redirect if question not found
      navigate("/questions");
      return;
    }

    setCurrentQuestion(questionToEdit);
  }, [id, questions, navigate]);

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    if (updateQuestion) {
      updateQuestion(updatedQuestion);
      navigate("/questions");
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-question-page-container">
      <div className="edit-question-content">
        <QuestionForm
          initialQuestion={currentQuestion}
          onSubmit={handleUpdateQuestion}
          mode="edit"
        />
      </div>
    </div>
  );
}

export default EditQuestionPage;
