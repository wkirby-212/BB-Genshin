import { useState } from "react";
import CharacterDashboard from "./CharacterDashboard";
import PlayerSheet from "./PlayerSheet";
import type { PlayersPanelProps, Character } from "../../types";

export default function PlayersPanel({}: PlayersPanelProps) {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  if (!selectedChar)
    return <CharacterDashboard onSelect={setSelectedChar} />;

  return (
    <PlayerSheet
      character={selectedChar}
      onBack={() => setSelectedChar(null)}
    />
  );
}
