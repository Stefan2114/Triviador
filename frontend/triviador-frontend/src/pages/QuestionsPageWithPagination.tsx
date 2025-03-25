import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";
import "../styles/QuestionsPage.css";

const QuestionsPageWithPagination = () => {
  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error("QuestionContext not found");

  const { questions } = questionContext;
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("difficulty");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  // Filtering logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const categoryMatch =
        categoryFilter.length === 0 ||
        categoryFilter.includes(question.category);

      const typeMatch =
        typeFilter.length === 0 || typeFilter.includes(question.type);

      const searchMatch = question.questionText
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return categoryMatch && typeMatch && searchMatch;
    });
  }, [questions, categoryFilter, typeFilter, searchTerm]);

  // Sorting logic
  const sortedQuestions = useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      switch (orderBy) {
        case "difficulty":
          return a.difficulty - b.difficulty;
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return a.id - b.id;
      }
    });
  }, [filteredQuestions, orderBy]);

  // Pagination logic
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    return sortedQuestions.slice(startIndex, startIndex + questionsPerPage);
  }, [sortedQuestions, currentPage, questionsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);

  const handleQuestionClick = (questionId: number) => {
    navigate(`/questions/${questionId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Pagination render helper
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active-page" : ""}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // Existing filter change handlers remain the same
  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  return (
    <div className="questions-container">
      {/* Sidebar remains the same */}
      <div className="sidebar">{/* ... existing sidebar content ... */}</div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Sort remains the same */}
        <div className="search-and-sort">
          {/* ... existing search and sort content ... */}
        </div>

        {/* Questions List */}
        <div className="questions-list">
          {paginatedQuestions.map((question) => (
            <div key={question.id} className="question-item">
              <div className="question-details">
                <h2>{question.questionText}</h2>
                <p>Category - {question.category}</p>
                <p>Type - {question.type}</p>
                <p>Date - {question.date}</p>
              </div>
              <button
                className="see-more-btn"
                onClick={() => handleQuestionClick(question.id)}
              >
                See more info
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">{renderPagination()}</div>
      </div>
    </div>
  );
};

export default QuestionsPageWithPagination;
