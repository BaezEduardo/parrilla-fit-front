import heroImg from "../assets/hero-r.jpg";

export default function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="hero-content">
        <h1>
          La Parrilla <span className="accent">Fit</span>
        </h1>
        <p>Comida saludable, sabrosa y al punto 🔥</p>
      </div>
    </section>
  );
}

      