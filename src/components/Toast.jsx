import { CheckCircle2, X } from "lucide-react";

function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <div className="toast-content">
        <CheckCircle2 size={18} className="toast-icon" />
        <span>{message}</span>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
