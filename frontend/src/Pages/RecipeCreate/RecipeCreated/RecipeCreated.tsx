import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeCreated = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    // Update the time left every second
    const timer = setTimeout(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    // Navigate to the page where the user came from when timeleft reaches 0
    if (timeLeft === 0) {
      navigate("/");
    }

    // Clear the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate, timeLeft]);

  return (
    <div className="container mx-auto p-4 max-w-lg text-center">
      <div className="text-2xl font-bold mb-4">Resepti luotu!</div>
      <div className="text-lg">
        Uudelleenohjataan etusivulle {timeLeft} sekunnin kuluttua
      </div>
    </div>
  );
};

export default RecipeCreated;
