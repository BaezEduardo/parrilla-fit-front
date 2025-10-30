import { Outlet } from "react-router-dom";
import Topbar from "./components/layout/Topbar";
import ChatBubble from "./components/chat/ChatBubble";

export default function App() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Topbar />
      <main>
        <Outlet />
      </main>
      <ChatBubble />
    </div>
  );
}
