import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState("login");

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Button className={tab === "login" ? "active" : ""} onClick={()=>setTab("login")}>Iniciar sesión</Button>
        <Button className={tab === "register" ? "active" : ""} onClick={()=>setTab("register")}>Crear cuenta</Button>
      </div>
      {tab === "login" ? (
        <LoginForm onSuccess={onClose} />
      ) : (
        <RegisterForm onSuccess={onClose} />
      )}
    </Modal>
  );
}
