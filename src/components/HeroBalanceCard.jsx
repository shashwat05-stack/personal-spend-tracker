import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";

function HeroBalanceCard({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  const animatedBalance = useCountUp(balance);
  const animatedIncome = useCountUp(income);
  const animatedExpenses = useCountUp(expenses);

  // Generate real cumulative balance progression sparkline
  const buildSparklinePath = () => {
    if (!transactions || transactions.length < 2) {
      // Baseline path
      return {
        fillPath: "M 0 35 L 340 35 L 340 50 L 0 50 Z",
        linePath: "M 0 35 L 340 35"
      };
    }

    // Sort chronologically
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    let runningBalance = 0;
    const history = sorted.map((t) => {
      if (t.type === "income") runningBalance += Number(t.amount);
      else runningBalance -= Number(t.amount);
      return runningBalance;
    });

    const maxVal = Math.max(...history, 1);
    const minVal = Math.min(...history, 0);
    const range = maxVal - minVal || 1;

    const width = 340;
    const height = 40;
    const paddingY = 5;

    const points = history.map((val, index) => {
      const x = (index / (history.length - 1)) * width;
      // Invert Y axis for SVG (higher value = smaller Y)
      const normalizedY = (val - minVal) / range;
      const y = height - normalizedY * (height - paddingY * 2) - paddingY;
      return { x: Math.round(x), y: Math.round(y) };
    });

    let dLine = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      dLine += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const dFill = `${dLine} L ${width} 50 L 0 50 Z`;

    return { fillPath: dFill, linePath: dLine };
  };

  const { fillPath, linePath } = buildSparklinePath();

  return (
    <div className="hero-balance-card bento-hero-card">
      <div className="hero-cyan-glow"></div>
      <div className="hero-indigo-glow"></div>
      
      <div className="hero-card-header">
        <div className="hero-label-group">
          <div className="hero-wallet-badge">
            <Wallet size={20} className="hero-wallet-icon" />
          </div>
          <div>
            <span className="hero-eyebrow">AVAILABLE BALANCE</span>
            <div className="hero-update-status">
              <Clock size={12} /> Updated just now
            </div>
          </div>
        </div>

        <div className="hero-status-tag">
          {balance >= 0 ? (
            <span className="status-tag-positive">
              <ArrowUpRight size={14} /> Solvent
            </span>
          ) : (
            <span className="status-tag-negative">
              <ArrowDownRight size={14} /> Deficit
            </span>
          )}
        </div>
      </div>

      <div className="hero-main-amount">
        <h1 className="hero-balance-text">
          ₹{animatedBalance.toLocaleString("en-IN")}
        </h1>
      </div>

      {/* Dynamic Cumulative Balance Progression Sparkline */}
      <div className="sparkline-wrapper">
        <svg className="sparkline-svg" viewBox="0 0 340 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fintechRealSparklineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            className="sparkline-area"
            d={fillPath}
            fill="url(#fintechRealSparklineGrad)"
          />
          <path
            className="sparkline-stroke"
            d={linePath}
            fill="none"
            stroke="url(#fintechRealSparklineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="hero-footer-metrics">
        <div className="hero-metric-item income-item">
          <div className="metric-icon-circle green">
            <TrendingUp size={15} />
          </div>
          <div className="metric-text-group">
            <span className="metric-sublabel">Total Income</span>
            <span className="metric-val text-green">
              + ₹{animatedIncome.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="hero-metric-item expense-item">
          <div className="metric-icon-circle red">
            <TrendingDown size={15} />
          </div>
          <div className="metric-text-group">
            <span className="metric-sublabel">Total Expenses</span>
            <span className="metric-val text-red">
              − ₹{animatedExpenses.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBalanceCard;
