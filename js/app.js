const newNoteBtn = document.querySelector("#new-btn")
const cancelBtn = document.querySelector(".cancel-btn")
const saveBtn = document.querySelector(".save-btn")
const modalOverlay = document.querySelector(".modal-overlay")
const notesDisplayGrid = document.querySelector(".notes-display")
const deleteBtn = document.querySelector(".delete-btn")

let notes = getNotes()
let editingId = null
updateNotes()

// model visibility (on / off)
function modalOn() {
    modalOverlay.classList.remove("hidden")
}
function modalOff() {
    modalOverlay.classList.add("hidden")
}


newNoteBtn.addEventListener("click", () => {
    modalOn()
    document.getElementById("title").focus()
})

cancelBtn.addEventListener("click", () => {
    document.getElementById("title").value = ""
    document.getElementById("text-area").value = ""
    modalOff()
})

saveBtn.addEventListener("click", (e) => {
    e.preventDefault()
    addNote(editingId)
    editingId = null
})

function updateNotes() {
    notesDisplayGrid.innerHTML = ""
    notes.forEach((note) => {
        createNote(note.id, note.title, note.content)
    })
}

function addNote(noteId) { 
    const titleText = document.getElementById("title").value.trim()
    const noteContent = document.getElementById("text-area").value.trim()
    if(noteId){
        const noteEditing = notes.find(note => note.id === String(noteId))
        noteEditing.title = titleText
        noteEditing.content = noteContent
        console.log(noteEditing)
    }
    else{
        const noteObject = {
            id: generateId(),
            title: titleText,
            content: noteContent
        }
        notes.unshift(noteObject)
        document.getElementById("title").value = ""
        document.getElementById("text-area").value = ""
    }
    saveNotes()
    updateNotes() 
    modalOff()
}

function generateId(){
    return Date.now().toString()
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== String(noteId))
    saveNotes()
    updateNotes();
}

function editNote(noteId){
    editingId = noteId
    const noteEditing = notes.find(note => note.id === String(noteId))
    modalOn()
    document.getElementById("title").value = noteEditing.title
    document.getElementById("text-area").value = noteEditing.content
    document.getElementById("title").focus()
}

function createNote(noteId, noteTitle, noteContent){
    const cardHTML = `
        <div class="card">
            <div class="card-top">
                <h2>${noteTitle}</h2>
                <button class="delete-btn" onclick="deleteNote(${noteId})">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </button>
            </div>
            <div class="card-body" onclick="editNote(${noteId})">
                <div class="card-content">
                    <p>${noteContent}</p>
                </div>
                <div class="card-footer">
                    <p> hello </p>
                    <!--will add time in later-->
                </div>
            </div>
            
        </div>
    `
    notesDisplayGrid.insertAdjacentHTML('beforeend', cardHTML)
}

function saveNotes() {
    const noteJson = JSON.stringify(notes)
    localStorage.setItem("note", noteJson)
}

function getNotes() {
    const notes = localStorage.getItem("note") || "[]"
    return JSON.parse(notes)
}