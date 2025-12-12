import { useState } from "react";
import useUserStore from "../store/userStore";

export default function SearchBar() {
  const {
    searchFilters,
    setSearchFilters,
    searchUsers,
    fetchUsers,
    setCurrentPage,
  } = useUserStore();
  const [localQ, setLocalQ] = useState(searchFilters.q);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchFilters({ ...searchFilters, q: localQ });
    setCurrentPage(1);
    searchUsers();
  };

  const handleClear = () => {
    setLocalQ("");
    setSearchFilters({ ...searchFilters, q: "" });
    setCurrentPage(1);
    fetchUsers(); // Usar fetchUsers para cargar todos los usuarios sin filtros
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Buscar por DNI o matrícula"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          className="search-input"
        />
        {localQ && (
          <button
            type="button"
            className="clear-search-button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            title="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        Buscar
      </button>
    </form>
  );
}
