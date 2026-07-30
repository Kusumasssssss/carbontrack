import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-left">

        <span className="tag">
          🌱 CarbonTrack Platform
        </span>

        <h1>
          Track Your
          <br />
          <span>Carbon Footprint</span>
        </h1>

        <p>
          Monitor your daily carbon emissions,
          build sustainable habits,
          and create a greener future.
        </p>

        <div className="buttons">

          <button className="primary">
            Get Started
          </button>

          <button className="secondary">
            Learn More
          </button>

        </div>

      </div>

      <div className="hero-right">

        <img
          src="https://images.unsplash.com/photo-1511497584788-876760111969?w=900"
          alt="Nature"
        />

      </div>

    </section>
  );
}