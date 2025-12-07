import { useEffect } from "react";
import useUserStore from "./store/userStore";
import SearchBar from "./components/SearchBar";
import UserCards from "./components/UserCards";
import Pagination from "./components/Pagination";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import "./App.css";

function App() {
  const { fetchUsers, loading, error } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hospital Central de Mendoza</h1>
        <p>Sistema de consulta de usuarios HSI</p>
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
