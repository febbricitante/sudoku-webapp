import { generateNewGame } from './sudokuAlgorithm.js'

// script.js

// Constants for difficulty levels
const EASY = 35
const MEDIUM = 30
const HARD = 25
const ELITE = 20

// Initialize the board and commands
document.addEventListener('DOMContentLoaded', () => {
  initBoard()
  initCommands()
  generateNewGame(EASY)
})

// Initialize the Sudoku board
function initBoard() {
  const sudokuBoard = document.getElementById('sudoku-board')

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')

      // Assign row, column, and region attributes
      cell.setAttribute('row', row)
      cell.setAttribute('column', col)
      const region = Math.floor(row / 3) * 3 + Math.floor(col / 3)
      cell.setAttribute('region', region)

      // Add click event listener to select the cell
      cell.addEventListener('click', () => {
        selectCell(cell)
      })

      sudokuBoard.appendChild(cell)
    }
  }
}

// Initialize the command buttons
function initCommands() {
  const commands = document.querySelector('.sudoku-commands')

  // Add new game button
  const newGameButton = document.createElement('button')
  newGameButton.textContent = 'New Game'
  newGameButton.addEventListener('click', () => {
    generateNewGame(EASY)
  })
  commands.appendChild(newGameButton)

  // Add notes functionality
  let notesActive = false // Flag to track if notes functionality is ON or OFF
  const addNotesButton = document.createElement('button')
  addNotesButton.textContent = 'Add Notes'
  addNotesButton.addEventListener('click', () => {
    notesActive = !notesActive // Toggle notes functionality
    addNotesButton.classList.toggle('notes-active') // Add a class to indicate the button's state
  })
  commands.appendChild(addNotesButton)

  // Add number buttons
  for (let number = 1; number <= 9; number++) {
    const button = document.createElement('button')
    button.textContent = number
    button.addEventListener('click', () => {
      const selectedCell = document.querySelector('.selected')
      if (selectedCell && !selectedCell.classList.contains('clue')) {
        if (notesActive) {
          // Add, update or remove the note in the selected cell
          handleNotes(selectedCell, number)
        } else {
          selectedCell.textContent = number
          selectedCell.classList.add('candidate-present')
          checkConflicts() // Call the checkConflicts function here
        }
      }
    })
    commands.appendChild(button)
  }

  // Add erase button
  const eraseButton = document.createElement('button')
  eraseButton.textContent = 'Erase'
  eraseButton.addEventListener('click', () => {
    const selectedCell = document.querySelector('.selected')
    if (selectedCell && !selectedCell.classList.contains('clue')) {
      if (notesActive) {
        // Clear notes from the cell
        clearNotes(selectedCell)
      } else {
        selectedCell.textContent = ''
        selectedCell.classList.remove('mistake-present')
        selectedCell.classList.remove('candidate-present')
        checkConflicts() // Call the checkConflicts function here
      }
    }
  })
  commands.appendChild(eraseButton)
}

function handleNotes(selectedCell, number) {
  // Check if the selected cell contains the "candidate-present" class
  if (selectedCell.classList.contains('candidate-present')) {
    return // If the class exists, don't add a note and exit the function
  }

  // Check if the note with the given number already exists in the selected cell
  const existingNote = selectedCell.querySelector(`.note-${number}`)

  if (existingNote) {
    // If the note already exists, remove it
    selectedCell.removeChild(existingNote)
  } else {
    // If the note doesn't exist, create a new div with the note number and classes
    const note = document.createElement('div')
    note.textContent = number
    note.classList.add('notes', `note-${number}`)
    selectedCell.appendChild(note)
  }
}

function clearNotes(selectedCell) {
  // Get all note elements in the selected cell
  const notes = selectedCell.querySelectorAll('.notes')

  // Remove each note element from the selected cell
  notes.forEach((note) => selectedCell.removeChild(note))
}

// Select a cell and add appropriate classes
function selectCell(cell) {
  clearSelection()
  cell.classList.add('selected')

  const row = parseInt(cell.getAttribute('row'), 10)
  const col = parseInt(cell.getAttribute('column'), 10)
  const region = parseInt(cell.getAttribute('region'), 10)

  document.querySelectorAll(`[row="${row}"]`).forEach((cell) => {
    cell.classList.add('selected-row')
  })

  document.querySelectorAll(`[column="${col}"]`).forEach((cell) => {
    cell.classList.add('selected-column')
  })

  document.querySelectorAll(`[region="${region}"]`).forEach((cell) => {
    cell.classList.add('selected-region')
  })
}

// Clear selection classes
function clearSelection() {
  const cells = document.querySelectorAll('.cell')
  cells.forEach((cell) => {
    cell.classList.remove('selected', 'selected-row', 'selected-column', 'selected-region')
  })
}

// Function to check for conflicts in the Sudoku board
function checkConflicts() {
  // Get all the cells and the selected cell
  const cells = document.querySelectorAll('.cell')
  const selectedCell = document.querySelector('.selected')

  // Create sets for rows, columns, and regions
  const rows = new Array(9).fill(0).map(() => new Set())
  const cols = new Array(9).fill(0).map(() => new Set())
  const regions = new Array(9).fill(0).map(() => new Set())

  // Initialize rows, cols, and regions with clues
  cells.forEach((cell) => {
    if (cell.classList.contains('clue')) {
      const value = parseInt(cell.textContent, 10)
      const row = parseInt(cell.getAttribute('row'), 10)
      const col = parseInt(cell.getAttribute('column'), 10)
      const region = parseInt(cell.getAttribute('region'), 10)

      rows[row].add(value)
      cols[col].add(value)
      regions[region].add(value)
    }
  })

  // Check for conflicts in the selected cell
  const conflictDetected = checkCellConflict(selectedCell, rows, cols, regions)

  // If a conflict is detected, add the 'mistake-present' class to the selected cell
  if (conflictDetected) {
    selectedCell.classList.add('mistake-present')
  } else {
    // If no conflict is detected, remove the 'mistake-present' class from the selected cell
    selectedCell.classList.remove('mistake-present')
  }
}

// Function to check if there's a conflict for a specific cell
function checkCellConflict(cell, rows, cols, regions) {
  // Get the value of the cell
  const value = parseInt(cell.textContent, 10)

  // If the value is not a number, there's no conflict
  if (isNaN(value)) {
    return false
  }

  // Get the row, column, and region attributes of the cell
  const row = parseInt(cell.getAttribute('row'), 10)
  const col = parseInt(cell.getAttribute('column'), 10)
  const region = parseInt(cell.getAttribute('region'), 10)

  // Check if the value is already present in the corresponding row, column, or region set
  if (rows[row].has(value) || cols[col].has(value) || regions[region].has(value)) {
    return true // Conflict detected
  } else {
    // If there's no conflict, add the value to the corresponding row, column, and region sets
    rows[row].add(value)
    cols[col].add(value)
    regions[region].add(value)
    return false // No conflict detected
  }
}

// RESIZE //
// RESIZE //
// RESIZE //
// RESIZE //
// RESIZE //
// RESIZE //

// Set the initial board size
resizeSudokuBoard()

// Add an event listener for window resize
window.addEventListener('resize', resizeSudokuBoard)

// Function to resize the Sudoku board
function resizeSudokuBoard() {
  const sudokuBoard = document.getElementById('sudoku-board')
  const boardWidth = sudokuBoard.offsetWidth
  sudokuBoard.style.height = boardWidth + 'px'
}
