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

        title.textContent = note.title;
        body.textContent = note.body;

        listItem.append(title, body);
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

loadButton.addEventListener("click", loadNotes);