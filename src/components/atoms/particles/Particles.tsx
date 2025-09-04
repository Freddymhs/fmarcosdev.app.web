export const Particles = () => {
  return (
    <div className="fixed inset-0 opacity-40 border ">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-read-color animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};
