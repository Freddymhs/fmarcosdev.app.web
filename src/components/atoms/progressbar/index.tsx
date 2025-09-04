import { tv } from "tailwind-variants";

function ProgressBar({ progress }: { progress: number }) {
  const areaProgressBarStyle = tv({
    base: "relative h-3 bg-[var(--color-text-primary)] border border-[var(--color-background-main)]/50 rounded-sm",
  });

  const loadingEffectStyle = tv({
    base: "absolute top-0 left-0 h-full bg-[var(--color-accent-green)] transition-all duration-300",
  });

  return (
    <div className={areaProgressBarStyle()}>
      <div
        className={loadingEffectStyle()}
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
}

export default ProgressBar;
