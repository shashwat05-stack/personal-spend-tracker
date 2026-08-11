import { useEffect, useRef, useState } from "react";
import "./App.css";

import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import HeroBalanceCard from "./components/HeroBalanceCard";
import QuickStatsStrip from "./components/QuickStatsStrip";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Analytics from "./components/Analytics";
import MonthlyChart from "./components/MonthlyChart";
import Budget from "./components/Budget";
import InsightsCard from "./components/InsightsCard";
import Toast from "./components/Toast";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Auth from "./components/Auth";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme !== null ? savedTheme === "true" : true;
  });

  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeleteTx, setPendingDeleteTx] = useState(null);

  const formRef = useRef(null);

  // =========================
  // AUTHENTICATION SUBSCRIPTION
  // =========================

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // LOGOUT HANDLER
  // =========================

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      showToast("Failed to logout");
      return;
    }

    setTransactions([]);
    setEditingTransaction(null);
    showToast("Logged out successfully");
  };

  // =========================
  // DARK MODE
  // =========================

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // =========================
  // LOAD USER TRANSACTIONS
  // =========================

  useEffect(() => {
    const loadTransactions = async () => {
      if (!session) {
        setTransactions([]);
        setLoadingTransactions(false);
        return;
      }

      setLoadingTransactions(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTransactions([]);
        setLoadingTransactions(false);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading transactions:", error);
        showToast("Failed to load transactions");
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }

      setLoadingTransactions(false);
    };

    loadTransactions();
  }, [session]);

  // =========================
  // TOAST
  // =========================

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);

    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  // =========================
  // SCROLL TO FORM
  // =========================

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // =========================
  // ADD TRANSACTION (WITH USER_ID)
  // =========================

  const addTransaction = async (transaction) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showToast("Please log in first");
      return;
    }

    const { id, created_at, ...transactionData } = transaction;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          ...transactionData,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      showToast("Failed to add transaction");
      return;
    }

    setTransactions((prevTransactions) => [
      data,
      ...prevTransactions,
    ]);

    showToast("✓ Transaction added successfully");
  };

  // =========================
  // DELETE
  // =========================

  const onRequestDelete = (transaction) => {
    setPendingDeleteTx(transaction);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteTx) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", pendingDeleteTx.id);

    if (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete transaction");
      return;
    }

    setTransactions((prevTransactions) =>
      prevTransactions.filter(
        (t) => t.id !== pendingDeleteTx.id
      )
    );

    showToast("✓ Transaction deleted successfully");

    setIsDeleteModalOpen(false);
    setPendingDeleteTx(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPendingDeleteTx(null);
  };

  // =========================
  // EDIT
  // =========================

  const startEditing = (transaction) => {
    setEditingTransaction(transaction);
    scrollToForm();
  };

  const updateTransaction = async (updatedTransaction) => {
    const { error } = await supabase
      .from("transactions")
      .update({
        type: updatedTransaction.type,
        description: updatedTransaction.description,
        amount: updatedTransaction.amount,
        category: updatedTransaction.category,
        date: updatedTransaction.date,
      })
      .eq("id", updatedTransaction.id);

    if (error) {
      console.error("Update error:", error);
      showToast("Failed to update transaction");
      return;
    }

    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    setEditingTransaction(null);

    showToast("✓ Transaction updated successfully");
  };

  // =========================
  // FILTER
  // =========================

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        transaction.type === filterType ||
        transaction.category === filterType;

      const matchesMonth =
        filterMonth === "all" ||
        transaction.date.startsWith(filterMonth);

      return (
        matchesSearch &&
        matchesType &&
        matchesMonth
      );
    }
  );

  if (authLoading) {
    return <div className="auth-loading">Loading SpendWise...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        transactionDescription={
          pendingDeleteTx
            ? pendingDeleteTx.description
            : ""
        }
      />

      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onAddClick={scrollToForm}
        onLogout={handleLogout}
      />

      <main className="container bento-dashboard-container">

        {/* Hero Balance */}
        <section className="bento-hero-section">
          <HeroBalanceCard transactions={transactions} />
          <SummaryCards transactions={transactions} />
        </section>

        {/* Quick Stats */}
        <QuickStatsStrip
          transactions={transactions}
        />

        {/* Form + Transactions */}
        <section className="content-grid">

          <TransactionForm
            addTransaction={addTransaction}
            editingTransaction={editingTransaction}
            updateTransaction={updateTransaction}
            formRef={formRef}
            showToast={showToast}
          />

          <TransactionList
            transactions={filteredTransactions}
            onRequestDelete={onRequestDelete}
            startEditing={startEditing}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            onAddClick={scrollToForm}
          />

        </section>

        {/* Analytics */}
        <section className="analytics-grid">
          <Analytics transactions={transactions} />
          <MonthlyChart transactions={transactions} />
        </section>

        {/* Budget + Insights */}
        <section className="bottom-bento-grid">
          <Budget transactions={transactions} />
          <InsightsCard transactions={transactions} />
        </section>

      </main>
    </div>
  );
}

export default App;
