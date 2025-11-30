const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
let versions = [];
let previousText = "";

function getWordDiff(oldText, newText) {
  const oldWords = oldText.split(/\s+/).filter(Boolean);
  const newWords = newText.split(/\s+/).filter(Boolean);

  const oldSet = new Set(oldWords);
  const newSet = new Set(newWords);

  const added = newWords.filter(w => !oldSet.has(w));
  const removed = oldWords.filter(w => !newSet.has(w));

  return { added, removed };
}

app.post("/save-version", (req, res) => {
  const { text } = req.body;

  const diff = getWordDiff(previousText, text);

  const version = {
    id: uuidv4(),
    timestamp: new Date().toLocaleString(),
    addedWords: diff.added,
    removedWords: diff.removed,
    oldLength: previousText.length,
    newLength: text.length
  };

  versions.push(version);

  previousText = text;

  res.json(version);
});

app.get("/versions", (req, res) => {
  res.json(versions);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
