import React from "react";

interface RecipeDeleteConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RecipeDeleteConfirmModal: React.FC<RecipeDeleteConfirmModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-lg z-10">
        <h2 className="text-xl font-semibold mb-4">Vahvista poisto</h2>
        <p className="mb-4">
          Haluatko varmasti poistaa tämän reseptin? Tätä toimintoa ei voi
          peruuttaa.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
          >
            Ei, jätä resepti
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
          >
            Kyllä, poista resepti
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDeleteConfirmModal;
