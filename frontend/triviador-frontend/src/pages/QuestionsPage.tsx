import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";
import QuestionStatisticsCharts from "../components/QuestionStatisticsCharts";
import "../styles/QuestionsPage.css";
import QuestionItem from "../components/QuestionItem";

const QuestionsPage = () => {
  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error("QuestionContext not found");

  const { questions } = questionContext;
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("difficulty");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  // Dynamically extract unique categories and types
  const uniqueCategories = useMemo(() => {
    return [...new Set(questions.map((q) => q.category))];
  }, [questions]);

  const uniqueTypes = useMemo(() => {
    return [...new Set(questions.map((q) => q.type))];
  }, [questions]);

  const difficultyCounts = useMemo(() => {
    return questions.reduce((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [questions]);

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

  // Enhanced pagination render helper
  const renderPagination = () => {
    const pages: React.ReactNode[] = [];
    const maxPagesToShow = 7; // Total pages to show including first, last, and ellipses

    // Helper to add page button
    const addPageButton = (pageNumber: number) => {
      pages.push(
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={currentPage === pageNumber ? "active-page" : ""}
        >
          {pageNumber}
        </button>
      );
    };

    // Add ellipsis button
    const addEllipsis = (key: string) => {
      pages.push(
        <span key={key} className="pagination-ellipsis">
          ...
        </span>
      );
    };

    // If total pages are less than or equal to max pages to show, show all
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        addPageButton(i);
      }
    } else {
      // Always show first page
      addPageButton(1);

      // Determine start and end range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add first ellipsis if needed
      if (currentPage > 3) {
        addEllipsis("start-ellipsis");
      }

      // Show pages around current page
      for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
      }

      // Add last ellipsis if needed
      if (currentPage < totalPages - 2) {
        addEllipsis("end-ellipsis");
      }

      // Always show last page
      addPageButton(totalPages);
    }

    return pages;
  };

  const handleQuestionClick = (questionId: number) => {
    navigate(`/questions/${questionId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Filter change handlers
  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Order by handler
  const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e.target.value);
  };

  // New handler for creating a new question
  const handleCreateQuestion = () => {
    navigate("/questions/add");
  };

  return (
    <div className="questions-container">
      <div className="sidebar">
        <button className="create-button" onClick={handleCreateQuestion}>
          Create Question
        </button>

        <div className="filter-section">
          <h3>Categories</h3>
          {uniqueCategories.map((category) => (
            <div key={category} className="filter-checkbox">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={categoryFilter.includes(category)}
                onChange={() => handleCategoryFilterChange(category)}
              />
              <label htmlFor={`category-${category}`}>{category}</label>
            </div>
          ))}
        </div>

        <div className="filter-section">
          <h3>Question Types</h3>
          {uniqueTypes.map((type) => (
            <div key={type} className="filter-checkbox">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={typeFilter.includes(type)}
                onChange={() => handleTypeFilterChange(type)}
              />
              <label htmlFor={`type-${type}`}>{type}</label>
            </div>
          ))}
        </div>

        <QuestionStatisticsCharts />
      </div>

      <div className="main-content">
        <div className="search-and-sort">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <select
            className="order-by-select"
            value={orderBy}
            onChange={handleOrderByChange}
          >
            <option value="difficulty">Sort by Difficulty</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
        <div className="questions-list">
          {paginatedQuestions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onSeeMoreClick={handleQuestionClick}
              difficultyCounts={difficultyCounts}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">{renderPagination()}</div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
