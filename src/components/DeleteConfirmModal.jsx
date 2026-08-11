import { AlertTriangle, X } from "lucide-react";

function DeleteConfirmModal({ isOpen, onConfirm, onCancel, transactionDescription }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-danger-icon">
              <AlertTriangle size={20} />
            </div>
            <h3>Delete transaction?</h3>
          </div>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to delete {transactionDescription ? <strong>"{transactionDescription}"</strong> : "this transaction"}? This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
