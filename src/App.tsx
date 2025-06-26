import { useState } from "react";
import Login from "./components/Login/Login";
import PlayersPanel from "./components/PlayersPanel/PlayersPanel"; // Placeholder for now
import GameMastersPanel from "./components/GameMastersPanel/GameMastersPanel"; // Placeholder for now

type User = { username: string; role: "player" | "gm" };

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <Login onLogin={setUser} />;
  if (user.role === "player") return <PlayersPanel user={user} />;
  return <GameMastersPanel user={user} />;
}


