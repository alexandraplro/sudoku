document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");

  // Example Sudoku puzzle (0 means empty cells)
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

  // Populate Sudoku grid
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (puzzle[row][col] !== 0) {
        cell.textContent = puzzle[row][col]; // Display fixed numbers
        cell.classList.add("fixed");
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1; // Limit input to single digit
        input.addEventListener("input", function () {
          // Allow only numbers 1-9
          if (!/^[1-9]$/.test(this.value)) {
            this.value = "";
          }
        });
        cell.appendChild(input);
      }
      grid.appendChild(cell);
    }
  }

  // Placeholder for "New Game", "Check Solution", and "Reset" button functionality
  document.getElementById("new-game").addEventListener("click", () => {
    alert("New Game Starting!");
  });

  document.getElementById("check-solution").addEventListener("click", () => {
    alert("Check Solution functionality to be implemented!");
  });

  document.getElementById("reset").addEventListener("click", () => {
    alert("Reset functionality to be implemented!");
  });
});
