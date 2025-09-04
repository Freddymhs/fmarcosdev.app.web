interface IconButtonProps {
  icon: React.ReactNode;
  title: string;
  type?: "default" | "small";
}

const IconButton = ({ icon, title, type = "default" }: IconButtonProps) => {
  const baseStyles =
    "inline-flex items-center gap-2 text-xs rounded-sm py-1 px-3 min-h-13 w-full";
  const typeStyles =
    type === "small"
      ? "bg-white text-secondary-color"
      : "bg-secondary-color text-read-white-color";

  return (
    <span
      className={`border  border-solid border-secondary-color ${baseStyles} ${typeStyles} cursor-pointer`}
    >
      <span className="text-inherit">{icon}</span>
      <p>{title}</p>
    </span>
  );
};

export default IconButton;
