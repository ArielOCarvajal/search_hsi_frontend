import { useState } from 'react';
import useUserStore from '../store/userStore';

export default function UserCards() {
  const { users, searchFilters } = useUserStore();
  const [copiedId, setCopiedId] = useState(null);

  // Estado 1: Sin búsqueda activa (searchFilters.q está vacío)
  if (!searchFilters.q || searchFilters.q.trim() === '') {
    return (
      <div className="empty-state">
        <p>Ingrese un criterio de búsqueda para ver los resultados</p>
      </div>
    );
  }

  // Estado 2: Búsqueda activa pero sin resultados
  if (users.length === 0) {
    return (
      <div className="no-results">
        <p>No se encontraron resultados para "{searchFilters.q}"</p>
      </div>
    );
  }

  // Función para copiar credenciales al portapapeles
  const handleCopyCredentials = async (user) => {
    const credentials = `Usuario: ${user.usuario}, Contraseña: ${user.contrasena}`;

    try {
      await navigator.clipboard.writeText(credentials);
      setCopiedId(user.id);

      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      alert('No se pudo copiar al portapapeles');
    }
  };

  // Estado 3: Resultados encontrados
  return (
    <div className="user-cards-container">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <div className="user-card-header">
            <h3>{user.nombre_apellido}</h3>
          </div>

          <div className="user-card-body">
            <div className="user-card-field">
              <span className="field-label">DNI:</span>
              <span className="field-value">{user.dni}</span>
            </div>

            <div className="user-card-field">
              <span className="field-label">Matrícula:</span>
              <span className="field-value">{user.matricula || '-'}</span>
            </div>

            <div className="user-card-field">
              <span className="field-label">Usuario:</span>
              <span className="field-value">{user.usuario}</span>
            </div>

            <div className="user-card-field">
              <span className="field-label">Contraseña:</span>
              <span className="field-value password">{user.contrasena}</span>
            </div>
          </div>

          <div className="user-card-footer">
            <button
              onClick={() => handleCopyCredentials(user)}
              className={`copy-btn ${copiedId === user.id ? 'copied' : ''}`}
            >
              {copiedId === user.id ? 'Copiado' : 'Copiar credenciales'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
