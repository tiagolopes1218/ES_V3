import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true); // Ativar carregamento
    setError(""); // Limpar mensagens de erro anteriores

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      setError("");
      navigate("/employee-dashboard");
    } catch (err) {
      console.error("Erro na autenticação:", err); // Log do erro para depuração
      setError("Credenciais inválidas. Por favor, tente novamente.");
    } finally {
      setIsLoading(false); // Desativar carregamento
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Login de Funcionários</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Nome de utilizador (ex: user123)"
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
            backgroundColor: isLoading ? "#6c757d" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default EmployeeLogin;
