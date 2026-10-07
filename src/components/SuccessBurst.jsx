const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const radians = ((i * 137.508 + 11) * Math.PI) / 180;
  const distance = 58 + (i % 7) * 11;
  const x = Math.round(Math.cos(radians) * distance);
  const y = Math.round(Math.sin(radians) * distance * 0.72 - 18);
  const midX = Math.round(x * (0.48 + (i % 3) * 0.08));
  const midY = Math.round(y * (0.5 + (i % 4) * 0.055) - 8);

  return {
    id: i,
    shape: i % 4,
    style: {
      "--tx": x + "px",
      "--ty": y + "px",
      "--mx": midX + "px",
      "--my": midY + "px",
      "--w": 3 + (i % 4) * 1.4 + "px",
      "--h": 3 + ((i + 2) % 5) * 1.3 + "px",
      "--rot": (i % 2 === 0 ? 1 : -1) * (24 + (i % 6) * 19) + "deg",
      "--delay": ((i % 6) * 14) + "ms",
      "--duration": (1.25 + (i % 6) * 0.085) + "s",
    },
  };
});

export function SuccessBurst({ onComplete }) {
  return (
    <span className="success-burst" aria-hidden="true">
      <span className="success-burst__halo" onAnimationEnd={onComplete} />
      <span className="success-burst__ring success-burst__ring--outer" />
      <span className="success-burst__ring success-burst__ring--inner" />
      <span className="success-burst__glint" />
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className={
            "success-burst__particle color-" +
            (particle.id % 6) +
            " shape-" +
            particle.shape
          }
          style={particle.style}
        />
      ))}
    </span>
  );
}
