import { useEffect } from "react";
import useUserStore from "./store/userStore";
import useAuthStore from "./store/authStore";
import LoginForm from "./components/LoginForm";
import SearchBar from "./components/SearchBar";
import UserCards from "./components/UserCards";
import Pagination from "./components/Pagination";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import logo from "./assets/Logo_hc.png";
import "./App.css";

function App() {
  const { fetchUsers, loading, error } = useUserStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} alt="Logo Hospital Central" className="app-logo" />
        <div className="header-content">
          <div className="header-text">
            <h1>Hospital Central de Mendoza</h1>
            <p>Herramienta de consulta de usuarios HSI</p>
          </div>
          <div className="header-user">
            <span className="user-name">{user?.nombre_apellido}</span>
            <span className="user-role">({user?.rol})</span>
            <button onClick={logout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="search-section">
          <SearchBar />
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <>
            <UserCards />
            <Pagination />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
