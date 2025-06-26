import React, { useState } from "react";

export default function CharacterSelect() {
  // ...existing character loading logic...
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [selectedChar, setSelectedChar] = useState(null); // when "Join" clicked for a char

  function handleOpenJoin(char) {
    setSelectedChar(char);
    setShowJoin(true);
    setJoinCode("");
    setJoinMessage("");
  }
  function handleJoinSubmit(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    // --- Load campaigns from storage
    const allCampaigns = JSON.parse(localStorage.getItem("gm_campaigns") || "[]");
    const campaign = allCampaigns.find(c => c.inviteCode === joinCode.trim().toUpperCase());
    if (!campaign) {
      setJoinMessage("No campaign found for that code.");
      return;
    }
    // --- Link character to campaign
    // Update campaign.playerIds
    if (!campaign.playerIds) campaign.playerIds = [];
    if (!campaign.playerIds.includes(selectedChar.id)) {
      campaign.playerIds.push(selectedChar.id);
    }
    // Save campaigns back
    localStorage.setItem("gm_campaigns", JSON.stringify(allCampaigns));
    // --- Update character.campaignIds
    const allChars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    const idx = allChars.findIndex(c => c.id === selectedChar.id);
    if (idx !== -1) {
      if (!allChars[idx].campaignIds) allChars[idx].campaignIds = [];
      if (!allChars[idx].campaignIds.includes(campaign.id))
        allChars[idx].campaignIds.push(campaign.id);
      localStorage.setItem("player_characters", JSON.stringify(allChars));
    }
    setJoinMessage(`Joined: ${campaign.name}`);
    setTimeout(() => setShowJoin(false), 1200);
  }

  // ...existing UI...
  return (
    <div>
      {/* ... existing character list ... */}
      {characters.map(char => (
        <div key={char.id} style={{ /* ... */ }}>
          {/* ... char info ... */}
          <button onClick={() => handleOpenJoin(char)}>Join Campaign</button>
        </div>
      ))}

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
