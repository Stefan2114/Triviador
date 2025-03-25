import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionContext } from "../context/QuestionProvider";
import QuestionItem from "../components/QuestionItem";
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

  const handleCreateQuestionClick = () => {
    navigate(`/questions/add`);
  };

  const handleQuestionClick = (questionId: number) => {
    navigate(`/questions/${questionId}`);
  };

  // Filtering logic
  const filteredQuestions = questions.filter((question) => {
    const categoryMatch =
      categoryFilter.length === 0 || categoryFilter.includes(question.category);

    const typeMatch =
      typeFilter.length === 0 || typeFilter.includes(question.type);

    const searchMatch = question.questionText
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return categoryMatch && typeMatch && searchMatch;
  });

  // Sorting logic
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (orderBy) {
      case "difficulty":
        return a.difficulty - b.difficulty;
      case "date":
        return a.date.getTime() - b.date.getTime();
      default:
        return a.id - b.id;
    }
  });

  return (
    <div className="questions-container">
      {/* Sidebar with Filters */}
      <div className="sidebar">
        <button
          className="create-button"
          onClick={() => handleCreateQuestionClick()}
        >
          Create new question
        </button>

        <div className="filter-section">
          <h3>Type</h3>
          <div className="filter-checkbox">
            <input
              type="checkbox"
              checked={typeFilter.includes("multi-choice")}
              onChange={() => handleTypeFilterChange("multi-choice")}
            />
            <label>Multiple Choice Question</label>
          </div>
          <div className="filter-checkbox">
            <input
              type="checkbox"
              checked={typeFilter.includes("open-ended")}
              onChange={() => handleTypeFilterChange("open-ended")}
            />
            <label>Open-ended</label>
          </div>
        </div>

        <div className="filter-section">
          <h3>Category</h3>
          {["Math", "Football"].map((category) => (
            <div key={category} className="filter-checkbox">
              <input
                type="checkbox"
                checked={categoryFilter.includes(category.toLowerCase())}
                onChange={() =>
                  handleCategoryFilterChange(category.toLowerCase())
                }
              />
              <label>{category}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Sort */}
        <div className="search-and-sort">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="order-by-select"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="difficulty">Order By Difficulty</option>
            <option value="date">Order By Date</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="questions-list">
          {sortedQuestions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onSeeMoreClick={handleQuestionClick}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Helper functions
  function handleCategoryFilterChange(category: string) {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function handleTypeFilterChange(type: string) {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }
};

export default QuestionsPage;
