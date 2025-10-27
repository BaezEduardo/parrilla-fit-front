import { useMemo, useState } from "react";
import Hero from "./components/Hero.jsx";
import TopBar from "./components/TopBar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ChangePasswordModal from "./components/ChangePasswordModal.jsx";
import PreferencesModal from "./components/PreferencesModal.jsx";
import DishCard from "./components/DishCard.jsx";
import MenuFilters from "./components/MenuFilters.jsx";
import { useDishes } from "./hooks/useDishes.js";
import Skeleton from "./components/Skeleton.jsx";
import "./styles.css";

const ORDER = ["Entradas", "Platillos principales", "Postres", "Bebidas"];

export default function App() {
  // estados UI
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  // filtros
  const [filters, setFilters] = useState({ category: undefined, q: "", tags: [] });

  // el backend acepta un tag; usamos el primero si hay varios
  const activeTag = filters.tags?.[0];

  // datos
  const { dishes, loading, error } = useDishes({
    category: filters.category,
    q: filters.q,
    tag: activeTag,
  });

  const byCategory = useMemo(() => {
    const map = new Map();
    for (const d of dishes) {
      const c = d.Category || "Otros";
      if (!map.has(c)) map.set(c, []);
      map.get(c).push(d);
    }
    return map;
  }, [dishes]);

  if (error) return <div className="container error">{error}</div>;
  if (loading) return <div className="container"><Skeleton rows={6} /></div>;

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
        title="La Parrilla Fit"
        subtitle="Experimenta la excelencia culinaria con nuestro menú cuidadosamente elaborado"
        image="/hero-r.jpg"
      />

      {/* Intro Nuestro Menú */}
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

      {/* Filtros */}
      <div className="container">
        {/* <MenuFilters value={filters} onChange={setFilters} /> */}
      </div>

      <main id="menu" className="container">
        {ORDER.filter(c => byCategory.has(c)).map((cat) => (
          <section key={cat} className="menu__section">
            <h2 className="menu__sectionTitle">{cat}</h2>
            <div className="dish-grid">
              {byCategory.get(cat).map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </section>
        ))}
        {!ORDER.some(c => byCategory.has(c)) && (
          <p>No hay platillos disponibles.</p>
        )}
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
