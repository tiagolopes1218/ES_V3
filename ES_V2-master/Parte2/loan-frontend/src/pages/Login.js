import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Login tradicional com nome de utilizador e senha
  const handleTraditionalLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      setError("");
      navigate("/simulator");
    } catch (err) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  // Login com reconhecimento facial
  const handleFaceLogin = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Por favor, capture uma imagem antes de continuar.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/face-login/", {
        image: imageSrc.split(",")[1], // Remove o prefixo "data:image/jpeg;base64,"
      });

      const { access, refresh } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      setMessage("Rosto reconhecido. Login efetuado com sucesso!");
      navigate("/simulator");
    } catch (err) {
      setMessage(err.response?.data?.error || "Falha ao reconhecer o rosto. Tente novamente.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Login</h1>

      <form onSubmit={handleTraditionalLogin}>
        <div>
          <input
            type="text"
            placeholder="Nome de utilizador"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "10px", marginBottom: "10px", width: "200px" }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", marginBottom: "20px", width: "200px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <h2>Ou faça login com reconhecimento facial</h2>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        ref={webcamRef}
        style={{ marginBottom: "10px" }}
      />
      <button
        onClick={handleFaceLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login com Reconhecimento Facial
      </button>
      {message && <p style={{ marginTop: "10px", color: message.includes("sucesso") ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default Login;
