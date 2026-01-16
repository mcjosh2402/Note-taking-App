const newNoteBtn = document.querySelector("#new-btn")
const cancelBtn = document.querySelector(".cancel-btn")
const saveBtn = document.querySelector(".save-btn")
const modalOverlay = document.querySelector(".modal-overlay")
const notesDisplayGrid = document.querySelector(".notes-display")
const textArea = document.getElementById("text-area")
const imageUploadBtn = document.getElementById("image-upload-btn")
const imageFileInput = document.getElementById("image-file-input")

const colors = {
    green: '#ABE7B2',
    blue: '#8CE4FF',
    black: '#D3DAD9',
    pink: '#FFAAB8',
    default: '#f1e9db'
}

let notes = getNotes()
let selectedColor = "default"
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
    editingId = null
    document.getElementById("title").value = ""
    document.getElementById("text-area").innerHTML = ""
    document.querySelector(".modal-content").id = "default"
    modalOn()
    document.getElementById("title").focus()
})

cancelBtn.addEventListener("click", () => {
    document.getElementById("title").value = ""
    document.getElementById("text-area").innerHTML = ""
    selectedColor = "default"
    editingId = null
    modalOff()
})

saveBtn.addEventListener("click", (e) => {
    e.preventDefault()
    addNote(editingId)
    editingId = null
})

// change note color
document.querySelector(".color-tags").addEventListener("click", (event) => {
    selectedColor = event.target.id
    document.querySelector(".modal-content").id = event.target.id
})

// Handle image upload button click
imageUploadBtn.addEventListener("click", () => {
    imageFileInput.click()
})

// Handle image file input change
imageFileInput.addEventListener("change", (e) => {
    const files = e.target.files
    
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') !== -1) {
            const reader = new FileReader()
            
            reader.onload = (event) => {
                const img = document.createElement('img')
                img.src = event.target.result
                img.style.maxWidth = '100%'
                img.style.height = 'auto'
                img.style.borderRadius = '8px'
                img.style.margin = '8px 0'
                
                textArea.appendChild(img)
                textArea.appendChild(document.createElement('br'))
            }
            reader.readAsDataURL(files[i])
        }
    }
    imageFileInput.value = ''
})

// Handle image paste
textArea.addEventListener('paste', (e) => {
    e.preventDefault()
    
    const items = e.clipboardData.items
    let hasImage = false
    
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            hasImage = true
            const blob = items[i].getAsFile()
            const reader = new FileReader()
            
            reader.onload = (event) => {
                const img = document.createElement('img')
                img.src = event.target.result
                img.style.maxWidth = '100%'
                img.style.height = 'auto'
                img.style.borderRadius = '8px'
                img.style.margin = '8px 0'
                
                const selection = window.getSelection()
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0)
                    range.deleteContents()
                    range.insertNode(img)
                    
                    range.setStartAfter(img)
                    range.collapse(true)
                    selection.removeAllRanges()
                    selection.addRange(range)
                }
            }
            reader.readAsDataURL(blob)
        }
    }
})

function updateNotes() {
    notesDisplayGrid.innerHTML = ""
    notes.forEach((note) => {
        createNote(note.id, note.title, note.content, note.modifyTime, note.color)
    })
}

function addNote(noteId) { // save-edit mode if noteId are passed in
    const titleText = document.getElementById("title").value.trim()
    const noteContent = document.getElementById("text-area").innerHTML.trim()

    if(noteId){
        const noteEditing = notes.find(note => note.id === String(noteId))
        noteEditing.title = titleText
        noteEditing.content = noteContent
        noteEditing.modifyTime = Date.now()
        noteEditing.color = selectedColor
    }
    else{
        const noteObject = {
            id: generateId(),
            title: titleText,
            content: noteContent,
            modifyTime: Date.now(),
            color: selectedColor
        }
        notes.unshift(noteObject)
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
    selectedColor = noteEditing.color || "default"
    document.querySelector(".modal-content").id = selectedColor  
    modalOn()
    document.getElementById("title").value = noteEditing.title
    document.getElementById("text-area").innerHTML = noteEditing.content
    document.getElementById("title").focus()
}

function createNote(noteId, noteTitle, noteContent, modifyTime, noteColor){
    const cardHTML = `
        <div class="card" id="${noteColor}">
            <div class="card-top">
                <h2>${noteTitle}</h2>
                <button class="delete-btn" onclick="deleteNote(${noteId})">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </button>
            </div>
            <div class="card-body" onclick="editNote(${noteId})">
                <div class="card-content">${noteContent}</div>
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

