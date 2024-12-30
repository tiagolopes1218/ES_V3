import React from "react";
import { useNavigate } from "react-router-dom";

const LoanStatus = () => {
  // Simulando o status do empréstimo
  const loanStatus = {
    approved: true, // Alterne entre true ou false para testar
    amount: 15000,
    term: "36 meses",
    interestRate: "5.2%",
  };

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Status do Empréstimo</h1>
      {loanStatus.approved ? (
        <div>
          <h2>✅ Empréstimo Aprovado!</h2>
          <p>
            <strong>Montante:</strong> €{loanStatus.amount}
          </p>
          <p>
            <strong>Prazo:</strong> {loanStatus.term}
          </p>
          <p>
            <strong>Taxa de Juros:</strong> {loanStatus.interestRate}
          </p>
        </div>
      ) : (
        <div>
          <h2>❌ Empréstimo Negado</h2>
          <p>
            Infelizmente, seu empréstimo não foi aprovado. Entre em contato
            conosco para mais informações.
          </p>
        </div>
      )}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default LoanStatus;