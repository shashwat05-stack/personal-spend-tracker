import { Wallet, Sun, Moon, Plus, LogOut } from "lucide-react";

function Header({ darkMode, setDarkMode, onAddClick, onLogout }) {

  return (
    <header className="header">

      <div className="header-content">

        <div className="brand-group">
          <div className="logo-badge">
            <Wallet size={22} className="logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">SpendWise</h1>
            <p className="subtitle">Personal Expense Tracker</p>
          </div>
        </div>

        <div className="header-actions">

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="theme-text">{darkMode ? "Light" : "Dark"}</span>
          </button>

          <button 
            className="add-btn"
            onClick={onAddClick}
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>

          <button
            className="logout-btn"
            onClick={onLogout}
            title="Log out of SpendWise"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

        </div>

      </div>

    </header>
  );
}

export default Header;
