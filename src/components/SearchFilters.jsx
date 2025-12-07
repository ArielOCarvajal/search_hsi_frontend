import useUserStore from '../store/userStore';

export default function SearchFilters() {
  const { searchFilters, setSearchFilters, searchUsers, clearFilters, setCurrentPage } = useUserStore();

  const handleFilterChange = (field, value) => {
    setSearchFilters({ ...searchFilters, [field]: value });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    searchUsers();
  };

  const handleClearFilters = () => {
    clearFilters();
    searchUsers();
  };

  return (
    <div className="search-filters">
      <div className="filter-grid">
        <input
          type="text"
          placeholder="Nombre"
          value={searchFilters.nombre}
          onChange={(e) => handleFilterChange('nombre', e.target.value)}
        />
        <input
          type="number"
          placeholder="DNI"
          value={searchFilters.dni}
          onChange={(e) => handleFilterChange('dni', e.target.value)}
        />
        <input
          type="text"
          placeholder="Usuario"
          value={searchFilters.usuario}
          onChange={(e) => handleFilterChange('usuario', e.target.value)}
        />
        <input
          type="text"
          placeholder="Rol"
          value={searchFilters.rol}
          onChange={(e) => handleFilterChange('rol', e.target.value)}
        />
        <input
          type="text"
          placeholder="Matrícula"
          value={searchFilters.matricula}
          onChange={(e) => handleFilterChange('matricula', e.target.value)}
        />
      </div>
      <div className="filter-actions">
        <button onClick={handleApplyFilters} className="btn-primary">
          Aplicar Filtros
        </button>
        <button onClick={handleClearFilters} className="btn-secondary">
          Limpiar
        </button>
      </div>
    </div>
  );
}
