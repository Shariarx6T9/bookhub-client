import React from "react";

const ConfirmDialog = React.memo(({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--card)] rounded-xl p-6 max-w-md w-full border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-white/70 hover:text-white transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmDialog;