const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const radians = ((i * 137.508 + 14) * Math.PI) / 180;
  const distance = 52 + (i % 6) * 12;
  const x = Math.round(Math.cos(radians) * distance);
  const y = Math.round(Math.sin(radians) * distance * 0.7 - 15);
  return {
    id: i,
    style: {
      "--tx": x + "px",
      "--ty": y + "px",
      "--size": 3 + (i % 4) + "px",
      "--delay": ((i % 5) * 18) + "ms",
      "--duration": (1.24 + (i % 5) * 0.075) + "s",
    },
  };
});

export function SuccessBurst({ onComplete }) {
  return (
    <span className="success-burst" aria-hidden="true">
      <span className="success-burst__halo" onAnimationEnd={onComplete} />
      <span className="success-burst__ring" />
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className={"success-burst__particle color-" + (particle.id % 6)}
          style={particle.style}
        />
      ))}
    </span>
  );
}
