const FilterButtons = ({ activeFilter, setActiveFilter, options = [] }) => {
  if (!options.length) return null;
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
    </div>
  );
};
export default FilterButtons;
