import { useState } from "react";
import Login from "./components/Login/Login";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel";
import GameMastersPanel from "./components/GameMastersPanel/GameMastersPanel";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <Login onLogin={setUser} />;
  if (user.role === "player") return <PlayersPanel user={user} />;
  return <GameMastersPanel user={user} />;
}


