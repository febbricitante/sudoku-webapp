// Generate a new Sudoku game with a given difficulty
function generateNewGame(difficulty) {
  // Clear the board
  document.querySelectorAll('.cell').forEach((cell) => {
    cell.textContent = ''
    cell.classList.remove('clue') // Remove the 'clue' class if present
    cell.classList.remove('mistake-present') // Remove the 'mistake-present' class if present
  })

  // Generate a completely solved Sudoku board
  const completeBoard = generateCompleteBoard()

  // Generate a puzzle from the complete board with symmetric clues
  const puzzle = generateSymmetricPuzzle(completeBoard, difficulty)

  // Fill the HTML board with the puzzle's clues
  const cells = document.querySelectorAll('.cell')
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] !== 0) {
        const index = i * 9 + j
        cells[index].textContent = puzzle[i][j]
        cells[index].classList.add('clue')
      }
    }
  }
}

// Generate a completely solved Sudoku board
function generateCompleteBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0))
  fillBoard(board, 0, 0)
  return board
}

// Recursive function to fill a Sudoku board with valid numbers
function fillBoard(board, row, col) {
  if (row === 9) {
    return true
  }

  if (board[row][col] !== 0) {
    return fillBoard(board, col === 8 ? row + 1 : row, (col + 1) % 9)
  }

  // Shuffle numbers to increase randomness in generated boards
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

  for (const number of numbers) {
    if (isValidMove(board, row, col, number)) {
      board[row][col] = number

      if (fillBoard(board, col === 8 ? row + 1 : row, (col + 1) % 9)) {
        return true
      }
    }
  }

  board[row][col] = 0
  return false
}

// Check if a number is valid in the given position of the board
function isValidMove(board, row, col, number) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === number || board[i][col] === number) {
      return false
    }
  }

  const regionRow = Math.floor(row / 3) * 3
  const regionCol = Math.floor(col / 3) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[regionRow + i][regionCol + j] === number) {
        return false
      }
    }
  }

  return true
}

// Shuffle an array in a random order
function shuffleArray(array) {
  const newArr = array.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

// Generate a Sudoku puzzle with a unique solution by removing cells from a completely solved board
function generatePuzzle(board, difficulty) {
  const puzzle = JSON.parse(JSON.stringify(board))
  const totalCells = 81
  let cellsToRemove = totalCells - difficulty

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)

    if (puzzle[row][col] !== 0) {
      const temp = puzzle[row][col]
      puzzle[row][col] = 0
      cellsToRemove--

      const tempBoard = JSON.parse(JSON.stringify(puzzle))
      const solutions = countSolutions(tempBoard, 0, 0)

      if (solutions !== 1) {
        puzzle[row][col] = temp
        cellsToRemove++
      }
    }
  }

  return puzzle
}

// Recursive function to count the number of solutions for a given Sudoku board
function countSolutions(board, row, col) {
  if (row === 9) {
    return 1
  }

  if (board[row][col] !== 0) {
    return countSolutions(board, col === 8 ? row + 1 : row, (col + 1) % 9)
  }

  let solutionCount = 0

  for (let number = 1; number <= 9; number++) {
    if (isValidMove(board, row, col, number)) {
      board[row][col] = number
      solutionCount += countSolutions(board, col === 8 ? row + 1 : row, (col + 1) % 9)

      if (solutionCount > 1) {
        break
      }
    }
  }

  board[row][col] = 0
  return solutionCount
}

// Generate a symmetric Sudoku puzzle with a unique solution by removing symmetric cells from a completely solved board
function generateSymmetricPuzzle(board, difficulty) {
  const puzzle = JSON.parse(JSON.stringify(board))
  const totalCells = 81
  let cellsToRemove = totalCells - difficulty

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 5)
    const col = Math.floor(Math.random() * 9)

    if (puzzle[row][col] !== 0 && puzzle[8 - row][8 - col] !== 0) {
      const temp1 = puzzle[row][col]
      const temp2 = puzzle[8 - row][8 - col]
      puzzle[row][col] = 0
      puzzle[8 - row][8 - col] = 0
      cellsToRemove -= 2

      const tempBoard = JSON.parse(JSON.stringify(puzzle))
      const solutions = countSolutions(tempBoard, 0, 0)

      if (solutions !== 1) {
        puzzle[row][col] = temp1
        puzzle[8 - row][8 - col] = temp2
        cellsToRemove += 2
      }
    }
  }

  return puzzle
}

export { generateNewGame }
