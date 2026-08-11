import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getCategoryStyle } from "../utils/categoryStyles";
import { PieChart as PieIcon } from "lucide-react";

function Analytics({ transactions }) {

  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};
  let totalSpent = 0;

  expenses.forEach((transaction) => {
    const amt = Number(transaction.amount);
    totalSpent += amt;
    if (categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] += amt;
    } else {
      categoryTotals[transaction.category] = amt;
    }
  });

  // Sort categories by highest spending amount descending
  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : "0.0"
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-title">{data.name}</p>
          <p className="tooltip-value">₹{data.value.toLocaleString("en-IN")}</p>
          <p className="tooltip-sub">{data.percentage}% of total spent</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-card bento-card">
      <div className="card-header-row">
        <div className="title-with-icon">
          <PieIcon size={18} className="text-accent" />
          <h2>Spending by Category</h2>
        </div>
        <span className="card-badge">Breakdown</span>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty-state">
          <div className="empty-chart-box">
            <h3>No spending data yet</h3>
            <p>Add an expense to see your spending breakdown.</p>
          </div>
        </div>
      ) : (
        <div className="donut-analytics-wrapper">
          {/* Compact Donut Diagram */}
          <div className="donut-chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={getCategoryStyle(entry.name).color}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Overlay */}
            <div className="donut-center-label">
              <span className="center-amount">
                ₹{totalSpent.toLocaleString("en-IN")}
              </span>
              <span className="center-text">TOTAL SPENT</span>
            </div>
          </div>

          {/* Sorted Custom Legend List */}
          <div className="donut-custom-legend">
            {chartData.map((entry) => {
              const catStyle = getCategoryStyle(entry.name);
              return (
                <div key={entry.name} className="legend-row-item">
                  <div className="legend-left">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: catStyle.color }}
                    ></span>
                    <span className="legend-name">{entry.name}</span>
                  </div>
                  <div className="legend-right">
                    <span className="legend-amount">
                      ₹{entry.value.toLocaleString("en-IN")}
                    </span>
                    <span className="legend-percent">{entry.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
