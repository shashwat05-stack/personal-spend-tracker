import { useEffect, useState } from "react";
import { PlusCircle, Save, Tag, Calendar, FileText, IndianRupee, Layers } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/categoryStyles";

function TransactionForm({
  addTransaction,
  editingTransaction,
  updateTransaction,
  formRef,
  showToast
}) {

  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount);

      const validCategories = editingTransaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      if (validCategories.includes(editingTransaction.category)) {
        setCategory(editingTransaction.category);
      } else {
        // Fallback for legacy income items with expense categories
        setCategory(editingTransaction.type === "income" ? "Salary" : "Food");
      }

      setDate(editingTransaction.date);
    }
  }, [editingTransaction]);

  const handleTypeChange = (newType) => {
    if (type === newType) return;
    setType(newType);

    if (newType === "income") {
      setCategory("Salary");
    } else {
      setCategory("Food");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !amount || !date) {
      if (showToast) showToast("Please fill all required fields");
      return;
    }

    const transactionData = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      type,
      description,
      amount: Number(amount),
      category,
      date
    };

    if (editingTransaction) {
      updateTransaction(transactionData);
      if (showToast) showToast("✓ Transaction updated successfully");
    } else {
      addTransaction(transactionData);
      if (showToast) showToast("✓ Transaction added successfully");
    }

    // Reset form after submission
    setType("expense");
    setDescription("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };

  return (
    <div className="card form-card bento-card" ref={formRef}>
      <div className="card-header">
        <h2>
          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
        </h2>
        <span className="card-header-badge">
          {editingTransaction ? "Updating" : "Create"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">

        {/* Segmented Type Control */}
        <div className="form-group">
          <label className="form-label">
            <Layers size={14} className="label-icon" /> Transaction Type
          </label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${type === "expense" ? "selected-expense" : ""}`}
              onClick={() => handleTypeChange("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`segmented-btn ${type === "income" ? "selected-income" : ""}`}
              onClick={() => handleTypeChange("income")}
            >
              Income
            </button>
          </div>
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            <FileText size={14} className="label-icon" /> Description
          </label>
          <input
            id="description"
            type="text"
            className="modern-input"
            placeholder="e.g. Grocery shopping, Monthly salary..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Amount Field with Prefix */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            <IndianRupee size={14} className="label-icon" /> Amount
          </label>
          <div className="input-prefix-wrapper">
            <span className="currency-prefix-symbol">₹</span>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="any"
              className="modern-input prefixed-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            <Tag size={14} className="label-icon" /> Category
          </label>
          <select
            id="category"
            className="modern-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            <Calendar size={14} className="label-icon" /> Date
          </label>
          <input
            id="date"
            type="date"
            className="modern-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button className="submit-btn form-submit-gradient" type="submit">
          {editingTransaction ? (
            <>
              <Save size={18} /> Update Transaction
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Add Transaction
            </>
          )}
        </button>

      </form>
    </div>
  );
}

export default TransactionForm;
