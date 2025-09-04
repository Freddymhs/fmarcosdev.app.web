import { TECH_STACK_COLORS } from "../../../constants";

const HeaderBlog = () => {
  return (
    <div id="filter-section" className="relative z-[100]    ">
      <div className="mx-auto py-6 w-1/2">
        <div className="flex flex-wrap justify-center gap-1">
          {Object.entries(TECH_STACK_COLORS).map(([tech, className]) => (
            <span
              key={tech}
              className={`px-3 py-2 rounded-full text-sm cursor-pointer hover:scale-105 transition-transform  ${className}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderBlog;
