import { GrMore } from "react-icons/gr";

const FilterButtons = ({
  activeFilter,
  setActiveFilter,
  options = [
    { label: "All", value: "ALL" },
    { label: "Coding", value: "CODING" },
    { label: "Programming", value: "PROGRAMMING" },
  ],
  showMore = true,
}) => {
  return (
    <div className="filter-buttons">
      {options.map((option) => (
        <button
          key={option.value}
          className={activeFilter === option.value ? "active" : ""}
          onClick={() => setActiveFilter(option.value)}
        >
          {option.label}
        </button>
      ))}

      {showMore && (
        <button className="more-btn">
          <GrMore />
        </button>
      )}
    </div>
  );
};

export default FilterButtons;
