import { useState } from "react";
import CharacterDashboard from "./CharacterDashboard";
import PlayerSheet from "./PlayerSheet";

export default function PlayersPanel({ user }) {
  const [selectedChar, setSelectedChar] = useState(null);

  if (!selectedChar)
    return <CharacterDashboard onSelect={setSelectedChar} user={user} />;

  return (
    <PlayerSheet
      character={selectedChar}
      onBack={() => setSelectedChar(null)}
      user={user}
    />
  );
}
