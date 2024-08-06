import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const nicknameCheck = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/check-nickname`,
        { params: { nickname } }
      );
      if (nicknameCheck.data.exists) {
        alert("Nickname already in use!");
        return;
      }
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
      console.log(response.data);
      navigate("/register-details");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
        placeholder="Re-enter Password"
        required
      />
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
