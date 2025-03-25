import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="d-flex flex-column gap-2">
      <h1>404 Not Found</h1>
      <Link to="/questions">Go to questions</Link>
    </div>
  );
}

export default NotFoundPage;
