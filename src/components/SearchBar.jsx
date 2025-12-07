import { useState } from 'react';
import useUserStore from '../store/userStore';

export default function SearchBar() {
  const { searchFilters, setSearchFilters, searchUsers, setCurrentPage } = useUserStore();
  const [localQ, setLocalQ] = useState(searchFilters.q);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchFilters({ ...searchFilters, q: localQ });
    setCurrentPage(1);
    searchUsers();
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Buscar por nombre, usuario o rol..."
        value={localQ}
        onChange={(e) => setLocalQ(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Buscar
      </button>
    </form>
  );
}
