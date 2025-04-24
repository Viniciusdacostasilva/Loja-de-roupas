import React from "react";

interface WarningAlertProps {
  message: string;
  onClose: () => void;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-background-black text-black dark:text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-center text-lg font-semibold">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningAlert;