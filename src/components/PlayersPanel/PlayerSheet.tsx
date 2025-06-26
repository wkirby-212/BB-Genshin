import { useState, useEffect, useRef } from "react";
import type { PlayerSheetProps } from "../../types";

// Icons for dice and visions
import d4 from "../../assets/dice-d4.svg";
import d6 from "../../assets/dice-d6.svg";
import d8 from "../../assets/dice-d8.svg";
import d10 from "../../assets/dice-d10.svg";
import d12 from "../../assets/dice-d12.svg";
import lifeMarker from "../../assets/life-marker.svg";
import lifeFilled from "../../assets/life-filled.svg";
import deathMarker from "../../assets/death-marker.svg";
import visionAnemo from "../../assets/anemo.svg";
import visionGeo from "../../assets/geo.svg";
import visionElectro from "../../assets/electro.svg";
import visionHydro from "../../assets/hydro.svg";
import visionCryo from "../../assets/cryo.svg";
import visionPyro from "../../assets/pyro.svg";
import visionDendro from "../../assets/dendro.svg";

const defaultCharacter = {
  id: "",
  name: "",
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
  // Add stat groups here:
  stats: {
    Strength: 0, Grip: 0, Overpower: 0, Speed: 0,
    Willpower: 0, Recovery: 0, Survival: 0, Leadership: 0,
    StreetSmarts: 0, Gossip: 0, Communication: 0, Adaption: 0,
    Immunity: 0, Endurance: 0, Resistance: 0, Health: 0,
    Presence: 0, Perception: 0, Investigation: 0, Insight: 0,
  },
};

const diceOptions = [
  { label: "D4", icon: d4 },
  { label: "D6", icon: d6 },
  { label: "D8", icon: d8 },
  { label: "D10", icon: d10 },
  { label: "D12", icon: d12 },
];

// Visions and icons
const visionOptions = [
  { label: "Anemo", color: "#90e9f4" },
  { label: "Geo", color: "#e4c869" },
  { label: "Electro", color: "#ca89eb" },
  { label: "Hydro", color: "#82b1f9" },
  { label: "Cryo", color: "#b0d8fa" },
  { label: "Pyro", color: "#ff8880" },
  { label: "Dendro", color: "#96f586" }
];

// Vision icons mapping
const visionIcons: Record<string, string> = {
  Anemo: visionAnemo,
  Geo: visionGeo,
  Electro: visionElectro,
  Hydro: visionHydro,
  Cryo: visionCryo,
  Pyro: visionPyro,
  Dendro: visionDendro
};

export default function PlayerSheet({ character, readOnly = false, onBack }: PlayerSheetProps) {
  const [charState, setCharState] = useState({ ...defaultCharacter, ...character });
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save character to localStorage
  function saveCharacterToStorage(character: any) {
    const allChars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    const index = allChars.findIndex((c: any) => c.id === character.id);
    if (index >= 0) {
      allChars[index] = character;
    } else {
      allChars.push(character);
    }
    localStorage.setItem("player_characters", JSON.stringify(allChars));
    
    // Trigger storage event for cross-tab/component sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'player_characters',
      newValue: JSON.stringify(allChars),
      storageArea: localStorage
    }));
  }

  // Debounced save
  function handleChange(field: string, value: any) {
    setCharState(prev => {
      const newState = { ...prev, [field]: value };
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveCharacterToStorage(newState);
      }, 10000);
      return newState;
    });
  }

  // For stat sliders (nested in stats)
  function handleStatChange(stat: string, value: number) {
    setCharState(prev => {
      const newStats = { ...prev.stats, [stat]: value };
      const newState = { ...prev, stats: newStats };
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveCharacterToStorage(newState);
      }, 10000);
      return newState;
    });
  }

  // Life/Death marker toggles
  function handleMarkerToggle(type: "life" | "death", idx: number) {
    setCharState(prev => {
      const arr = type === "life" ? [...prev.lifeMarkers] : [...prev.deathMarkers];
      arr[idx] = !arr[idx];
      const newState = {
        ...prev,
        lifeMarkers: type === "life" ? arr : prev.lifeMarkers,
        deathMarkers: type === "death" ? arr : prev.deathMarkers
      };
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveCharacterToStorage(newState);
      }, 10000);
      return newState;
    });
  }

  // Portrait upload
  function handlePortraitUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        handleChange("portrait", ev.target?.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  // Manual save/load
  function handleSave() {
    saveCharacterToStorage(charState);
    alert("Character sheet saved!");
  }
  function handleLoad() {
    const allChars = JSON.parse(localStorage.getItem("player_characters") || "[]");
    const data = allChars.find((c: any) => c.id === charState.id);
    if (!data) {
      alert("No saved character sheet found!");
      return;
    }
    setCharState(data);
    alert("Character sheet loaded!");
  }

  // Load character data on mount
  useEffect(() => {
    console.log('PlayerSheet mounted with character:', character);
    if (character && character.id) {
      const mergedState = { ...defaultCharacter, ...character };
      console.log('Setting character state:', mergedState);
      setCharState(mergedState);
    } else {
      console.log('No character provided or missing ID');
    }
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [character]);

  // Stat groups (for visual sections)
  const statGroups = [
    { group: "Strength", stats: ["Strength", "Grip", "Overpower", "Speed"] },
    { group: "Willpower", stats: ["Willpower", "Recovery", "Survival", "Leadership"] },
    { group: "StreetSmarts", stats: ["StreetSmarts", "Gossip", "Communication", "Adaption"] },
    { group: "Immunity", stats: ["Immunity", "Endurance", "Resistance", "Health"] },
    { group: "Presence", stats: ["Presence", "Perception", "Investigation", "Insight"] },
  ];

  // Vision
  const visionIcon = visionIcons?.[charState.vision] || "";

  return (
    <div style={{
      padding: 24,
      maxWidth: 900,
      margin: "32px auto",
      background: "var(--sheet-bg, #f8fff4)",
      color: "var(--sheet-text-color, #222)",
      borderRadius: 20,
      boxShadow: "0 4px 24px #0002",
      position: "relative"
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", left: 16, top: 16, borderRadius: 8,
            background: "#eee", border: "none", padding: "6px 22px", fontWeight: "bold"
          }}>
          Back
        </button>
      )}

      <h2 style={{ textAlign: "center", marginTop: 0 }}>Player Character Sheet</h2>

      {/* Portrait and Vision */}
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ width: 140 }}>
          <div style={{ position: "relative" }}>
            {charState.portrait ? (
              <img src={charState.portrait} alt="Portrait" style={{
                width: 112, height: 112, borderRadius: "50%", objectFit: "cover"
              }} />
            ) : (
              <div style={{
                width: 112, height: 112, borderRadius: "50%", background: "#a7e1a8",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#347d40", fontSize: 16
              }}>
                No Portrait
              </div>
            )}
            {!readOnly && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePortraitUpload}
                style={{ marginTop: 8, width: 112 }}
              />
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label>
            Name:
            <input
              value={charState.name}
              onChange={e => handleChange("name", e.target.value)}
              disabled={readOnly}
              style={{ width: 200, marginLeft: 6 }}
            />
          </label>
          <label style={{ marginLeft: 18 }}>
            Rank:
            <input
              type="number"
              min={1}
              max={20}
              value={charState.rank}
              onChange={e => handleChange("rank", Number(e.target.value))}
              disabled={readOnly}
              style={{ width: 55, marginLeft: 6 }}
            />
          </label>
          <label style={{ marginLeft: 18 }}>
            Vision:
            <select
              value={charState.vision}
              onChange={e => handleChange("vision", e.target.value)}
              disabled={readOnly}
              style={{ marginLeft: 6 }}
            >
              {visionOptions.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
            {visionIcon && <img src={visionIcon} alt={charState.vision} width={38} style={{ verticalAlign: "middle", marginLeft: 10 }} />}
          </label>
        </div>
      </div>

      {/* Fillable Info */}
      <div style={{ marginTop: 14, display: "flex", gap: 28 }}>
        <label>
          Evasion:
          <input
            type="number"
            value={charState.evasion}
            onChange={e => handleChange("evasion", Number(e.target.value))}
            disabled={readOnly}
            style={{ width: 80, marginLeft: 4 }}
          />
        </label>
        <label>
          Speed:
          <input
            type="number"
            value={charState.speed}
            onChange={e => handleChange("speed", Number(e.target.value))}
            disabled={readOnly}
            style={{ width: 80, marginLeft: 4 }}
          /> ft
        </label>
        <label>
          Pronouns:
          <input
            value={charState.pronouns}
            onChange={e => handleChange("pronouns", e.target.value)}
            disabled={readOnly}
            style={{ width: 90, marginLeft: 4 }}
          />
        </label>
        <label>
          Career:
          <input
            value={charState.career}
            onChange={e => handleChange("career", e.target.value)}
            disabled={readOnly}
            style={{ width: 100, marginLeft: 4 }}
          />
        </label>
        <label>
          Background:
          <input
            value={charState.background}
            onChange={e => handleChange("background", e.target.value)}
            disabled={readOnly}
            style={{ width: 110, marginLeft: 4 }}
          />
        </label>
        <label>
          Specialty:
          <input
            value={charState.specialty}
            onChange={e => handleChange("specialty", e.target.value)}
            disabled={readOnly}
            style={{ width: 110, marginLeft: 4 }}
          />
        </label>
        <label>
          Race:
          <input
            value={charState.race}
            onChange={e => handleChange("race", e.target.value)}
            disabled={readOnly}
            style={{ width: 90, marginLeft: 4 }}
          />
        </label>
      </div>

      {/* Damage/Career Dice/HP */}
      <div style={{ marginTop: 14, display: "flex", gap: 38, alignItems: "center" }}>
        <label>
          Damage:
          <select
            value={charState.damage}
            onChange={e => handleChange("damage", e.target.value)}
            disabled={readOnly}
            style={{ marginLeft: 4 }}
          >
            {diceOptions.map(d => (
              <option key={d.label} value={d.label}>{d.label}</option>
            ))}
          </select>
          <img src={diceOptions.find(d => d.label === charState.damage)?.icon} alt={charState.damage} width={30} style={{ marginLeft: 4, verticalAlign: "middle" }} />
        </label>
        <label>
          Current HP:
          <input
            type="number"
            value={charState.currentHp}
            onChange={e => handleChange("currentHp", Number(e.target.value))}
            disabled={readOnly}
            style={{ width: 50, marginLeft: 4 }}
          />
        </label>
        /
        <label>
          Max HP:
          <input
            type="number"
            value={charState.maxHp}
            onChange={e => handleChange("maxHp", Number(e.target.value))}
            disabled={readOnly}
            style={{ width: 50, marginLeft: 4 }}
          />
        </label>
        <label>
          Career Dice:
          <select
            value={charState.careerDice}
            onChange={e => handleChange("careerDice", e.target.value)}
            disabled={readOnly}
            style={{ marginLeft: 4 }}
          >
            {diceOptions.map(d => (
              <option key={d.label} value={d.label}>{d.label}</option>
            ))}
          </select>
          <img src={diceOptions.find(d => d.label === charState.careerDice)?.icon} alt={charState.careerDice} width={30} style={{ marginLeft: 4, verticalAlign: "middle" }} />
        </label>
      </div>

      {/* Life/Death Markers */}
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 32 }}>
        <div>
          <span>Life: </span>
          {charState.lifeMarkers.map((checked, idx) => (
            <img
              key={idx}
              src={checked ? lifeFilled : lifeMarker}
              alt="Life"
              width={24}
              style={{
                filter: checked ? "brightness(1.15) drop-shadow(0 0 5px #8cffb3)" : "grayscale(1) opacity(0.5)",
                cursor: readOnly ? "default" : "pointer",
                marginLeft: 2
              }}
              onClick={() => !readOnly && handleMarkerToggle("life", idx)}
            />
          ))}
        </div>
        <div>
          <span>Death: </span>
          {charState.deathMarkers.map((checked, idx) => (
            <img
              key={idx}
              src={deathMarker}
              alt="Death"
              width={24}
              style={{
                filter: checked ? "brightness(1.2) drop-shadow(0 0 5px #ffb1b1)" : "grayscale(1) opacity(0.5)",
                cursor: readOnly ? "default" : "pointer",
                marginLeft: 2
              }}
              onClick={() => !readOnly && handleMarkerToggle("death", idx)}
            />
          ))}
        </div>
      </div>

      {/* Racial Features */}
      <div style={{ marginTop: 12 }}>
        <label>
          Racial Features:
          <input
            value={charState.racialFeatures}
            maxLength={150}
            onChange={e => handleChange("racialFeatures", e.target.value)}
            disabled={readOnly}
            style={{ width: "70%", marginLeft: 6 }}
          />
        </label>
      </div>

      {/* Stat Groups with sliders */}
      <div style={{ display: "flex", gap: 36, marginTop: 28, alignItems: "flex-start" }}>
        {statGroups.map(group => (
          <div key={group.group} style={{ flex: 1 }}>
            <div style={{
              fontWeight: "bold",
              fontSize: 16,
              color: "#25783b",
              marginBottom: 5,
              letterSpacing: 1.2
            }}>
              {group.group}
            </div>
            {group.stats.map(stat => (
              <div key={stat} style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
                <div style={{ minWidth: 110, marginRight: 8 }}>{stat}</div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={charState.stats[stat]}
                  onChange={e => handleStatChange(stat, Number(e.target.value))}
                  disabled={readOnly}
                  style={{ flex: 1, accentColor: "#46d660" }}
                />
                <div style={{
                  width: 32,
                  marginLeft: 8,
                  fontWeight: "bold",
                  color: "#25783b"
                }}>
                  {charState.stats[stat]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Save/Load Buttons */}
      {!readOnly && (
        <div style={{ marginTop: 28, display: "flex", gap: 14 }}>
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
