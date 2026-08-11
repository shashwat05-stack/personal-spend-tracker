import { useEffect, useState } from "react";
import { Target, CheckCircle2, AlertTriangle, AlertCircle, Edit3 } from "lucide-react";

function Budget({ transactions }) {

  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    return savedBudget ? Number(savedBudget) : 20000;
  });

  const [budgetInput, setBudgetInput] = useState(budget);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  useEffect(() => {
    localStorage.setItem("monthlyBudget", budget);
  }, [budget]);

  // Current month YYYY-MM
  const currentMonth = new Date().toISOString().substring(0, 7);

  // Only expenses from current month
  const monthlyExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.date.startsWith(currentMonth)
    )
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const remaining = budget - monthlyExpenses;
  const percentage = budget > 0 ? (monthlyExpenses / budget) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);

  // Dynamic Ring Colors & Status
  let status = "safe";
  let strokeColor = "#16A34A"; // Green
  if (percentage >= 90) {
    status = "danger";
    strokeColor = "#EF4444"; // Red
  } else if (percentage >= 70) {
    status = "warning";
    strokeColor = "#F59E0B"; // Amber
  }

  // Circular Ring SVG math (Radius = 54 -> Perimeter = 2 * PI * 54 = 339.292)
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  const updateBudget = (e) => {
    e.preventDefault();
    if (budgetInput <= 0) {
      alert("Budget must be greater than 0");
      return;
    }
    setBudget(Number(budgetInput));
    setIsEditingBudget(false);
  };

  return (
    <div className="card budget-card bento-card">
      <div className="card-header-row">
        <div className="title-with-icon">
          <Target size={20} className="text-accent" />
          <div>
            <h2>Monthly Budget</h2>
            <p className="card-subtitle">Spending limit for current month</p>
          </div>
        </div>

        <button
          className="budget-edit-trigger"
          onClick={() => setIsEditingBudget(!isEditingBudget)}
        >
          <Edit3 size={14} /> {isEditingBudget ? "Close" : "Edit Target"}
        </button>
      </div>

      {isEditingBudget && (
        <form className="budget-form-overlay" onSubmit={updateBudget}>
          <div className="budget-input-group">
            <span className="input-prefix-sm">₹</span>
            <input
              type="number"
              className="modern-input"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Enter monthly target..."
            />
            <button type="submit" className="set-budget-btn">
              Save Budget
            </button>
          </div>
        </form>
      )}

      <div className="budget-content-grid">
        {/* SVG Circular Progress Ring */}
        <div className="circular-ring-wrapper">
          <svg className="ring-svg" width="140" height="140" viewBox="0 0 140 140">
            {/* Background Track Circle */}
            <circle
              className="ring-bg"
              cx="70"
              cy="70"
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <circle
              className="ring-progress"
              cx="70"
              cy="70"
              r={radius}
              strokeWidth={strokeWidth}
              stroke={strokeColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="ring-center-content">
            <span className="ring-percentage" style={{ color: strokeColor }}>
              {percentage.toFixed(0)}%
            </span>
            <span className="ring-label">SPENT</span>
          </div>
        </div>

        {/* Budget Stats Breakdown */}
        <div className="budget-stats-column">
          <div className="budget-stat-box">
            <span className="stat-label">Budget</span>
            <strong className="stat-value">₹{budget.toLocaleString("en-IN")}</strong>
          </div>

          <div className="budget-stat-box">
            <span className="stat-label">Spent</span>
            <strong className="stat-value text-red">₹{monthlyExpenses.toLocaleString("en-IN")}</strong>
          </div>

          <div className="budget-stat-box">
            <span className="stat-label">Remaining</span>
            <strong className={`stat-value ${remaining < 0 ? "text-red" : "text-green"}`}>
              ₹{remaining.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>

      {/* Threshold Status Banner */}
      <div className={`budget-status-banner banner-${status}`}>
        {status === "danger" ? (
          <>
            <AlertCircle size={18} className="banner-icon" />
            <span>⚠️ You've exceeded your monthly budget.</span>
          </>
        ) : status === "warning" ? (
          <>
            <AlertTriangle size={18} className="banner-icon" />
            <span>⚡ Keep an eye on your spending ({percentage.toFixed(0)}% used).</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={18} className="banner-icon" />
            <span>You're comfortably within your budget.</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Budget;
