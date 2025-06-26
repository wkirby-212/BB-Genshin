import React, { useState, useEffect } from "react";
import PlayerSheet from "../PlayersPanel/PlayerSheet";

export default function ManagePlayersModal({ campaign, onClose }) {
  const [viewCharId, setViewCharId] = useState(null);
  const [allChars, setAllChars] = useState([]);

  // Load/refresh player characters EVERY TIME the modal is opened (when this component is mounted)
  useEffect(() => {
    setAllChars(JSON.parse(localStorage.getItem("player_characters") || "[]"));
    // Optionally, also add a storage event listener for cross-tab sync
    const storageListener = () => {
      setAllChars(JSON.parse(localStorage.getItem("player_characters") || "[]"));
    };
    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(campaign.inviteCode);
    alert("Invite code copied!");
  }

  const charToView = viewCharId
    ? allChars.find(c => c.id === viewCharId)
    : null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(30,50,40,0.18)", zIndex: 199, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", color: "#222", padding: 30, borderRadius: 14, minWidth: 350,
        boxShadow: "0 2px 18px #0007", position: "relative"
      }}>
        <h3>Manage Players for <b>{campaign.name}</b></h3>
        <div style={{ marginBottom: 18 }}>
          <b>Invite Code:</b>
          <span style={{
            fontFamily: "monospace", marginLeft: 10,
            fontSize: 18, letterSpacing: 2, padding: "2px 7px", background: "#f4f2e6", borderRadius: 6
          }}>
            {campaign.inviteCode}
          </span>
          <button onClick={handleCopy}
            style={{
              marginLeft: 10, background: "#cee", color: "#266", border: "none",
              borderRadius: 6, padding: "4px 12px", cursor: "pointer"
            }}>Copy</button>
        </div>
        <div>
          <b>Linked Player Characters:</b>
          <ul style={{ margin: 0, marginTop: 8, padding: 0 }}>
            {campaign.playerIds?.length
              ? campaign.playerIds.map(pid => {
                  const char = allChars.find(c => c.id === pid);
                  return (
                    <li key={pid} style={{ color: "#255", padding: "2px 0" }}>
                      {char ? (
                        <>
                          {char.name}
                          <button
                            style={{
                              marginLeft: 8,
                              fontSize: 13,
                              background: "#eee",
                              border: "1px solid #bbb",
                              borderRadius: 4,
                              padding: "2px 10px",
                              cursor: "pointer"
                            }}
                            onClick={() => setViewCharId(char.id)}
                          >
                            View Sheet
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "#e22" }}>{pid} (not found)</span>
                      )}
                    </li>
                  );
                })
              : <li style={{ color: "#888" }}>No players joined yet.</li>
            }
          </ul>
        </div>
        <div style={{ textAlign: "right", marginTop: 24 }}>
          <button onClick={onClose} style={{
            background: "#ddd", color: "#444", borderRadius: 7, padding: "7px 17px", fontWeight: "bold"
          }}>Close</button>
        </div>
        {/* Read-only player sheet modal */}
        {charToView && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(30,50,40,0.38)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              position: "relative",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 18px #0005",
              maxWidth: 900,
              width: "95vw",
              padding: 20,
              overflowY: "auto",
              maxHeight: "95vh",
              minHeight: 480
            }}>
              <button onClick={() => setViewCharId(null)} style={{
                position: "absolute", right: 12, top: 10, background: "#eee", border: "none",
                borderRadius: 8, padding: "5px 15px", fontWeight: "bold", cursor: "pointer"
              }}>Close</button>
              <PlayerSheet character={charToView} readOnly onBack={() => setViewCharId(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
