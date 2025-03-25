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

  // Category Distribution
  const categoryDistribution = useMemo(() => {
    const categoryCounts = questions.reduce((acc, question) => {
      acc[question.category] = (acc[question.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [questions]);

  // Question Type Distribution
  const typeDistribution = useMemo(() => {
    const typeCounts = questions.reduce((acc, question) => {
      acc[question.type] = (acc[question.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [questions]);

  // Difficulty Distribution
  const difficultyDistribution = useMemo(() => {
    const difficultyCounts = questions.reduce((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(difficultyCounts)
      .map(([name, value]) => ({
        name: `Difficulty`,
        value,
      }))
      .sort(
        (a, b) =>
          parseInt(a.name.split(" ")[1]) - parseInt(b.name.split(" ")[1])
      );
  }, [questions]);

  // Custom Legend for Pie Chart
  const CustomPieLegend = ({ payload }: any) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginTop: "-10px",
        }}
      >
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "2px 0",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: entry.color,
                marginRight: "5px",
              }}
            />
            {entry.value}
          </div>
        ))}
      </div>
    );
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = categoryDistribution.reduce(
        (sum, item) => sum + item.value,
        0
      );
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <p>{`${data.name}: ${data.value} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="question-statistics-charts">
      <div className="charts-container">
        {/* Category Distribution Chart */}
        <div>
          <h3>Questions by Category</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={false}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                content={<CustomPieLegend />}
                layout="vertical"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Question Type Distribution Chart */}
        <div>
          <h3>Questions by Type</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={typeDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Distribution Chart */}
        <div>
          <h3>Questions by Difficulty</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={difficultyDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuestionStatisticsCharts;
