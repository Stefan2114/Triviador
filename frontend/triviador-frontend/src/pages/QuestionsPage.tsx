import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionContext } from "../context/QuestionProvider";
import { Question } from "../types/question";
import QuestionStatisticsCharts from "../components/QuestionStatisticsCharts";
import "../styles/QuestionsPage.css";

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

  // Dynamically extract unique categories and types
  const uniqueCategories = useMemo(() => {
    return [...new Set(questions.map((q) => q.category))];
  }, [questions]);

  const uniqueTypes = useMemo(() => {
    return [...new Set(questions.map((q) => q.type))];
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

  return (
    <div className="questions-container">
      <div className="sidebar">
        <button className="create-button">Create Question</button>

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
            <div key={question.id} className="question-item">
              <div className="question-content">
                <h2 className="question-text">{question.questionText}</h2>
                <div className="question-footer">
                  <div className="question-details">
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{question.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{question.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Difficulty:</span>
                      <span className="detail-value">
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    className="see-more-btn"
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    See more info
                  </button>
                </div>
              </div>
            </div>
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
