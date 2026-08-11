import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { BarChart3 } from "lucide-react";

function MonthlyChart({ transactions }) {

  const monthlyData = {};

  transactions.forEach((transaction) => {
    const monthKey = transaction.date.substring(0, 7);
    const amount = Number(transaction.amount);

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        income: 0,
        expense: 0
      };
    }

    if (transaction.type === "income") {
      monthlyData[monthKey].income += amount;
    } else {
      monthlyData[monthKey].expense += amount;
    }
  });

  const chartData = Object.values(monthlyData).sort(
    (a, b) => a.month.localeCompare(b.month)
  );

  const formatMonthLabel = (monthStr) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1, 1);
    return dateObj.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-title">{formatMonthLabel(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontWeight: 600, fontSize: "13px" }}>
              {entry.name}: ₹{Number(entry.value).toLocaleString("en-IN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-card bento-card">
      <div className="card-header-row">
        <div className="title-with-icon">
          <BarChart3 size={18} className="text-primary" />
          <h2>Income vs Expenses</h2>
        </div>
        <span className="card-badge">Monthly Comparison</span>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty-state">
          <div className="empty-chart-box">
            <h3>No transaction history yet</h3>
            <p>Add transactions across dates to visualize monthly trends.</p>
          </div>
        </div>
      ) : (
        <div className="monthly-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
              <XAxis
                dataKey="month"
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => {
                  const [y, m] = val.split("-");
                  const d = new Date(Number(y), Number(m) - 1, 1);
                  return d.toLocaleString("en-US", { month: "short" });
                }}
              />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
              <Bar
                dataKey="income"
                name="Income"
                fill="#16A34A"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill="#EF4444"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MonthlyChart;
