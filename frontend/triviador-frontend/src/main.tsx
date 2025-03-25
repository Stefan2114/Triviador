import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import QuestionsPage from "./pages/QuestionsPage.tsx";
import QuestionPage from "./pages/QuestionPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import { QuestionProvider } from "./context/QuestionProvider.tsx";
import AddQuestionPage from "./pages/AddQuestionPage.tsx";
import EditQuestionPage from "./pages/EditQuestionPage.tsx";

const router = createBrowserRouter([
  {
    path: "/questions",
    element: <QuestionsPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "questions/:id",
    element: <QuestionPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "questions/add",
    element: <AddQuestionPage />,
    errorElement: <NotFoundPage />,
  },

  {
    path: "/questions/edit/:id",
    element: <EditQuestionPage />,
    errorElement: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QuestionProvider>
      <RouterProvider router={router} />
    </QuestionProvider>
  </StrictMode>
);
