const newNoteBtn = document.querySelector("#new-btn")
const cancelBtn = document.querySelector(".cancel-btn")
const saveBtn = document.querySelector(".save-btn")
const modalOverlay = document.querySelector(".modal-overlay")
const notesDisplayGrid = document.querySelector(".notes-display")
const deleteBtn = document.querySelector(".delete-btn")
const colors = {
    green: '#3F4F45',
    blue: '#2F3A44',
    black: '#2E2B26',
    default: '#f1e9db'
}

document.querySelector(".color-tags").addEventListener("click", (event) => {
    if(event.target.matches("#color-green")){
        event.target.style.backgroundColor = colors.green
    }
})

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
        createNote(note.id, note.title, note.content, note.modifyTime)
    })
}

function addNote(noteId) { // save-edit mode if noteId are passed in
    const titleText = document.getElementById("title").value.trim()
    const noteContent = document.getElementById("text-area").value.trim()
    const now = Date.now()

    if(noteId){
        const noteEditing = notes.find(note => note.id === String(noteId))
        noteEditing.title = titleText
        noteEditing.content = noteContent
        noteEditing.modifyTime = now
    }
    else{
        const noteObject = {
            id: generateId(),
            title: titleText,
            content: noteContent,
            modifyTime: now
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

function createNote(noteId, noteTitle, noteContent, modifyTime){
    const cardHTML = `
        <div class="card">
            <div class="card-top">
                <h2>${noteTitle}</h2>
                <button class="delete-btn" onclick="deleteNote(${noteId})">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </button>
            </div>
            <div class="card-body" onclick="editNote(${noteId})">
                <p>${noteContent}</p>
            </div>
            <div class="card-footer">
                <time>${getTime(modifyTime)}</time>
            </div>
        </div>
    `
    notesDisplayGrid.insertAdjacentHTML('beforeend', cardHTML)
}

function getTime(time){
    const now = Date.now()
    const secDiff = Math.floor((now - time) / 1000)
    const minDiff = Math.floor(secDiff / 60)
    const hourDiff = Math.floor(minDiff / 60)
    const dayDiff = Math.floor(hourDiff / 24)


    if(secDiff < 60) return "edited just now"
    if(minDiff < 60) return `edited ${minDiff} minutes ago`
    if(hourDiff < 24) return `edited ${hourDiff} hours ago`
    if(dayDiff < 30) return `edited ${dayDiff} days ago`
}

function saveNotes() {
    const noteJson = JSON.stringify(notes)
    localStorage.setItem("note", noteJson)
}

function getNotes() {
    const notes = localStorage.getItem("note") || "[]"
    return JSON.parse(notes)
}