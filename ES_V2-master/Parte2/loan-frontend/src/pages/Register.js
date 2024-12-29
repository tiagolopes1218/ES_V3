import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se o nome de usuário já está registrado
    if (localStorage.getItem(username)) {
      setError("Usuário já existe. Tente outro.");
    } else {
      // Armazena o nome de usuário e senha no localStorage
      localStorage.setItem(username, password);
      setError("");
      navigate("/login"); // Redireciona para a página de login
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Criar Conta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Usuário"
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
          Criar Conta
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default Register;
