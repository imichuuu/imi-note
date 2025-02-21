document.addEventListener("DOMContentLoaded", fetchNotes);

function fetchNotes() {
    fetch('/notes')
        .then(response => response.json())
        .then(notes => {
            const noteContainer = document.getElementById('noteList');
            noteContainer.innerHTML = "";
            notes.forEach(note => {
                const noteItem = document.createElement("div");
                noteItem.classList.add("note");

                // Encode title and content to avoid errors
                const encodedTitle = encodeURIComponent(note.title);
                const encodedContent = encodeURIComponent(note.content);

                noteItem.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    <button class="edit-btn" onclick="editNote(${note.id}, '${encodedTitle}', '${encodedContent}')">EDIT</button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">DELETE</button>
                `;
                noteContainer.appendChild(noteItem);
            });
        });
}

function addOrUpdateNote() {
    let id = document.getElementById("noteId").value;
    let title = document.getElementById("noteTitle").value;
    let content = document.getElementById("noteContent").value;

    if (!title || !content) {
        alert("Please enter both title and content!");
        return;
    }

    const data = { title, content };

    let method = id ? "PUT" : "POST";
    let url = id ? `/notes/${id}` : "/notes";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(() => {
        fetchNotes();
        resetForm();
    });
}

function editNote(id, encodedTitle, encodedContent) {
    document.getElementById("noteId").value = id;
    document.getElementById("noteTitle").value = decodeURIComponent(encodedTitle);
    document.getElementById("noteContent").value = decodeURIComponent(encodedContent);
    document.getElementById("saveButton").textContent = "UPDATE NOTE";
}

function deleteNote(id) {
    fetch(`/notes/${id}`, { method: "DELETE" })
        .then(() => fetchNotes());
}

function resetForm() {
    document.getElementById("noteId").value = "";
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("saveButton").textContent = "SAVE NOTE";
}
