import { Search, Calendar, Filter, Pencil, Trash2, Wallet, Plus, Inbox } from "lucide-react";
import { getCategoryStyle, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/categoryStyles";
import { formatDate } from "../utils/formatters";

function TransactionList({
  transactions,
  onRequestDelete,
  startEditing,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterMonth,
  setFilterMonth,
  onAddClick
}) {

  return (
    <div className="card transaction-list-card bento-card">

      {/* Header & Filter Controls */}
      <div className="list-card-header">
        <div className="list-title-group">
          <h2>Recent Transactions</h2>
          <span className="count-pill">{transactions.length} items</span>
        </div>

        <div className="filter-controls">
          <div className="pill-control-wrapper">
            <Filter size={14} className="control-icon" />
            <select
              className="pill-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types & Categories</option>
              <option value="income">Type: Income</option>
              <option value="expense">Type: Expense</option>
              <optgroup label="Expense Categories">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Income Categories">
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="pill-control-wrapper">
            <Calendar size={14} className="control-icon" />
            <select
              className="pill-select"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="all">All Months</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="search-box-container">
        <Search size={18} className="search-box-icon" />
        <input
          type="text"
          className="search-box-input"
          placeholder="🔍 Search transactions by description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
            ✕
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="transactions-rows-container">

        {transactions.length === 0 ? (

          <div className="empty-state-card">
            <div className="empty-icon-circle">
              <Inbox size={32} />
            </div>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to start tracking your finances.</p>
            {onAddClick && (
              <button className="empty-add-btn" onClick={onAddClick}>
                <Plus size={16} /> Add Transaction
              </button>
            )}
          </div>

        ) : (

          transactions.map((transaction) => {
            const isIncome = transaction.type === "income";
            
            // Safe category migration display: if income has expense category stored, display as "Other"
            let displayCategory = transaction.category;
            if (isIncome && EXPENSE_CATEGORIES.includes(transaction.category) && transaction.category !== "Other") {
              displayCategory = "Other";
            }

            const styleInfo = getCategoryStyle(displayCategory);
            const LucideIcon = styleInfo.LucideIcon || Wallet;
            const formattedDate = formatDate(transaction.date);

            return (
              <div
                className="transaction-mini-row"
                key={transaction.id}
              >

                <div className="row-left">
                  <div
                    className="row-icon-badge"
                    style={{
                      backgroundColor: isIncome ? "rgba(22, 163, 74, 0.14)" : `${styleInfo.color}18`,
                      color: isIncome ? "#16A34A" : styleInfo.color
                    }}
                  >
                    <LucideIcon size={18} />
                  </div>

                  <div className="row-details">
                    <h4 className="row-description">
                      {transaction.description}
                    </h4>

                    <div className="row-meta">
                      {/* Colored Category Badge */}
                      <span
                        className="colored-category-badge"
                        style={{
                          backgroundColor: `${styleInfo.color}18`,
                          color: styleInfo.color,
                          borderColor: `${styleInfo.color}35`
                        }}
                      >
                        {displayCategory}
                      </span>
                      <span className="meta-sep">•</span>
                      <span className="meta-date">{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="row-right">
                  <span className={`row-amount ${isIncome ? "income-amount" : "expense-amount"}`}>
                    {isIncome ? (
                      <>+₹{Number(transaction.amount).toLocaleString("en-IN")}</>
                    ) : (
                      <>−₹{Number(transaction.amount).toLocaleString("en-IN")}</>
                    )}
                  </span>

                  <div className="row-actions">
                    <button
                      className="row-action-btn edit-btn-style"
                      onClick={() => startEditing(transaction)}
                      title="Edit transaction"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="row-action-btn delete-btn-style"
                      onClick={() => onRequestDelete(transaction)}
                      title="Delete transaction"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}

export default TransactionList;
