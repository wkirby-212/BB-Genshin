import { useState, useEffect } from "react";
import type { CharacterDashboardProps, Character } from "../../types";
import type { Campaign } from "../../types";

export default function CharacterDashboard({ onSelect }: CharacterDashboardProps) {
  const [allChars, setAllChars] = useState<Character[]>([]);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [joinCode, setJoinCode] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  // Load characters on mount and after changes
  useEffect(() => {
    loadCharacters();
  }, [showJoin, showCreate]);

  function loadCharacters() {
    const chars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    setAllChars(chars);
  }

  // --- Character Creation ---
  function handleCreateCharacter(e: React.FormEvent) {
    e.preventDefault();
    if (!newCharacterName.trim()) return;
    const chars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    const newChar: Character = {
      id: Math.random().toString(36).slice(2, 12),
      name: newCharacterName,
      vision: "Dendro",
      rank: 1,
      evasion: 0,
      speed: 30,
      pronouns: "",
      career: "",
      background: "",
      specialty: "",
      damage: "D6",
      currentHp: 10,
      maxHp: 10,
      careerDice: "D6",
      lifeMarkers: [false, false, false],
      deathMarkers: [false, false, false],
      race: "",
      racialFeatures: "",
      portrait: null,
      campaignIds: [],
      stats: {
        Strength: 0, Grip: 0, Overpower: 0, Speed: 0,
        Willpower: 0, Recovery: 0, Survival: 0, Leadership: 0,
        StreetSmarts: 0, Gossip: 0, Communication: 0, Adaption: 0,
        Immunity: 0, Endurance: 0, Resistance: 0, Health: 0,
        Presence: 0, Perception: 0, Investigation: 0, Insight: 0,
      },
    };
    chars.push(newChar);
    localStorage.setItem("player_characters", JSON.stringify(chars));
    setAllChars(chars);
    setNewCharacterName("");
    setShowCreate(false);
  }

  // --- Join Campaign Logic ---
  function handleOpenJoin(char: Character) {
    setSelectedChar(char);
    setShowJoin(true);
    setJoinCode("");
    setJoinMessage("");
  }
  function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    // Load campaigns
    const allCampaigns = JSON.parse(localStorage.getItem("gm_campaigns") || "[]");
    const campaign = allCampaigns.find((c: Campaign) => c.inviteCode === joinCode.trim().toUpperCase());
    if (!campaign) {
      setJoinMessage("No campaign found for that code.");
      return;
    }
    // Add character to campaign
    if (!campaign.playerIds) campaign.playerIds = [];
    if (!selectedChar) return;
    if (!campaign.playerIds.includes(selectedChar.id)) {
      campaign.playerIds.push(selectedChar.id);
      localStorage.setItem("gm_campaigns", JSON.stringify(allCampaigns));
    }
    // Add campaign to character
    const allChars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    const idx = allChars.findIndex((c: Character) => c.id === selectedChar.id);
    if (idx !== -1) {
      if (!allChars[idx].campaignIds) allChars[idx].campaignIds = [];
      if (!allChars[idx].campaignIds.includes(campaign.id))
        allChars[idx].campaignIds.push(campaign.id);
      localStorage.setItem("player_characters", JSON.stringify(allChars));
      setAllChars(allChars); // Refresh UI to show new campaign link
    }
    setJoinMessage(`Joined: ${campaign.name}`);
    setTimeout(() => {
      setShowJoin(false);
      setJoinMessage("");
      setJoinCode("");
    }, 1200);
  }

  return (
    <div style={{ maxWidth: 580, margin: "40px auto" }}>
      <h2>My Characters</h2>
      <button onClick={() => setShowCreate(true)} style={{
        background: "#51d660", color: "#fff", fontWeight: "bold",
        border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer", marginBottom: 24
      }}>
        + Create New Character
      </button>
      {allChars.length === 0 && (
        <div>No characters yet.</div>
      )}
      {allChars.map(char => (
        <div key={char.id} style={{ padding: 18, background: "#f6fcf6", marginBottom: 10, borderRadius: 9 }}>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>{char.name}</div>
          <button onClick={() => onSelect(char)}
            style={{ marginRight: 16, background: "#dde", border: "none", borderRadius: 6, padding: "5px 18px", fontWeight: "bold" }}>
            Open Sheet
          </button>
          <button onClick={() => handleOpenJoin(char)}
            style={{ background: "#cff", border: "none", borderRadius: 6, padding: "5px 18px", fontWeight: "bold" }}>
            Join Campaign
          </button>
          {/* Show joined campaigns by name */}
          {char.campaignIds && char.campaignIds.length > 0 && (() => {
            const allCampaigns = JSON.parse(localStorage.getItem("gm_campaigns") || "[]");
            const joinedNames = char.campaignIds
              .map(cid => {
                const c = allCampaigns.find((camp: Campaign) => camp.id === cid);
                return c ? c.name : `(unknown: ${cid})`;
              })
              .join(", ");
            return (
              <div style={{ marginTop: 8, fontSize: 13, color: "#497" }}>
                Campaigns: {joinedNames}
              </div>
            );
          })()}
        </div>
      ))}

      {/* --- Character Creation Modal --- */}
      {showCreate && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(40,40,60,0.18)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <form onSubmit={handleCreateCharacter} style={{
            background: "#fff", color: "#222", padding: 30, borderRadius: 14, minWidth: 320, boxShadow: "0 2px 18px #0005"
          }}>
            <h3>Create a Character</h3>
            <label>
              Name:<br />
              <input value={newCharacterName} onChange={e => setNewCharacterName(e.target.value)} autoFocus style={{ width: "100%", fontSize: 18, margin: "10px 0" }} />
            </label>
            <div style={{ marginTop: 18 }}>
              <button type="submit" style={{
                background: "#38a", color: "#fff", borderRadius: 6, padding: "7px 18px", fontWeight: "bold"
              }}>Create</button>
              <button type="button" onClick={() => setShowCreate(false)} style={{
                background: "#ddd", color: "#444", borderRadius: 6, padding: "7px 18px", fontWeight: "bold", marginLeft: 14
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* --- Join Campaign Modal --- */}
      {showJoin && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(40,40,60,0.18)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <form onSubmit={handleJoinSubmit} style={{
            background: "#fff", color: "#222", padding: 30, borderRadius: 14, minWidth: 320, boxShadow: "0 2px 18px #0005"
          }}>
            <h3>Join a Campaign</h3>
            <label>
              Campaign Code:<br />
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                style={{ width: "100%", fontSize: 18, letterSpacing: 2, margin: "12px 0 18px 0" }}
                autoFocus
              />
            </label>
            <button type="submit" style={{
              background: "#38a", color: "#fff", borderRadius: 6, padding: "7px 18px", fontWeight: "bold"
            }}>Join</button>
            <button type="button" onClick={() => setShowJoin(false)} style={{
              background: "#ddd", color: "#444", borderRadius: 6, padding: "7px 18px", fontWeight: "bold", marginLeft: 14
            }}>Cancel</button>
            <div style={{ marginTop: 14, minHeight: 24, color: "#1a6" }}>{joinMessage}</div>
          </form>
        </div>
      )}
    </div>
  );
}
