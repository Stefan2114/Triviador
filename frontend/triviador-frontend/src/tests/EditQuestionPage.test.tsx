import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditQuestionPage from "../pages/EditQuestionPage";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";

// Mock navigation
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ id: "1" }),
}));

describe("EditQuestionPage", () => {
  const mockUpdateQuestion = jest.fn();

  const initialQuestion: Question = {
    id: 1,
    questionText: "Original Question",
    category: "math",
    type: "open-ended",
    correctAnswer: "Original Answer",
    difficulty: 2,
    date: new Date(),
  };

  const renderWithProviders = (component: React.ReactElement) => {
    const mockContextValue = {
      questions: [initialQuestion],
      updateQuestion: mockUpdateQuestion,
      addQuestion: jest.fn(),
      deleteQuestion: jest.fn(),
    };

    return render(
      <MemoryRouter initialEntries={["/questions/edit/1"]}>
        <QuestionContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/questions/edit/:id" element={component} />
            <Route path="/questions" element={<div>Questions Page</div>} />
          </Routes>
        </QuestionContext.Provider>
      </MemoryRouter>
    );
  };

  test("renders edit question form with initial data", () => {
    renderWithProviders(<EditQuestionPage />);

    const questionInput = screen.getByLabelText(/Question:/i);
    expect(questionInput).toHaveValue("Original Question");
  });

  test("updates question and navigates", async () => {
    renderWithProviders(<EditQuestionPage />);

    // Modify question text
    const questionInput = screen.getByLabelText(/Question:/i);
    fireEvent.change(questionInput, {
      target: { value: "Updated Question" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Update Question"));

    // Wait for and check navigation and question update
    await waitFor(() => {
      expect(mockUpdateQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          questionText: "Updated Question",
        })
      );
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/questions");
    });
  });
});
