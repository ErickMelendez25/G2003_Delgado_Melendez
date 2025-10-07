// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { AuthCtx } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthCtx);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    register(name, email, password);
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Correo</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
