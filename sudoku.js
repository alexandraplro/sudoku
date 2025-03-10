document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");

  // Example starting numbers for Sudoku (0 means empty cell)
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  // Create the grid and populate with numbers
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (puzzle[row][col] !== 0) {
        cell.textContent = puzzle[row][col]; // Pre-filled number
        cell.classList.add("fixed"); // Fixed cell styling
      } else {
        const input = document.createElement("input");
        input.type = "text"; // Allow users to type numbers directly
        input.maxLength = 1; // Limit to a single character (1-9)
        cell.appendChild(input);
      }
      grid.appendChild(cell);
    }
  }
});
