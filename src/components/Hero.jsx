import heroDefault from "../assets/hero-restaurant.jpg";

export default function Hero({ title, subtitle, image }) {
  const bg = image || heroDefault;

  return (
    <section className="hero">
      {/* Fondo con imagen */}
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      {/* Capa oscura encima */}
      <div className="hero__overlay" />
      {/* Contenido */}
      <div className="hero__content">
        <h1>
          La Parrilla <span className="accent">Fit</span>
        </h1>
        <p>{subtitle}</p>
        <div className="rule" />
      </div>
    </section>
  );
}
