import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Usuário não autenticado. Faça login.");
        navigate("/employee-login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/requests/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        alert("Erro ao buscar pedidos.");
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleInterviewSchedule = (requestId) => {
    // Lógica para marcar a entrevista
    alert(`Entrevista marcada para o pedido ID: ${requestId}`);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Página de Funcionários</h1>
      {requests.length > 0 ? (
        <div>
          {requests.map((req) => (
            <div key={req.id} style={{ margin: "20px", border: "1px solid #ccc", padding: "10px" }}>
              <p><strong>Usuário:</strong> {req.user}</p>
              <p><strong>Valor do Empréstimo:</strong> €{req.amount}</p>
              <button
                onClick={() => handleInterviewSchedule(req.id)}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Marcar Entrevista
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Nenhum pedido encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
