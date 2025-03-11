document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");

  // Generate a Sudoku puzzle with difficulty
  function generateSudoku(difficulty) {
    // Base puzzle (a full solution can be generated programmatically too)
    let solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    // Remove cells to match the difficulty level
    let cellsToRemove;
    if (difficulty === "easy") {
      cellsToRemove = 20; // Fewer cells removed
    } else if (difficulty === "medium") {
      cellsToRemove = 40;
    } else if (difficulty === "hard") {
      cellsToRemove = 60; // More cells removed
    }

    let puzzle = JSON.parse(JSON.stringify(solution));
    while (cellsToRemove > 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        cellsToRemove--;
      }
    }

    return puzzle;
  }

  let initialPuzzle = generateSudoku("medium"); // Default difficulty
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

  // Handle New Game with selected difficulty
  document.getElementById("new-game").addEventListener("click", () => {
    let difficulty = prompt("Choose difficulty: easy, medium, or hard");
    if (["easy", "medium", "hard"].includes(difficulty)) {
      initialPuzzle = generateSudoku(difficulty);
      currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
      renderPuzzle(currentPuzzle);
    } else {
      alert("Invalid difficulty! Defaulting to medium.");
      initialPuzzle = generateSudoku("medium");
      currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
      renderPuzzle(currentPuzzle);
    }
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
