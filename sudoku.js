document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");

  // Example Sudoku puzzle (0 means empty cells)
  let initialPuzzle = [
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

  let currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));

  // Function to render the Sudoku grid
  function renderPuzzle(puzzle) {
    grid.innerHTML = "";
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
            } else {
              currentPuzzle[row][col] = parseInt(this.value);
            }
          });
          cell.appendChild(input);
        }
        grid.appendChild(cell);
      }
    }
  }

  // Validate if the current Sudoku is solved correctly
  function isValidSudoku(board) {
    function isUnique(array) {
      let nums = array.filter(num => num !== 0);
      return nums.length === new Set(nums).size;
    }

    for (let row = 0; row < 9; row++) {
      if (!isUnique(board[row])) return false;
    }

    for (let col = 0; col < 9; col++) {
      let column = board.map(row => row[col]);
      if (!isUnique(column)) return false;
    }

    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        let grid = [];
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            grid.push(board[i + x][j + y]);
          }
        }
        if (!isUnique(grid)) return false;
      }
    }

    return true;
  }

  // Handle New Game button
  document.getElementById("new-game").addEventListener("click", () => {
    alert("Generating a new puzzle!");
    // Ideally, generate a new puzzle (static puzzle for now)
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  // Handle Check Solution button
  document.getElementById("check-solution").addEventListener("click", () => {
    if (isValidSudoku(currentPuzzle)) {
      alert("Congratulations! The solution is correct!");
    } else {
      alert("The solution is incorrect. Keep trying!");
    }
  });

  // Handle Reset button
  document.getElementById("reset").addEventListener("click", () => {
    alert("Resetting the puzzle!");
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  // Initial render
  renderPuzzle(currentPuzzle);
});
