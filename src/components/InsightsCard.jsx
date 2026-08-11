import { Lightbulb, Sparkles, TrendingDown, Target, Wallet, Award } from "lucide-react";
import { getCategoryStyle } from "../utils/categoryStyles";

function InsightsCard({ transactions }) {
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthName = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  
  const savedBudget = localStorage.getItem("monthlyBudget");
  const budget = savedBudget ? Number(savedBudget) : 20000;

  // Monthly Expenses
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetPercentage = budget > 0 ? ((monthlyExpenses / budget) * 100).toFixed(0) : "0";
  const remainingBudget = budget - monthlyExpenses;

  // Category Totals for Highest Category calculation
  const categoryTotals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });

  let topCategory = null;
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategoryAmount) {
      topCategoryAmount = amt;
      topCategory = cat;
    }
  });

  const topCategoryStyle = topCategory ? getCategoryStyle(topCategory) : null;

  return (
    <div className="card insights-card bento-card">
      <div className="card-header-row">
        <div className="title-with-icon">
          <Sparkles size={18} className="text-amber" />
          <h2>Spending Insights</h2>
        </div>
        <span className="card-badge gold-badge">
          <Lightbulb size={12} /> Live Analysis
        </span>
      </div>

      <div className="insights-grid">
        {/* Insight 1: TOP CATEGORY */}
        <div className="insight-item">
          <div className="insight-icon-box orange">
            <Award size={18} />
          </div>
          <div className="insight-text-group">
            <span className="insight-title">TOP CATEGORY</span>
            <p className="insight-value-text">
              {topCategory ? (
                <>
                  {topCategoryStyle.icon} {topCategory}
                </>
              ) : (
                "None yet"
              )}
            </p>
            <span className="insight-support-text">
              {topCategory ? `₹${topCategoryAmount.toLocaleString("en-IN")}` : "No expenses logged"}
            </span>
          </div>
        </div>

        {/* Insight 2: MONTHLY SPENDING */}
        <div className="insight-item">
          <div className="insight-icon-box blue">
            <TrendingDown size={18} />
          </div>
          <div className="insight-text-group">
            <span className="insight-title">MONTHLY SPENDING</span>
            <p className="insight-value-text">
              ₹{monthlyExpenses.toLocaleString("en-IN")}
            </p>
            <span className="insight-support-text">{monthName}</span>
          </div>
        </div>

        {/* Insight 3: BUDGET UTILIZATION */}
        <div className="insight-item">
          <div className="insight-icon-box purple">
            <Target size={18} />
          </div>
          <div className="insight-text-group">
            <span className="insight-title">BUDGET UTILIZATION</span>
            <p className="insight-value-text">{budgetPercentage}%</p>
            <span className="insight-support-text">of monthly budget</span>
          </div>
        </div>

        {/* Insight 4: REMAINING */}
        <div className="insight-item">
          <div className="insight-icon-box green">
            <Wallet size={18} />
          </div>
          <div className="insight-text-group">
            <span className="insight-title">REMAINING</span>
            <p className="insight-value-text">
              ₹{remainingBudget.toLocaleString("en-IN")}
            </p>
            <span className="insight-support-text">available budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightsCard;
