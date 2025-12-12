import { useEffect } from "react";
import useUserStore from "./store/userStore";
import SearchBar from "./components/SearchBar";
import UserCards from "./components/UserCards";
import Pagination from "./components/Pagination";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import logo from "./assets/Logo_hc.png";
import "./App.css";

function App() {
  const { fetchUsers, loading, error } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} alt="Logo Hospital Central" className="app-logo" />
        <h1>Hospital Central de Mendoza</h1>
        <p>Herramienta de consulta de usuarios HSI</p>
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
