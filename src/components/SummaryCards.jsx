import { TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";

function SummaryCards({ transactions }) {
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const income = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const animatedIncome = useCountUp(income);
  const animatedExpenses = useCountUp(expenses);
  const animatedCount = useCountUp(transactions.length);

  const expensePercentage =
    income > 0 ? ((expenses / income) * 100).toFixed(1) : "0.0";

  return (
    <div className="summary-bento-grid">
      {/* TOTAL INCOME */}
      <div className="summary-card income-summary-card">
        <div className="summary-card-top">
          <div>
            <span className="summary-card-label">TOTAL INCOME</span>
            <h2 className="summary-card-number text-green">
              ₹{animatedIncome.toLocaleString("en-IN")}
            </h2>
          </div>
          <div className="summary-card-icon-box green">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="summary-card-footer">
          <span className="summary-trend-text text-green">
            ↗ {incomeTransactions.length}{" "}
            {incomeTransactions.length === 1 ? "income transaction" : "income transactions"}
          </span>
        </div>
      </div>

      {/* TOTAL EXPENSES */}
      <div className="summary-card expense-summary-card">
        <div className="summary-card-top">
          <div>
            <span className="summary-card-label">TOTAL EXPENSES</span>
            <h2 className="summary-card-number text-red">
              ₹{animatedExpenses.toLocaleString("en-IN")}
            </h2>
          </div>
          <div className="summary-card-icon-box red">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="summary-card-footer">
          <span className="summary-trend-text text-red">
            ↘ {expenseTransactions.length}{" "}
            {expenseTransactions.length === 1 ? "expense transaction" : "expense transactions"}
            {income > 0 && ` • ${expensePercentage}% of income`}
          </span>
        </div>
      </div>

      {/* TOTAL TRANSACTIONS */}
      <div className="summary-card total-summary-card">
        <div className="summary-card-top">
          <div>
            <span className="summary-card-label">TOTAL TRANSACTIONS</span>
            <h2 className="summary-card-number text-purple">
              {animatedCount}
            </h2>
          </div>
          <div className="summary-card-icon-box purple">
            <Receipt size={20} />
          </div>
        </div>

        <div className="summary-card-footer">
          <span className="summary-trend-text text-purple">
            All recorded transactions
          </span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
