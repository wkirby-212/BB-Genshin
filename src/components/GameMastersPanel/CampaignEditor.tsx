import { useState } from "react";
import type { CampaignEditorProps } from "../../types";

export default function CampaignEditor({ initial, onSave, onCancel }: CampaignEditorProps) {
  const [name, setName] = useState(initial?.name || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const camp = {
      id: initial?.id || Math.random().toString(36).slice(2, 10),
      name,
      notes,
      sessionCount: initial?.sessionCount || 1,
      inviteCode: initial?.inviteCode || Math.random().toString(36).substr(2, 6).toUpperCase(),
      playerIds: initial?.playerIds || [],
    };
    onSave(camp);
  }
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(30,50,40,0.18)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", color: "#222", padding: 34, borderRadius: 16, boxShadow: "0 2px 18px #0006", minWidth: 340
      }}>
        <h3>{initial ? "Edit Campaign" : "Create Campaign"}</h3>
        <label>
          Name:<br />
          <input value={name} onChange={e => setName(e.target.value)}
            style={{ width: "100%", fontSize: 16, marginBottom: 12 }} />
        </label>
        <label>
          Notes:<br />
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            rows={4} style={{ width: "100%", fontSize: 15, marginBottom: 14 }} />
        </label>
        <div style={{ display: "flex", gap: 14, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} style={{
            background: "#ddd", color: "#444", borderRadius: 7, padding: "7px 17px", fontWeight: "bold"
          }}>Cancel</button>
          <button type="submit" style={{
            background: "#388a2b", color: "#fff", borderRadius: 7, padding: "7px 17px", fontWeight: "bold"
          }}>{initial ? "Save" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
