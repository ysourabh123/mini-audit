import { useState, useEffect } from "react";

interface Version {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
}

function App() {
  const [text, setText] = useState<string>("");
  const [versions, setVersions] = useState<Version[]>([]);

  const saveVersion = async () => {
    const response = await fetch("http://localhost:5000/save-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    setVersions(prev => [...prev, data]);
  };

  useEffect(() => {
    fetch("http://localhost:5000/versions")
      .then(res => res.json())
      .then(setVersions);
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Mini Audit Trail Generator</h2>

      <textarea
        rows={6}
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={saveVersion} style={{ marginTop: 10 }}>
        Save Version
      </button>

      <h3 style={{ marginTop: 20 }}>Version History</h3>

      {versions.map(v => (
        <div key={v.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <p><b>ID:</b> {v.id}</p>
          <p><b>Time:</b> {v.timestamp}</p>
          <p><b>Added:</b> {v.addedWords.join(", ") || "None"}</p>
          <p><b>Removed:</b> {v.removedWords.join(", ") || "None"}</p>
          <p><b>Old Length:</b> {v.oldLength}</p>
          <p><b>New Length:</b> {v.newLength}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
