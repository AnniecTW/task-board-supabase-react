import { useState } from "react";
import { Toaster } from "react-hot-toast";
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "13px",
          },
        }}
      />
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
