const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Areas' },
    { id: 'nearby', label: 'Nearby' },     // Add this new filter
    { id: 'safe', label: 'Safe Areas' },     // Rating = 5
    { id: 'caution', label: 'Use Caution' }, // Ratings 3-4
    { id: 'avoid', label: 'Avoid Areas' }    // Ratings 1-2
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === filter.id
              ? filter.id === 'safe'
                ? 'bg-green-100 text-green-800'
                : filter.id === 'caution'
                ? 'bg-yellow-100 text-yellow-800'
                : filter.id === 'avoid'
                ? 'bg-red-100 text-red-800'
                : filter.id === 'nearby'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
  