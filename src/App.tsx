import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { Board } from "./components/Board";
import { Header } from "./components/Header";
import { ManageTeamModal } from "./components/ManageTeamModal";

function App() {
  const { user, loading } = useAuth();
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <div className="h-screen bg-brand-black" />;

  return (
    <div className="app-container">
      {user ? (
        <>
          <Header
            onManageTeam={() => setTeamModalOpen(true)}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
          <Board searchQuery={searchQuery} />
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
