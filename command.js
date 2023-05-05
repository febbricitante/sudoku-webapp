// Select a cell and add appropriate classes
function selectCell(cell) {
  clearSelection()
  cell.classList.add('selected')

  const row = cell.getAttribute('row')
  const col = cell.getAttribute('column')
  const region = cell.getAttribute('region')

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
export { selectCell, clearSelection }
