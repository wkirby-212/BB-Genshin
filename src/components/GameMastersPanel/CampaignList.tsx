import React from "react";

export default function CampaignList({ campaigns, onCreate, onEdit, onDelete, onManagePlayers }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ color: "var(--sheet-text-color)", margin: 0 }}>Your Campaigns</h3>
        <button onClick={onCreate} style={{
          background: "#51d660", color: "#fff", fontWeight: "bold",
          border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer"
        }}>+ Create Campaign</button>
      </div>
      <ul style={{ margin: "20px 0 0 0", padding: 0, listStyle: "none" }}>
        {campaigns.length === 0 &&
          <li style={{ color: "#888", padding: 12 }}>No campaigns found.</li>
        }
        {campaigns.map(camp => (
          <li key={camp.id}
            style={{
              background: "#f2f8ec", color: "#1a3c28", marginBottom: 10, borderRadius: 8,
              padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
            <div>
              <b>{camp.name}</b> <span style={{ color: "#888", fontSize: 13 }}>({camp.sessionCount || 1} sessions)</span>
              <div style={{ fontSize: 13, color: "#567" }}>{camp.notes?.slice(0, 60)}</div>
            </div>
            <div>
              <button
                onClick={() => onManagePlayers(camp)}
                style={{
                  marginRight: 8, background: "#ecf", color: "#333", border: "none",
                  borderRadius: 6, padding: "5px 13px", cursor: "pointer"
                }}>
                Manage Players
              </button>
              <button onClick={() => onEdit(camp)}
                style={{ marginRight: 8, background: "#dbffdc", color: "#256a34", border: "none", borderRadius: 6, padding: "5px 13px", cursor: "pointer" }}>
                Edit
              </button>
              <button onClick={() => onDelete(camp.id)}
                style={{ background: "#ffd6d6", color: "#833", border: "none", borderRadius: 6, padding: "5px 13px", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
