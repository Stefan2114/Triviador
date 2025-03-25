import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionForm from "../components/QuestionForm";
import { Question } from "../types/question";

describe("QuestionForm", () => {
  const mockOnSubmit = jest.fn();

  const renderForm = (
    initialQuestion?: Question,
    mode: "add" | "edit" = "add"
  ) => {
    return render(
      <QuestionForm
        initialQuestion={initialQuestion}
        onSubmit={mockOnSubmit}
        mode={mode}
      />
    );
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test("renders form in add mode", () => {
    renderForm();

    expect(screen.getByText("Add Question")).toBeInTheDocument();
    expect(screen.getByLabelText(/Question:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correct answer:/i)).toBeInTheDocument();
  });

  test("renders form in edit mode with initial data", () => {
    const initialQuestion: Question = {
      id: 1,
      questionText: "Original Question",
      category: "math",
      type: "open-ended",
      correctAnswer: "Original Answer",
      difficulty: 2,
      date: new Date(),
    };

    renderForm(initialQuestion, "edit");

    const questionInput = screen.getByLabelText(/Question:/i);
    expect(questionInput).toHaveValue("Original Question");
    expect(screen.getByText("Update Question")).toBeInTheDocument();
  });

  test("submits form with valid data", () => {
    renderForm();

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Question:/i), {
      target: { value: "New Test Question" },
    });
    fireEvent.change(screen.getByLabelText(/Correct answer:/i), {
      target: { value: "New Test Answer" },
    });

    // Select category and type
    fireEvent.click(screen.getByLabelText("Math"));
    fireEvent.click(screen.getByLabelText("Open-ended"));

    // Submit form
    fireEvent.click(screen.getByText("Add Question"));

    // Check submission
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        questionText: "New Test Question",
        correctAnswer: "New Test Answer",
        category: "math",
        type: "open-ended",
      })
    );
  });

  test("shows error for empty question text", () => {
    const originalAlert = window.alert;
    window.alert = jest.fn();

    renderForm();

    // Try to submit without filling out the form
    fireEvent.click(screen.getByText("Add Question"));

    // Check that alert was called
    expect(window.alert).toHaveBeenCalledWith("Question text is required!");

    // Restore original alert
    window.alert = originalAlert;
  });
});
