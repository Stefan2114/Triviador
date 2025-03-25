import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

// Define question types
interface Question {
  id: number;
  question: string;
  category: "math" | "football";
  type: "multi-choice" | "open-ended";
  correctAnswer: string;
  wrongAnswers?: string[];
  difficulty: number; // Numeric difficulty (1, 2, or 3)
}

function AddQuestion({ onAdd }: { onAdd: (q: Question) => void }) {
  const [form, setForm] = useState({
    question: "",
    category: "math",
    type: "open-ended",
    correctAnswer: "",
    wrongAnswers: ["", "", ""],
    difficulty: 1, // Default difficulty is 1 (Easy)
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWrongAnswerChange = (index: number, value: string) => {
    const updatedWrongAnswers = [...form.wrongAnswers];
    updatedWrongAnswers[index] = value;
    setForm((prev) => ({ ...prev, wrongAnswers: updatedWrongAnswers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.correctAnswer)
      return alert("Question and Correct Answer are required!");

    const newQuestion: Question = {
      id: Date.now(),
      question: form.question,
      category: form.category as "math" | "football",
      type: form.type as "multi-choice" | "open-ended",
      correctAnswer: form.correctAnswer,
      wrongAnswers:
        form.type === "multi-choice"
          ? form.wrongAnswers.filter(Boolean)
          : undefined,
      difficulty: Number(form.difficulty), // Ensure difficulty is a number
    };

    onAdd(newQuestion);
    setForm({
      question: "",
      category: "math",
      type: "open-ended",
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      difficulty: 1,
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto flex">
      <div className="w-1/4 pr-4">
        <select
          name="category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="math">Math</option>
          <option value="football">Football</option>
        </select>
      </div>

      <div className="flex-1">
        <input
          type="text"
          name="question"
          placeholder="Enter question"
          value={form.question}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              name="type"
              value="open-ended"
              checked={form.type === "open-ended"}
              onChange={() => setForm({ ...form, type: "open-ended" })}
            />{" "}
            Open-ended
          </label>
          <label className="ml-4">
            <input
              type="checkbox"
              name="type"
              value="multi-choice"
              checked={form.type === "multi-choice"}
              onChange={() => setForm({ ...form, type: "multi-choice" })}
            />{" "}
            Multiple Choice
          </label>
        </div>

        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct answer"
          value={form.correctAnswer}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        {form.type === "multi-choice" && (
          <>
            {form.wrongAnswers.map((wrong, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Wrong answer ${idx + 1}`}
                value={wrong}
                onChange={(e) => handleWrongAnswerChange(idx, e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            ))}
          </>
        )}

        <div className="mb-2">
          <label htmlFor="difficulty" className="mr-2">
            Difficulty:
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">1 (Easy)</option>
            <option value="2">2 (Medium)</option>
            <option value="3">3 (Hard)</option>
          </select>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}

function QuestionsList({ questions }: { questions: Question[] }) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortByDifficulty, setSortByDifficulty] = useState<"asc" | "desc">(
    "asc"
  );
  const [typeFilter, setTypeFilter] = useState<
    "all" | "open-ended" | "multi-choice"
  >("all"); // New state for type filter

  const filteredQuestions = questions.filter((q) => {
    // Category filter
    const categoryMatches =
      categoryFilter === "all" || q.category === categoryFilter;
    // Type filter
    const typeMatches = typeFilter === "all" || q.type === typeFilter;

    return categoryMatches && typeMatches;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    // Sorting by ID (existing functionality)
    if (sortOrder === "asc") return a.id - b.id;
    if (sortOrder === "desc") return b.id - a.id;

    // Sorting by difficulty (new logic)
    if (sortByDifficulty === "asc") {
      return a.difficulty - b.difficulty; // Sorting by difficulty (1 = Easy, 3 = Hard, ascending)
    }
    if (sortByDifficulty === "desc") {
      return b.difficulty - a.difficulty; // Sorting by difficulty (3 = Hard, 1 = Easy, descending)
    }

    return 0; // Default case
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Questions List</h2>

      <div className="mb-4">
        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          value={categoryFilter}
          className="p-2 border rounded mr-4"
        >
          <option value="all">All Categories</option>
          <option value="math">Math</option>
          <option value="football">Football</option>
        </select>

        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          className="p-2 border rounded mr-4"
        >
          <option value="asc">Sort by ID (Asc)</option>
          <option value="desc">Sort by ID (Desc)</option>
        </select>

        <select
          onChange={(e) =>
            setSortByDifficulty(e.target.value as "asc" | "desc")
          }
          value={sortByDifficulty}
          className="p-2 border rounded mr-4"
        >
          <option value="asc">Sort by Difficulty (Easy first)</option>
          <option value="desc">Sort by Difficulty (Hard first)</option>
        </select>

        <select
          onChange={(e) =>
            setTypeFilter(
              e.target.value as "all" | "open-ended" | "multi-choice"
            )
          }
          value={typeFilter}
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="open-ended">Open-ended</option>
          <option value="multi-choice">Multiple Choice</option>
        </select>
      </div>

      {sortedQuestions.length === 0 ? (
        <p>No questions added yet!</p>
      ) : (
        <ul className="space-y-2">
          {sortedQuestions.map((q) => (
            <li key={q.id} className="border p-2 rounded cursor-pointer">
              <Link to={`/question/${q.id}`}>
                <strong>{q.question}</strong> ({q.category}, {q.type},
                Difficulty: {q.difficulty})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QuestionDetails({
  questions,
  onDelete,
}: {
  questions: Question[];
  onDelete: (id: number) => void;
  onUpdate: (updatedQuestion: Question) => void;
}) {
  const { id } = useParams<{ id: string }>(); // Make sure to type the params
  const navigate = useNavigate();
  const question = questions.find((q) => q.id === Number(id));

  if (!question) return <p>Question not found!</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">{question.question}</h2>
      <p>Category: {question.category}</p>
      <p>Type: {question.type}</p>
      <p>Correct Answer: {question.correctAnswer}</p>
      {question.wrongAnswers && (
        <p>Wrong Answers: {question.wrongAnswers.join(", ")}</p>
      )}
      <p>Difficulty: {question.difficulty}</p>
      <button
        className="bg-red-500 text-white p-2 mt-4 rounded"
        onClick={() => {
          onDelete(question.id);
          navigate("/list");
        }}
      >
        Delete
      </button>
      <Link
        to={`/update/${question.id}`}
        className="bg-green-500 text-white p-2 mt-4 rounded ml-4"
      >
        Update
      </Link>
    </div>
  );
}

function UpdateQuestion({
  questions,
  onUpdate,
}: {
  questions: Question[];
  onUpdate: (updatedQuestion: Question) => void;
}) {
  const { id } = useParams<{ id: string }>(); // Use the correct useParams hook with typing
  const navigate = useNavigate();

  const question = questions.find((q) => q.id === Number(id));

  if (!question) return <p>Question not found!</p>;

  const [form, setForm] = useState({
    question: question.question,
    category: question.category,
    type: question.type,
    correctAnswer: question.correctAnswer,
    wrongAnswers: question.wrongAnswers || ["", "", ""],
    difficulty: question.difficulty,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWrongAnswerChange = (index: number, value: string) => {
    const updatedWrongAnswers = [...form.wrongAnswers];
    updatedWrongAnswers[index] = value;
    setForm((prev) => ({ ...prev, wrongAnswers: updatedWrongAnswers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.correctAnswer)
      return alert("Question and Correct Answer are required!");

    const updatedQuestion: Question = {
      ...question,
      question: form.question,
      category: form.category as "math" | "football",
      type: form.type as "multi-choice" | "open-ended",
      correctAnswer: form.correctAnswer,
      wrongAnswers:
        form.type === "multi-choice"
          ? form.wrongAnswers.filter(Boolean)
          : undefined,
      difficulty: Number(form.difficulty),
    };

    onUpdate(updatedQuestion);
    navigate(`/question/${updatedQuestion.id}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto flex">
      <div className="w-1/4 pr-4">
        <select
          name="category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="math">Math</option>
          <option value="football">Football</option>
        </select>
      </div>

      <div className="flex-1">
        <input
          type="text"
          name="question"
          placeholder="Enter question"
          value={form.question}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              name="type"
              value="open-ended"
              checked={form.type === "open-ended"}
              onChange={() => setForm({ ...form, type: "open-ended" })}
            />{" "}
            Open-ended
          </label>
          <label className="ml-4">
            <input
              type="checkbox"
              name="type"
              value="multi-choice"
              checked={form.type === "multi-choice"}
              onChange={() => setForm({ ...form, type: "multi-choice" })}
            />{" "}
            Multiple Choice
          </label>
        </div>

        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct answer"
          value={form.correctAnswer}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        {form.type === "multi-choice" && (
          <>
            {form.wrongAnswers.map((wrong, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Wrong answer ${idx + 1}`}
                value={wrong}
                onChange={(e) => handleWrongAnswerChange(idx, e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            ))}
          </>
        )}

        <div className="mb-2">
          <label htmlFor="difficulty" className="mr-2">
            Difficulty:
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">1 (Easy)</option>
            <option value="2">2 (Medium)</option>
            <option value="3">3 (Hard)</option>
          </select>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Update Question
        </button>
      </div>
    </div>
  );
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleAddQuestion = (q: Question) => {
    setQuestions([...questions, q]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  return (
    <Router>
      <nav className="p-4 bg-gray-200 mb-4">
        <Link to="/" className="mr-4">
          Add Question
        </Link>
        <Link to="/list">View Questions</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AddQuestion onAdd={handleAddQuestion} />} />
        <Route path="/list" element={<QuestionsList questions={questions} />} />
        <Route
          path="/question/:id"
          element={
            <QuestionDetails
              questions={questions}
              onDelete={handleDeleteQuestion}
              onUpdate={handleUpdateQuestion}
            />
          }
        />
        <Route
          path="/update/:id"
          element={
            <UpdateQuestion
              questions={questions}
              onUpdate={handleUpdateQuestion}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
