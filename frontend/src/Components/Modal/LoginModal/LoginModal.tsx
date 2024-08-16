import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./LoginModal.css";

Modal.setAppElement("#root"); // replace '#root' with the id of your app's root element

function LoginModal({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.message === "Login successful") {
        localStorage.setItem("sessionToken", response.data.token);
        window.location.reload();
      } else {
        setLoginStatus("Login failed. Please check your email and password.");
      }
    } catch (error) {
      console.error(error);
      setLoginStatus("Login failed. Please check your email and password.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
    >
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div>
            <input
              type="submit"
              value="Login"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            />
          </div>
        </form>
        <button
          onClick={onRequestClose}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-200"
        >
          Cancel
        </button>
        <p className="text-red-500 mt-4">{loginStatus}</p>
      </div>
    </Modal>
  );
}

export default LoginModal;
