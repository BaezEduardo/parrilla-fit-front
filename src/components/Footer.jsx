export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>La Parrilla <span>Fit</span></h3>
          <p>Comida saludable con sabor gourmet.</p>
        </div>

        <div className="footer-links">
          <a href="/">Inicio</a>
          <a href="#menu">Menú</a>
          <a href="#contacto">Contacto</a>
          <a href="#nosotros">Nosotros</a>
        </div>

        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">📘</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">📸</a>
          <a href="https://x.com" target="_blank" rel="noreferrer">🐦</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} La Parrilla Fit — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}