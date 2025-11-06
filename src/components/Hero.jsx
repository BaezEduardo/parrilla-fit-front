import heroImg from "../assets/hero.jpg";

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
      <div className="hero__content">
        <h1>
          La Parrilla <span className="accent">Fit</span>
        </h1>
        <p>Descubre nuestros platos especiales elaborados con los mejores ingredientes y pasión por la excelencia culinaria.</p>
      </div>
    </section>
  );
}

      