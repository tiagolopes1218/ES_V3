import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook de navegação
import axios from "axios";

const LoanSimulator = () => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [loanId, setLoanId] = useState(null);
  const [loanStatus, setLoanStatus] = useState(null);
  const [loanIdInput, setLoanIdInput] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate(); // Hook para navegação

  const handleSimulate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuário não autenticado. Faça login.");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/simulate/",
        { amount, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSimulationResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao simular. Verifique os dados.");
    }
  };

  const handleSubmitLoanRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuário não autenticado. Faça login.");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/loans/",
        { amount, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoanId(response.data.loanId);
      alert(`Pedido submetido com sucesso! ID: ${response.data.loanId}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao submeter o pedido.");
    }
  };

  const handleCheckLoanStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuário não autenticado. Faça login.");

    try {
      const response = await axios.get(
        `http://localhost:8000/api/loans/${loanIdInput}/status/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoanStatus(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao verificar o status do pedido.");
    }
  };
  
  const [uploadLoanId, setUploadLoanId] = useState("");

  const handleUploadDocument = async () => {
    if (!file) return alert("Por favor, selecione um arquivo.");
    if (!uploadLoanId) return alert("Por favor, informe o ID do pedido de empréstimo.");

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuário não autenticado. Faça login.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("loan_id", uploadLoanId);

    try {
      const response = await axios.post("http://localhost:8000/api/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Documento enviado com sucesso!");
    } catch (error) {
      console.error(error.response);
      alert("Erro ao enviar o documento.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token
    setAmount("");
    setDuration("");
    setSimulationResult(null);
    setLoanId(null);
    setLoanStatus(null);
    setLoanIdInput("");
    alert("Logout realizado com sucesso!");
    navigate("/login"); // Redireciona para a página de login
  };

  const monthlyInstallment = amount && duration ? (amount / duration).toFixed(2) : "-";
  
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Simulador de Empréstimos</h1>

      {/* Simular */}
      <form onSubmit={handleSimulate}>
        <input
          type="number"
          placeholder="Valor do Empréstimo"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duração (meses)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button type="submit">Simular</button>
      </form>

      <div>
        <h3>Parcela Mensal:</h3>
        <p>€{monthlyInstallment}</p>
      </div>

      {simulationResult && (
        <div>
          <h3>Resultado da Simulação:</h3>
          <p>Resultado: {simulationResult.result}</p>
          <p>Valor: €{amount}</p>
          <p>Duração: {duration} meses</p>
        </div>
      )}

      {/* Submeter */}
      <button onClick={handleSubmitLoanRequest}>Submeter Pedido de Empréstimo</button>
      {loanId && <p>Pedido submetido! ID: {loanId}</p>}

      {/* Verificar Status */}
      <input
        type="text"
        placeholder="ID do Empréstimo"
        value={loanIdInput}
        onChange={(e) => setLoanIdInput(e.target.value)}
      />
      <button onClick={handleCheckLoanStatus}>Verificar Status do Pedido</button>

      {loanStatus && (
        <div>
          <h3>Detalhes do Pedido:</h3>
          <p>ID: {loanStatus.loanId}</p>
          <p>Status: {loanStatus.status}</p>
          <p>Valor: €{loanStatus.amount}</p>
          <p>Duração: {loanStatus.duration} meses</p>
          <p>Criado em: {loanStatus.created_at}</p>
          <p>Atualizado em: {loanStatus.updated_at}</p>
        </div>
      )}

      {/* Upload de Documento */}
      <div style={{ marginTop: "20px" }}>
        <h3>Enviar Documento</h3>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="number"
          placeholder="ID do Pedido de Empréstimo"
          value={uploadLoanId}
          onChange={(e) => setUploadLoanId(e.target.value)}
        />
        <button onClick={handleUploadDocument}>Enviar Documento</button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
      >
        Logout
      </button>
    </div>
  );
};

export default LoanSimulator;
