import { useEffect, useState } from "react";
import Hero from "./components/Hero.jsx";
import Section from "./components/Section.jsx";
import { getMenu } from "./lib/api.js";
import TopBar from "./components/TopBar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ChangePasswordModal from "./components/ChangePasswordModal.jsx";
import PreferencesModal from "./components/PreferencesModal.jsx";

export default function App() {
  //estados
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [menu, setMenu] = useState(null);
  const [user, setUser] = useState(null); // placeholder auth
  const [error, setError] = useState("");
  const [pwdOpen, setPwdOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);


  useEffect(() => {
    getMenu()
      .then(setMenu)
      .catch(() => setError("No se pudo cargar el menú"));
  }, []);

  if (error) return <div className="container error">{error}</div>;
  if (!menu) return <div className="container">Cargando…</div>;

  return (
    <>
      <TopBar
        user={user}
        onLoginClick={() => { setAuthMode("login"); setAuthOpen(true); }}
        onLogoutClick={() => setUser(null)}
        onChangePasswordClick={() => setPwdOpen(true)} 
        onPreferencesClick={() => setPrefsOpen(true)}  
      />

      <Hero
        title={menu.hero.title}
        subtitle={menu.hero.subtitle}
        image={menu.hero.image}
      />
      {/* Intro Nuestro Menú (ya agregada) */}
      <section className="menu-intro">
        <div className="container">
          <h2 className="menu-intro__title">Nuestro Menú</h2>
          <p className="menu-intro__subtitle">
            Descubre nuestros platos especiales elaborados con los mejores ingredientes y
            pasión por la excelencia culinaria
          </p>
          <div className="rule" />
        </div>
      </section>

      <main id="menu" className="container">
        {menu.sections.map((s, i) => (
          <Section key={i} name={s.name} items={s.items} />
        ))}
        <p className="helper">¿Necesitas ayuda para elegir? Chatea con nuestro asistente.</p>
      </main>

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
        onLoggedIn={(u) => setUser(u)}
      />
      
      <ChangePasswordModal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        recordId={user?.id}
      />

      <PreferencesModal
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        recordId={user?.id}
      />

      <ChatWidget />
    </>
  );
}
