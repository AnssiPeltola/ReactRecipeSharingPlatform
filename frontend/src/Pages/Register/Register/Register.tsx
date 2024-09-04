import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/authSlice";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      setErrorMessage("Salasanat eivät täsmää!");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, {
        email,
        password,
        nickname,
      });
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { email, password }
      );
      localStorage.setItem("sessionToken", response.data.token);
      dispatch(login({ sessionToken: response.data.token }));
      navigate("/register/register-details");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.message === "Email already in use") {
          setErrorMessage("Sähköposti on jo käytössä");
        } else if (error.response.data.message === "Nickname already in use") {
          setErrorMessage("Käyttäjänimi jo käytössä!");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrorMessage("");
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={1} maxStep={3} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Liity kokkaajien joukkoon!
        </h2>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            placeholder="Sähköposti"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            placeholder="Salasana"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={rePassword}
            onChange={handleInputChange(setRePassword)}
            placeholder="Salasana uudelleen"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={nickname}
            onChange={handleInputChange(setNickname)}
            placeholder="Käyttäjänimi"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Mennäänpäs eteenpäin!
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
