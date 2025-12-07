import useUserStore from '../store/userStore';

export default function Pagination() {
  const { total, currentPage, limit, setCurrentPage, searchUsers } = useUserStore();

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      searchUsers();
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination" style={{ display: 'none' }}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Anterior
      </button>
      <span className="pagination-info">
        Página {currentPage} de {totalPages} ({total} usuarios)
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Siguiente
      </button>
    </div>
  );
}
