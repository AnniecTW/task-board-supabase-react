import { useAuth } from "./hooks/useAuth";
import { Board } from "./components/Board";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>loading</div>;

  return (
    <div className="app-container">
      <h1>My Task Board</h1>
      {user ? <Board /> : <p>Authenticating...</p>}
    </div>
  );
}

export default App;
