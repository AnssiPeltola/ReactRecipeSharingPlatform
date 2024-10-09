import React from "react";

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  if (!show) {
    return null;
  }

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleBackgroundClick}
      ></div>
      <div className="bg-white p-6 rounded shadow-lg z-10">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
