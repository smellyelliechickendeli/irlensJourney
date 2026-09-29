const STORAGE_KEY = "irlens-log-entries-v1";

const form = document.querySelector("#entry-form");
const idInput = document.querySelector("#entry-id");
const titleInput = document.querySelector("#entry-title");
const contentInput = document.querySelector("#entry-content");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-edit");
const entriesList = document.querySelector("#entries-list");
const formMessage = document.querySelector("#form-message");
const editor = document.querySelector("#entry-editor");
const editorToggle = document.querySelector("#entry-toggle");

function readEntries() {
    try {
        const savedEntries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(savedEntries) ? savedEntries : [];
    } catch {
        return [];
    }
}

let entries = readEntries();

function saveEntries() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        formMessage.textContent = "";
        return true;
    } catch {
        formMessage.textContent = "Entries could not be saved in this browser.";
        return false;
    }
}

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function renderEntries() {
    entriesList.replaceChildren();

    if (entries.length === 0) {
        entriesList.append(makeElement("p", "empty-state", "No entries yet."));
        return;
    }

    [...entries]
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
        .forEach((entry) => {
            const article = makeElement("article", "entry");
            const title = makeElement("h3", "", entry.title || "Untitled entry");
            const date = makeElement("p", "entry-date", `Posted ${formatDate(entry.createdAt)}`);
            const content = makeElement("p", "entry-content", entry.content);
            const actions = makeElement("div", "entry-actions");
            const editButton = makeElement("button", "", "Edit");
            const deleteButton = makeElement("button", "", "Delete");

            editButton.type = "button";
            editButton.addEventListener("click", () => startEditing(entry));
            deleteButton.type = "button";
            deleteButton.addEventListener("click", () => deleteEntry(entry.id));

            actions.append(editButton, deleteButton);
            article.append(title, date, content, actions);
            entriesList.append(article);
        });
}

function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

function resetForm() {
    form.reset();
    idInput.value = "";
    submitButton.textContent = "Post entry";
    cancelButton.hidden = true;
    document.querySelector("#editor-heading").textContent = "Write an entry";
}

function setEditorOpen(open) {
    editor.hidden = !open;
    editorToggle.setAttribute("aria-expanded", String(open));
    editorToggle.textContent = open ? "close entry form" : "write an entry";
}

function startEditing(entry) {
    idInput.value = entry.id;
    idInput.value = entry.id;
    titleInput.value = entry.title;
    contentInput.value = entry.content;
    submitButton.textContent = "Save changes";
    cancelButton.hidden = false;
    document.querySelector("#editor-heading").textContent = "Edit entry";
    setEditorOpen(true);
    titleInput.focus();
}

function deleteEntry(id) {
    entries = entries.filter((entry) => entry.id !== id);
    if (saveEntries()) {
        renderEntries();
        if (idInput.value === id) resetForm();
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const existingEntry = entries.find((entry) => entry.id === idInput.value);

    if (existingEntry) {
        existingEntry.title = titleInput.value.trim();
        existingEntry.content = contentInput.value.trim();
        existingEntry.updatedAt = now;
    } else {
        entries.push({
            id: crypto.randomUUID(),
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            createdAt: now,
        });
    }

    if (saveEntries()) {
        resetForm();
        setEditorOpen(false);
        renderEntries();
    }
});

editorToggle.addEventListener("click", () => setEditorOpen(editor.hidden));
cancelButton.addEventListener("click", () => {
    resetForm();
    setEditorOpen(false);
});
renderEntries();