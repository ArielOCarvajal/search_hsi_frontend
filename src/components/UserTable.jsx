import useUserStore from '../store/userStore';

export default function UserTable() {
  const { users } = useUserStore();

  if (users.length === 0) {
    return <p className="no-results">No se encontraron resultados</p>;
  }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre y Apellido</th>
            <th>DNI</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Matrícula</th>
            <th>Mail</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre_apellido}</td>
              <td>{user.dni}</td>
              <td>{user.usuario}</td>
              <td>{user.rol}</td>
              <td>{user.matricula || '-'}</td>
              <td>{user.mail || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
