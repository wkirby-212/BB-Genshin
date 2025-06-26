import React, { useState } from "react";

// --- Asset imports ---
import anemoIcon from "../../assets/anemo.svg";
import geoIcon from "../../assets/geo.svg";
import electroIcon from "../../assets/electro.svg";
import hydroIcon from "../../assets/hydro.svg";
import cryoIcon from "../../assets/cryo.svg";
import pyroIcon from "../../assets/pyro.svg";
import dendroIcon from "../../assets/dendro.svg";
import diceD4 from "../../assets/dice-d4.svg";
import diceD6 from "../../assets/dice-d6.svg";
import diceD8 from "../../assets/dice-d8.svg";
import diceD10 from "../../assets/dice-d10.svg";
import diceD12 from "../../assets/dice-d12.svg";
import profileRing from "../../assets/profile-ring.svg";
import lifeMarker from "../../assets/life-marker.svg";
import deathMarker from "../../assets/death-marker.svg";
import borderGold from "../../assets/border-gold.svg";

// --- Stat Group Setup ---
type StatGroup = {
  group: string;
  stats: string[];
};

const statGroups: StatGroup[] = [
  { group: "Arcane", stats: ["Magical Affinity", "Arcane Sense", "Healing Ability", "Aura"] },
  { group: "Knowledge", stats: ["Book Smarts", "Religion", "History", "Anatomy"] },
  { group: "Cunning", stats: ["Street Smarts", "Gossip", "Communication", "Adaption"] },
  { group: "Might", stats: ["Strength", "Grip", "Overpower", "Speed"] },
  { group: "Resilience", stats: ["Willpower", "Recovery", "Survival", "Leadership"] },
  { group: "Physical Fortitude", stats: ["Immunity", "Endurance", "Resistance", "Health"] },
  { group: "Awareness", stats: ["Presence", "Perception", "Investigation", "Insight"] },
  { group: "Dexterity", stats: ["Agility", "Flexibility", "Sleight of Hand", "Aim"] }
];

function getStatBarColor(val: number) {
  if (val <= 3) return "#e34242";
  if (val <= 6) return "#f8e969";
  return "#51d660";
}

// --- Vision/Dice asset options ---
const visionOptions = [
  { label: "Anemo", icon: anemoIcon },
  { label: "Geo", icon: geoIcon },
  { label: "Electro", icon: electroIcon },
  { label: "Hydro", icon: hydroIcon },
  { label: "Cryo", icon: cryoIcon },
  { label: "Pyro", icon: pyroIcon },
  { label: "Dendro", icon: dendroIcon },
];

const diceOptions = [
  { label: "D4", icon: diceD4 },
  { label: "D6", icon: diceD6 },
  { label: "D8", icon: diceD8 },
  { label: "D10", icon: diceD10 },
  { label: "D12", icon: diceD12 },
];

 function getVisionGradient(vision: string) {
switch (vision) {
case "Anemo": return "linear-gradient(135deg, #e0fffc 80%, #b2f3e6 100%)";
case "Geo": return "linear-gradient(135deg, #fff8e0 80%, #f3e7b2 100%)";
case "Electro": return "linear-gradient(135deg, #f0e0ff 80%, #d0b2f3 100%)";
case "Hydro": return "linear-gradient(135deg, #e0f4ff 80%, #b2d8f3 100%)";
case "Cryo": return "linear-gradient(135deg, #e0fbff 80%, #b2e2f3 100%)";
case "Pyro": return "linear-gradient(135deg, #fff0e0 80%, #f3c1b2 100%)";
case "Dendro": default: return "linear-gradient(135deg, #e7ffe0 80%, #b8f3b2 100%)";
 }
}

// If you want to pass user, uncomment the below line:
// type Props = { user: { username: string } };
// export default function PlayerSheet({ user }: Props) {
export default function PlayerSheet({ character, onBack, readOnly }) {
  const [charState, setCharState] = useState({ ...character });
  // -- State
  const sheetFont = "'Segoe UI', 'Arial Rounded MT Bold', Arial, sans-serif";
  const [vision, setVision] = useState("");
  const visionBgClass = `bg-${vision.toLowerCase()}`;
  const [charName, setCharName] = useState("");
  const [rank, setRank] = useState(1);
  const [evasion, setEvasion] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [pronouns, setPronouns] = useState("");
  const [career, setCareer] = useState("");
  const [background, setBackground] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [damage, setDamage] = useState("D6");
  const [currentHp, setCurrentHp] = useState(1);
  const [maxHp, setMaxHp] = useState(1);
  const [careerDice, setCareerDice] = useState("D6");
  const [lifeMarkers, setLifeMarkers] = useState([false, false, false]);
  const [deathMarkers, setDeathMarkers] = useState([false, false, false]);
  const [race, setRace] = useState("");
  const [racialFeatures, setRacialFeatures] = useState("");
  const [portrait, setPortrait] = useState<string | null>(null);
  const [stats, setStats] = useState<{ [key: string]: number }>(
    Object.fromEntries(statGroups.flatMap(g => g.stats.map(s => [s, 0])))
  );

  // For demo, just use "guest". For real use, get from login (user.username).
  const username = "guest";

  // Portrait upload handler
  function handlePortraitUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setPortrait(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Marker handlers
  const handleMarkerToggle = (type: "life" | "death", idx: number) => {
    if (type === "life") {
      setLifeMarkers(lm => lm.map((v, i) => (i === idx ? !v : v)));
    } else {
      setDeathMarkers(dm => dm.map((v, i) => (i === idx ? !v : v)));
    }
  };

  const visionObj = visionOptions.find(v => v.label === vision);

  // --- Save/Load helpers
    function handleChange(field, value) {
    setCharState(s => ({ ...s, [field]: value }));
  }

  function handleSave() {
    // Load all characters
    const chars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    // Find or add this character
    const idx = chars.findIndex(c => c.id === charState.id);
    if (idx === -1) {
      chars.push(charState);
    } else {
      chars[idx] = charState;
    }
    localStorage.setItem("player_characters", JSON.stringify(chars));
    alert("Character sheet saved!");
  }
  
  function getSheetData() {
    return {
      vision, charName, rank, evasion, speed, pronouns, career, background, specialty, damage,
      currentHp, maxHp, careerDice, lifeMarkers, deathMarkers, race, racialFeatures, portrait, stats,
    };
  }
  function loadSheetData(data: any) {
    if (!data) return;
    setVision(data.vision || "Dendro");
    setCharName(data.charName || "");
    setRank(data.rank || 1);
    setEvasion(data.evasion || 0);
    setSpeed(data.speed || 0);
    setPronouns(data.pronouns || "");
    setCareer(data.career || "");
    setBackground(data.background || "");
    setSpecialty(data.specialty || "");
    setDamage(data.damage || "D6");
    setCurrentHp(data.currentHp || 1);
    setMaxHp(data.maxHp || 1);
    setCareerDice(data.careerDice || "D6");
    setLifeMarkers(data.lifeMarkers || [false, false, false]);
    setDeathMarkers(data.deathMarkers || [false, false, false]);
    setRace(data.race || "");
    setRacialFeatures(data.racialFeatures || "");
    setPortrait(data.portrait || null);
    setStats(data.stats || Object.fromEntries(statGroups.flatMap(g => g.stats.map(s => [s, 0]))));
  }
  function handleSave() {
    localStorage.setItem(`ttrpg-character-${username}`, JSON.stringify(getSheetData()));
    alert("Character sheet saved!");
  }
  function handleLoad() {
    const data = localStorage.getItem(`ttrpg-character-${username}`);
    if (!data) {
      alert("No saved character sheet found!");
      return;
    }
    loadSheetData(JSON.parse(data));
    alert("Character sheet loaded!");
  }

return (
  <div
    className={visionBgClass}
    style={{
      position: "relative",
      maxWidth: 860,
      margin: "28px auto",
      borderRadius: 22,
      boxShadow: "0 4px 24px #0002",
      padding: "2.5vw 3vw 3vw 3vw",
      overflow: "hidden",
      fontFamily: sheetFont,
      color: "var(--sheet-text-color)",
      fontSize: 15,
      minHeight: 880,
      width: "94vw"
    }}
  >
{onBack && (
  <button
    onClick={onBack}
    style={{
      borderRadius: 8,
      padding: "6px 20px",
      fontWeight: "bold",
      position: "absolute",
      left: 24,
      top: 24,
      zIndex: 999,
      border: "none",
      background: "#eee",
    }}
  >
    Back
  </button>
)}
    {/* Top row: Portrait + Fillable Info + Vision Icon */}
    <div style={{ display: "flex", gap: 32, position: "relative", zIndex: 3 }}>
      {/* Portrait area */}
      <div style={{ position: "relative", width: 140, height: 160 }}>
        <img src={profileRing} alt="Portrait Frame" style={{ width: 140, height: 140, position: "absolute", top: 0, left: 0 }} />
        {portrait ? (
          <img src={portrait} alt="Portrait" style={{
            width: 112,
            height: 112,
            position: "absolute",
            top: 14,
            left: 14,
            borderRadius: "50%",
            objectFit: "cover"
          }} />
        ) : (
          <div style={{
            width: 112,
            height: 112,
            position: "absolute",
            top: 14,
            left: 14,
            borderRadius: "50%",
            background: "#a7e1a8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#347d40",
            fontSize: 16
          }}>
            No Portrait
          </div>
        )}
        {!readOnly && (
          <input
            type="file"
            accept="image/*"
            onChange={handlePortraitUpload}
            style={{
              position: "absolute",
              top: 120,
              left: 20,
              zIndex: 4
            }}
          />
        )}
      </div>
      {/* Fillable Info */}
      <div style={{ flex: 1 }}>
        <input
          value={charName}
          onChange={e => setCharName(e.target.value)}
          placeholder="Character Name"
          style={{
            fontWeight: "bold",
            fontSize: 28,
            border: "none",
            borderBottom: "2px solid #b9ddb9",
            marginBottom: 8,
            width: "80%"
          }}
          maxLength={32}
          disabled={readOnly}
        />
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <label>Rank:
            <input type="number" min={1} max={20} value={rank}
              onChange={e => setRank(Number(e.target.value))}
              style={{ width: 48, marginLeft: 4 }}
              disabled={readOnly}
            />
          </label>
          <label>Evasion:
            <input type="number" min={0} max={999} value={evasion}
              onChange={e => setEvasion(Number(e.target.value))}
              style={{ width: 48, marginLeft: 4 }}
              disabled={readOnly}
            />
          </label>
          <label>Speed:
            <input type="number" min={0} max={999} value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              style={{ width: 48, marginLeft: 4 }}
              disabled={readOnly}
            /> ft
          </label>
          <label>Pronouns:
            <input
              value={pronouns}
              onChange={e => setPronouns(e.target.value)}
              style={{ width: 70, marginLeft: 4 }}
              maxLength={20}
              disabled={readOnly}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <label>Career:
            <input value={career} onChange={e => setCareer(e.target.value)} style={{ width: 90, marginLeft: 4 }} maxLength={30} disabled={readOnly} />
          </label>
          <label>Background:
            <input value={background} onChange={e => setBackground(e.target.value)} style={{ width: 90, marginLeft: 4 }} maxLength={30} disabled={readOnly} />
          </label>
          <label>Specialty:
            <input value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ width: 90, marginLeft: 4 }} maxLength={30} disabled={readOnly} />
          </label>
          <label>Race:
            <input value={race} onChange={e => setRace(e.target.value)} style={{ width: 90, marginLeft: 4 }} maxLength={20} disabled={readOnly} />
          </label>
        </div>
      </div>
      {/* Vision selector + icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <select value={vision} onChange={e => setVision(e.target.value)} style={{ marginBottom: 10 }} disabled={readOnly}>
          {visionOptions.map(opt =>
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          )}
        </select>
        <img src={visionObj?.icon} alt={vision + " Vision"} width={64} />
      </div>
    </div>
    {/* Dice, HP, Career Dice */}
    <div style={{ display: "flex", gap: 36, alignItems: "center", marginTop: 16, position: "relative", zIndex: 3 }}>
      <label>Damage:{" "}
        <select value={damage} onChange={e => setDamage(e.target.value)} disabled={readOnly}>
          {diceOptions.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
        </select>
        <img src={diceOptions.find(d => d.label === damage)?.icon} alt={damage} width={36} style={{ verticalAlign: "middle", marginLeft: 4 }} />
      </label>
      <label>Current HP:
        <input type="number" min={0} max={999} value={currentHp}
          onChange={e => setCurrentHp(Number(e.target.value))} style={{ width: 44, marginLeft: 4 }} disabled={readOnly} />
      </label>
      /
      <label>Max HP:
        <input type="number" min={1} max={999} value={maxHp}
          onChange={e => setMaxHp(Number(e.target.value))} style={{ width: 44, marginLeft: 4 }} disabled={readOnly} />
      </label>
      <label>Career Dice:
        <select value={careerDice} onChange={e => setCareerDice(e.target.value)} disabled={readOnly}>
          {diceOptions.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
        </select>
        <img src={diceOptions.find(d => d.label === careerDice)?.icon} alt={careerDice} width={36} style={{ verticalAlign: "middle", marginLeft: 4 }} />
      </label>
    </div>
    {/* Life/Death Markers */}
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 28, position: "relative", zIndex: 3 }}>
      <div>
        <span>Life: </span>
        {lifeMarkers.map((checked, idx) => (
          <img key={idx} src={lifeMarker} alt="Life" width={28} style={{
            filter: checked ? "brightness(1.2) drop-shadow(0 0 6px #8cffb3)" : "grayscale(1) opacity(0.5)",
            cursor: readOnly ? "default" : "pointer", marginLeft: 3
          }} onClick={() => !readOnly && handleMarkerToggle("life", idx)} />
        ))}
      </div>
      <div>
        <span>Death: </span>
        {deathMarkers.map((checked, idx) => (
          <img key={idx} src={deathMarker} alt="Death" width={28} style={{
            filter: checked ? "brightness(1.2) drop-shadow(0 0 6px #ffb1b1)" : "grayscale(1) opacity(0.5)",
            cursor: readOnly ? "default" : "pointer", marginLeft: 3
          }} onClick={() => !readOnly && handleMarkerToggle("death", idx)} />
        ))}
      </div>
    </div>
    {/* Racial Features */}
    <div style={{ marginTop: 18, position: "relative", zIndex: 3 }}>
      <label>Racial Features:
        <input value={racialFeatures} maxLength={150} onChange={e => setRacialFeatures(e.target.value)} style={{ width: "80%", marginLeft: 4 }} disabled={readOnly} />
      </label>
    </div>

    {/* Stat Groups */}
    <div style={{ display: "flex", gap: 28, marginTop: 34, alignItems: "flex-start", position: "relative", zIndex: 3 }}>
      {[0, 1].map(col => (
        <div key={col} style={{ flex: 1 }}>
          {statGroups.slice(col * 4, col * 4 + 4).map(group => (
            <div key={group.group} style={{ marginBottom: 26 }}>
              <div style={{
                fontWeight: "bold",
                fontSize: 17,
                color: "#25783b",
                marginBottom: 4,
                letterSpacing: 1.2
              }}>
                {group.group}
              </div>
              {group.stats.map(stat => (
                <div key={stat} style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
                  <div style={{ minWidth: 128, marginRight: 8 }}>{stat}</div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={stats[stat]}
                    onChange={e =>
                      setStats(s => ({ ...s, [stat]: Number(e.target.value) }))
                    }
                    style={{ flex: 1, accentColor: getStatBarColor(stats[stat]) }}
                    disabled={readOnly}
                  />
                  <div style={{
                    width: 36,
                    marginLeft: 8,
                    fontWeight: "bold",
                    color: getStatBarColor(stats[stat])
                  }}>
                    {stats[stat]}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Save/Load Buttons (Hide in readOnly) */}
    {!readOnly && (
      <div style={{ marginTop: 32, display: "flex", gap: 16, position: "relative", zIndex: 3 }}>
        <button onClick={handleSave} style={{
          background: "#51d660", color: "#fff", fontWeight: "bold",
          border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer"
        }}>
          Save
        </button>
        <button onClick={handleLoad} style={{
          background: "#388a2b", color: "#fff", fontWeight: "bold",
          border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer"
        }}>
          Load
        </button>
      </div>
    )}
  </div>
);
}