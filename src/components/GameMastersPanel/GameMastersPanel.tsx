import { useState, useEffect } from "react";
import CampaignList from "./CampaignList";
import CampaignEditor from "./CampaignEditor";
import ManagePlayersModal from "./ManagePlayersModal";
import type { Campaign, GameMastersPanelProps } from "../../types";

// LocalStorage keys
const LS_GM = "gm_user";
const LS_CAMPAIGNS = "gm_campaigns";

// Helper functions
const getSavedCampaigns = () => {
  try {
    const raw = localStorage.getItem(LS_CAMPAIGNS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveCampaigns = (arr: Campaign[]) => localStorage.setItem(LS_CAMPAIGNS, JSON.stringify(arr));

export default function GameMastersPanel({}: GameMastersPanelProps) {
  // GM login state
  const [gmUser, setGmUser] = useState(localStorage.getItem(LS_GM) || "");
  const [gmPass, setGmPass] = useState("");
  const [loginError, setLoginError] = useState("");
  // Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  // Manage Players Modal
  const [managePlayersCampaign, setManagePlayersCampaign] = useState<Campaign | null>(null);

  // Load campaigns on login
  useEffect(() => {
    if (gmUser) setCampaigns(getSavedCampaigns());
  }, [gmUser]);

  // Demo only: accept any password, save user to localStorage
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (gmUser.trim() === "") return setLoginError("Please enter a username.");
    localStorage.setItem(LS_GM, gmUser);
    setLoginError("");
  }
  function handleLogout() {
    localStorage.removeItem(LS_GM);
    setGmUser("");
    setGmPass("");
  }

  function handleCreateCampaign(newCamp: Campaign) {
    const updated = [...campaigns, newCamp];
    setCampaigns(updated);
    saveCampaigns(updated);
    setShowEditor(false);
  }
  function handleEditCampaign(camp: Campaign) {
    setEditingCampaign(camp);
    setShowEditor(true);
  }
  function handleSaveEditCampaign(edited: Campaign) {
    const updated = campaigns.map(c => c.id === edited.id ? edited : c);
    setCampaigns(updated);
    saveCampaigns(updated);
    setShowEditor(false);
    setEditingCampaign(null);
  }
  function handleDeleteCampaign(id: string) {
    if (!window.confirm("Delete this campaign?")) return;
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    saveCampaigns(updated);
  }

  // --- LOGIN SCREEN ---
  if (!gmUser) return (
    <div className="gm-login-wrap" style={{
      maxWidth: 340, margin: "64px auto", padding: 32, borderRadius: 14,
      background: "var(--sheet-bg)", boxShadow: "0 2px 18px #0003"
    }}>
      <h2 style={{ marginBottom: 16 }}>GM Login</h2>
      <form onSubmit={handleLogin}>
        <label style={{ color: "var(--sheet-text-color)" }}>
          Username:<br />
          <input
            value={gmUser}
            onChange={e => setGmUser(e.target.value)}
            style={{
              width: "100%", marginBottom: 12, fontSize: 17, color: "var(--sheet-text-color)",
              background: "rgba(255,255,255,0.94)", borderRadius: 7, padding: "5px 8px"
            }}
            autoFocus
          />
        </label>
        <label style={{ color: "var(--sheet-text-color)" }}>
          Password:<br />
          <input
            type="password"
            value={gmPass}
            onChange={e => setGmPass(e.target.value)}
            style={{
              width: "100%", marginBottom: 16, fontSize: 17, color: "var(--sheet-text-color)",
              background: "rgba(255,255,255,0.94)", borderRadius: 7, padding: "5px 8px"
            }}
          />
        </label>
        <button type="submit" style={{
          width: "100%", padding: "9px 0", fontSize: 18, borderRadius: 7,
          background: "#388a2b", color: "#fff", fontWeight: "bold", border: "none"
        }}>
          Login
        </button>
        {loginError && <div style={{ color: "#f33", marginTop: 8 }}>{loginError}</div>}
      </form>
    </div>
  );

  // --- DASHBOARD ---
  return (
    <div style={{
      maxWidth: 760, margin: "48px auto", padding: 30, borderRadius: 16,
      background: "var(--sheet-bg)", boxShadow: "0 2px 18px #0003", minHeight: 420
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "var(--sheet-text-color)" }}>GM Campaign Dashboard</h2>
        <button onClick={handleLogout} style={{
          background: "#ccc", color: "#444", fontWeight: "bold",
          border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer"
        }}>Logout</button>
      </div>
      <CampaignList
        campaigns={campaigns}
        onCreate={() => { setShowEditor(true); setEditingCampaign(null); }}
        onEdit={handleEditCampaign}
        onDelete={handleDeleteCampaign}
        onManagePlayers={setManagePlayersCampaign}
      />
      {showEditor &&
        <CampaignEditor
          initial={editingCampaign}
          onSave={editingCampaign ? handleSaveEditCampaign : handleCreateCampaign}
          onCancel={() => { setShowEditor(false); setEditingCampaign(null); }}
        />
      }
      {managePlayersCampaign &&
        <ManagePlayersModal
          campaign={managePlayersCampaign}
          onClose={() => setManagePlayersCampaign(null)}
        />
      }
    </div>
  );
}
