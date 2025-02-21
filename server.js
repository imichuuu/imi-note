const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

let notes = [
    { id: 1, title: "Welcome Note", content: "This is your first note. Edit or delete it!" }
];

// Get all notes
app.get("/notes", (req, res) => {
    res.json(notes);
});

// Add a new note
app.post("/notes", (req, res) => {
    const newNote = { id: notes.length + 1, ...req.body };
    notes.push(newNote);
    res.status(201).json(newNote);
});

// Update a note
app.put("/notes/:id", (req, res) => {
    let note = notes.find(n => n.id == req.params.id);
    if (note) {
        Object.assign(note, req.body);
        res.json(note);
    } else {
        res.status(404).json({ message: "Note not found" });
    }
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
    notes = notes.filter(n => n.id != req.params.id);
    res.json({ message: "Note deleted" });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
