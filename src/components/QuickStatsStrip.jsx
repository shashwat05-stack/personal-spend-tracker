import { CalendarDays, Flame, Maximize2, PiggyBank } from "lucide-react";

function QuickStatsStrip({ transactions }) {
  // Use actual local date string YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  
  const todayStr = `${year}-${month}-${day}`;
  const currentMonth = `${year}-${month}`;
  const elapsedDaysInMonth = Math.max(1, now.getDate());

  const expenses = transactions.filter((t) => t.type === "expense");
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenseSum = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // Today's spending (expenses logged on user's current local date)
  const todaysSpending = transactions
    .filter((t) => t.type === "expense" && t.date === todayStr)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Monthly expenses for current local month
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  // Average daily spend = current month expenses / elapsed days in current month
  const avgDailySpend = Math.round(monthlyExpenses / elapsedDaysInMonth);

  // Largest single expense transaction
  const largestExpense = expenses.length > 0
    ? Math.max(...expenses.map((t) => Number(t.amount)))
    : 0;

  // Savings rate = ((income - expenses) / income) * 100
  const savingsRateVal = income > 0 ? ((income - totalExpenseSum) / income) * 100 : 0;
  const savingsRate = Math.max(0, savingsRateVal).toFixed(1);

  return (
    <div className="quick-stats-strip">
      <div className="quick-stat-item">
        <div className="quick-stat-icon blue">
          <CalendarDays size={16} />
        </div>
        <div className="quick-stat-content">
          <span className="quick-stat-label">TODAY'S SPENDING</span>
          <span className="quick-stat-value">₹{todaysSpending.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="quick-stat-item">
        <div className="quick-stat-icon orange">
          <Flame size={16} />
        </div>
        <div className="quick-stat-content">
          <span className="quick-stat-label">AVERAGE DAILY SPEND</span>
          <span className="quick-stat-value">₹{avgDailySpend.toLocaleString("en-IN")} / day</span>
        </div>
      </div>

      <div className="quick-stat-item">
        <div className="quick-stat-icon red">
          <Maximize2 size={16} />
        </div>
        <div className="quick-stat-content">
          <span className="quick-stat-label">LARGEST EXPENSE</span>
          <span className="quick-stat-value">₹{largestExpense.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="quick-stat-item">
        <div className="quick-stat-icon green">
          <PiggyBank size={16} />
        </div>
        <div className="quick-stat-content">
          <span className="quick-stat-label">SAVINGS RATE</span>
          <span className="quick-stat-value">{savingsRate}%</span>
        </div>
      </div>
    </div>
  );
}

export default QuickStatsStrip;
