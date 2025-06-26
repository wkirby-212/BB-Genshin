import { useState } from "react";

type Props = { onLogin: (user: { username: string; role: "player" | "gm" }) => void };

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"player" | "gm">("player");
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");

  function getUsers() {
    return JSON.parse(localStorage.getItem("ttrpg-users") || "[]");
  }
  function saveUsers(users: any[]) {
    localStorage.setItem("ttrpg-users", JSON.stringify(users));
  }

  function checkUserExists(name: string) {
    return getUsers().some((u: any) => u.username === name);
  }

  function handleCheckUsername() {
    setError("");
    setIsNew(!checkUserExists(username));
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const users = getUsers();
    if (users.some((u: any) => u.username === username)) {
      setError("Username already exists.");
      return;
    }
    users.push({ username, password, role, characters: [], campaigns: [] });
    saveUsers(users);
    onLogin({ username, role });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(
      (u: any) =>
        u.username === username && u.password === password && u.role === role
    );
    if (!user) {
      setError("Incorrect username, password, or role.");
      return;
    }
    onLogin({ username, role });
  }

  return (
    <div style={{ margin: 40, maxWidth: 320 }}>
      <h2>Login or Register</h2>
      <form onSubmit={isNew ? handleRegister : handleLogin}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={{ display: "block", marginBottom: 10, width: "100%" }}
          onBlur={handleCheckUsername}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <div style={{ marginBottom: 10 }}>
          <label>
            <input type="radio" checked={role === "player"} onChange={() => setRole("player")} />
            Player
          </label>
          <label style={{ marginLeft: 18 }}>
            <input type="radio" checked={role === "gm"} onChange={() => setRole("gm")} />
            Game Master
          </label>
        </div>
        <button type="submit">{isNew ? "Register" : "Login"}</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
