import React, { useContext, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { QuestionContext } from "../context/QuestionProvider";
import "../styles/QuestionStatisticsCharts.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const QuestionStatisticsCharts = () => {
  const questionContext = useContext(QuestionContext);
  if (!questionContext) throw new Error("QuestionContext not found");

  const { questions } = questionContext;

  // ... (previous code remains the same)

  // Difficulty Distribution with Color Logic
  const difficultyDistribution = useMemo(() => {
    const difficultyCounts = questions.reduce((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const distributionData = Object.entries(difficultyCounts)
      .map(([difficulty, value]) => ({
        name: `Difficulty ${difficulty}`,
        value,
        difficulty: parseInt(difficulty),
      }))
      .sort((a, b) => a.difficulty - b.difficulty);

    // Determine min and max counts for color coding
    const counts = distributionData.map((item) => item.value);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    // Add color logic
    return distributionData.map((item) => ({
      ...item,
      color:
        item.value === minCount
          ? "#FF6B6B" // Red for lowest count
          : item.value === maxCount
          ? "#4CAF50" // Green for highest count
          : "#8884d8", // Default color
    }));
  }, [questions]);

  return (
    <div className="question-statistics-charts">
      <div className="charts-container">
        {/* ... (previous charts remain the same) */}

        {/* Difficulty Distribution Chart */}
        <div>
          <h3>Questions by Difficulty</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={difficultyDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
              <Bar dataKey="value" fill="#8884d8">
                {difficultyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuestionStatisticsCharts;
