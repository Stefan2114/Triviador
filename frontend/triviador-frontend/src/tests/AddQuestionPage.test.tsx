import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddQuestionPage from "../pages/AddQuestionPage";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";

// Mock navigation
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("AddQuestionPage", () => {
  const mockAddQuestion = jest.fn();

  const renderWithProviders = (component: React.ReactElement) => {
    const mockContextValue = {
      questions: [],
      addQuestion: mockAddQuestion,
      updateQuestion: jest.fn(),
      deleteQuestion: jest.fn(),
    };

    return render(
      <MemoryRouter initialEntries={["/questions/add"]}>
        <QuestionContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/questions/add" element={component} />
            <Route path="/questions" element={<div>Questions Page</div>} />
          </Routes>
        </QuestionContext.Provider>
      </MemoryRouter>
    );
  };

  test("renders add question form", () => {
    renderWithProviders(<AddQuestionPage />);

    expect(screen.getByLabelText(/Question:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correct answer:/i)).toBeInTheDocument();
  });

  test("adds a new question and navigates", async () => {
    renderWithProviders(<AddQuestionPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Question:/i), {
      target: { value: "Test Math Question" },
    });
    fireEvent.change(screen.getByLabelText(/Correct answer:/i), {
      target: { value: "Test Answer" },
    });

    // Select category and type
    fireEvent.click(screen.getByLabelText("Math"));
    fireEvent.click(screen.getByLabelText("Open-ended"));

    // Submit the form
    fireEvent.click(screen.getByText("Add Question"));

    // Wait for and check navigation and question addition
    await waitFor(() => {
      expect(mockAddQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          questionText: "Test Math Question",
          correctAnswer: "Test Answer",
          category: "math",
          type: "open-ended",
        })
      );
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/questions");
    });
  });
});
