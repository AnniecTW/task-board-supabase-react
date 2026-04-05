import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { Board } from "./components/Board";
import { Header } from "./components/Header";
import { ManageTeamModal } from "./components/ManageTeamModal";

function App() {
  const { user, loading } = useAuth();
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  if (loading) return <div className="h-screen bg-brand-black" />;

  return (
    <div className="app-container">
      {user ? (
        <>
          <Header onManageTeam={() => setTeamModalOpen(true)} />
          <Board />
          <ManageTeamModal
            isOpen={teamModalOpen}
            onClose={() => setTeamModalOpen(false)}
          />
        </>
      ) : (
        <p>Authenticating...</p>
      )}
    </div>
  );
}

export default App;
