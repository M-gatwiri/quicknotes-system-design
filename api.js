const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function renderNotes(notes) {
    notesList.replaceChildren();

    if (notes.length === 0) {
        showStatus("No notes found. Create one to get started.");
        return;
    }

    notes.forEach((note) => {
        const listItem = document.createElement("li");
        const title = document.createElement("h3");
        const body = document.createElement("p");
        const deleteButton = document.createElement("button");

        title.textContent = note.title;
        body.textContent = note.body;

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => deleteNote(note.id, listItem));

        listItem.append(title, body, deleteButton);
        notesList.appendChild(listItem);
    });
}

async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...");

    try {
        const notes = await request(`${API_URL}?_limit=10`);
        renderNotes(notes);

        if (notes.length > 0) {
            showStatus("Notes loaded successfully.", "success");
        }
    } catch (error) {
        showStatus(`Could not load notes: ${error.message}`, "error");
    } finally {
        loadButton.disabled = false;
    }
}

async function createNote(title, body) {
    const submitButton = document.getElementById("submit-btn");

    submitButton.disabled = true;
    showStatus("Creating note...");

    try {
        const newNote = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

       const listItem = document.createElement("li");
const heading = document.createElement("h3");
const content = document.createElement("p");
const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";
deleteButton.type = "button";
deleteButton.addEventListener("click", () => deleteNote(newNote.id, listItem));

        heading.textContent = newNote.title;
        content.textContent = newNote.body;

        listItem.append(heading, content, deleteButton);
        notesList.prepend(listItem);

        showStatus("Note created successfully.", "success");
        return true;
    } catch (error) {
        showStatus(`Could not create note: ${error.message}`, "error");
        return false;
    } finally {
        submitButton.disabled = false;
    }
}

async function deleteNote(noteId, listItem) {
    const deleteButton = listItem.querySelector("button");

    deleteButton.disabled = true;
    showStatus("Deleting note...");

    try {
        await request(`${API_URL}/${noteId}`, {
            method: "DELETE"
        });

        listItem.remove();
        showStatus("Note deleted successfully.", "success");

        if (notesList.children.length === 0) {
            showStatus("No notes remaining. Create one to get started.");
        }
    } catch (error) {
        showStatus(`Could not delete note: ${error.message}`, "error");
        deleteButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);

const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");

noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Please enter a note title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus("The title must not exceed 100 characters.", "error");
        return;
    }

    const created = await createNote(title, body);

    if (created) {
        noteForm.reset();
    }
});