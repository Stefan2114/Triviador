import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import QuestionPage from "../pages/QuestionPage";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";

// Mock navigation
const mockedUsedNavigate = jest.fn();
const mockedWindowConfirm = jest.fn(() => true);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ id: "1" }),
}));

// Mock window.confirm
window.confirm = mockedWindowConfirm;

describe("QuestionPage", () => {
  const initialQuestion: Question = {
    id: 1,
    questionText: "Test Question",
    category: "math",
    type: "open-ended",
    correctAnswer: "Test Answer",
    difficulty: 2,
    date: new Date(),
  };

  const renderWithProviders = (component: React.ReactElement) => {
    const mockContextValue = {
      questions: [initialQuestion],
      deleteQuestion: jest.fn((id) => {
        mockContextValue.questions = mockContextValue.questions.filter(
          (q) => q.id !== id
        );
      }),
      addQuestion: jest.fn(),
      updateQuestion: jest.fn(),
    };

    return render(
      <MemoryRouter initialEntries={["/questions/1"]}>
        <QuestionContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/questions/:id" element={component} />
            <Route path="/questions" element={<div>Questions Page</div>} />
          </Routes>
        </QuestionContext.Provider>
      </MemoryRouter>
    );
  };

  test("renders question details", () => {
    renderWithProviders(<QuestionPage />);

    expect(screen.getByText("Test Question")).toBeInTheDocument();
    expect(screen.getByText("math")).toBeInTheDocument();
    expect(screen.getByText("Test Answer")).toBeInTheDocument();
  });

  test("allows editing question", () => {
    renderWithProviders(<QuestionPage />);

    const editButton = screen.getByText("Edit Question");
    expect(editButton).toHaveAttribute("href", "/questions/edit/1");
  });

  test("deletes question when confirmed", () => {
    const { container } = renderWithProviders(<QuestionPage />);

    const deleteButton = screen.getByText("Delete Question");
    fireEvent.click(deleteButton);

    // Verify confirmation was called and navigation occurred
    expect(mockedWindowConfirm).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/questions");
  });
});
