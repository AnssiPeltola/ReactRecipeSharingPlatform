import React from "react";

interface ProgressBarProps {
  currentStep: number;
  maxStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, maxStep }) => {
  return (
    <div className="flex justify-between mb-4">
      {Array.from({ length: maxStep }).map((_, index) => (
        <div
          key={index}
          className={`w-full h-2 bg-gray-300 rounded-full mr-2 ${
            currentStep >= index + 1 ? "bg-yellow-400" : ""
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
