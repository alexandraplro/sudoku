document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");
  const timerElement = document.getElementById("timer");
  let timerInterval;
  let selectedInput = null; // Track the currently selected cell input
  const inputs = []; // Store all input elements for navigation

  // Timer setup
  function startTimer() {
    clearInterval(timerInterval); // Ensure no duplicate timers
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }

      const formattedTime =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
      timerElement.textContent = formattedTime;
    }, 1000); // Update every second
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = "00:00:00"; // Reset timer display
  }

  // Generate a Sudoku puzzle with difficulty
  function generateSudoku(difficulty) {
    const solution = [
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

    let cellsToRemove = difficulty === "easy" ? 20 : difficulty === "medium" ? 40 : 60;
    const puzzle = JSON.parse(JSON.stringify(solution)); // Deep copy of the solution

    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0; // Remove cell value
        cellsToRemove--;
      }
    }

    return puzzle;
  }

  let selectedDifficulty = "medium";
  let initialPuzzle = generateSudoku(selectedDifficulty);
  let currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));

  function renderPuzzle(puzzle) {
  grid.innerHTML = ""; // Clear the grid
  inputs.length = 0; // Reset inputs array for navigation

  console.log("Puzzle data being rendered:", puzzle);
  console.log("Grid container element:", grid);

  puzzle.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      console.log(`Rendering cell at row ${rowIndex}, col ${colIndex} with value:`, value);
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Determine subgrid colors
      const subgridRow = Math.floor(rowIndex / 3);
      const subgridCol = Math.floor(colIndex / 3);
      const isSubgridEven = (subgridRow + subgridCol) % 2 === 0;
      cell.style.backgroundColor = isSubgridEven ? "var(--subgrid-color-1)" : "var(--subgrid-color-2)";

      // Add subgrid-specific classes for borders
      if (rowIndex % 3 === 0) cell.classList.add("top-border");
      if (colIndex % 3 === 0) cell.classList.add("left-border");
      if (rowIndex % 3 === 2) cell.classList.add("bottom-border");
      if (colIndex % 3 === 2) cell.classList.add("right-border");

      // Handle fixed values and inputs
      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add("fixed");
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.dataset.row = rowIndex;
        input.dataset.col = colIndex;

        // Add input to inputs array for navigation
        inputs.push(input);

        input.addEventListener("click", function () {
          if (selectedInput) selectedInput.classList.remove("selected");
          selectedInput = this;
          selectedInput.classList.add("selected");
        });

        input.addEventListener("input", function () {
          if (/^[1-9]$/.test(this.value)) {
            currentPuzzle[rowIndex][colIndex] = parseInt(this.value);
          } else {
            this.value = ""; // Clear invalid input
          }
        });

        cell.appendChild(input);
      }

      grid.appendChild(cell);
    });
  });
}

         
    // Add keyboard navigation
    inputs.forEach((input, index) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" && index >= 9) inputs[index - 9].focus();
        else if (e.key === "ArrowDown" && index < 72) inputs[index + 9].focus();
        else if (e.key === "ArrowLeft" && index % 9 !== 0) inputs[index - 1].focus();
        else if (e.key === "ArrowRight" && (index + 1) % 9 !== 0) inputs[index + 1].focus();
      });
    });
  }

document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(level => {
  level.addEventListener("click", function () {
    selectedDifficulty = this.textContent.trim().toLowerCase(); // Convert to lowercase
    console.log(`Selected difficulty: ${selectedDifficulty}`);
  });
});

  
// Start a new game
document.getElementById("new-game").addEventListener("click", function () {
  initialPuzzle = generateSudoku(selectedDifficulty); // Generate new puzzle
  currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
  renderPuzzle(currentPuzzle); // Render new puzzle
  resetTimer(); // Reset and restart the timer
  startTimer();
  });
});

// Reset the current game
document.getElementById("reset").addEventListener("click", function () {
  currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle)); // Reset to initial puzzle
  renderPuzzle(currentPuzzle); // Re-render puzzle
});

// Check the solution
document.getElementById("check-solution").addEventListener("click", function () {
  if (isValidSudoku(currentPuzzle)) {
    alert("Congratulations! The solution is correct.");
  } else {
    alert("Keep trying!");
  }
});
  
  // Validate the Sudoku Board
  function isValidSudoku(board) {
    function isUnique(array, highlightCells = []) {
      const nums = array.filter(num => num !== 0);
      const uniqueNums = new Set(nums);
      if (nums.length !== uniqueNums.size) {
        // Highlight invalid cells
        highlightCells.forEach(cell => cell.classList.add("error"));
        return false;
      }
      return true;
    }

    // Clear previous errors
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("error"));

    for (let i = 0; i < 9; i++) {
      const rowCells = grid.querySelectorAll(`input[data-row="${i}"]`);
      const colCells = grid.querySelectorAll(`input[data-col="${i}"]`);
      const rowValues = Array.from(rowCells).map(cell => parseInt(cell.value) || 0);
      const colValues = Array.from(colCells).map(cell => parseInt(cell.value) || 0);

      if (!isUnique(rowValues, Array.from(rowCells))) return false; // Check rows
      if (!isUnique(colValues, Array.from(colCells))) return false; // Check columns
    }

    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const subgridCells = [];
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            subgridCells.push(grid.querySelector(`input[data-row="${i + x}"][data-col="${j + y}"]`));
          }
        }
        const subgridValues = subgridCells.map(cell => parseInt(cell.value) || 0);
        if (!isUnique(subgridValues, subgridCells)) return false;
      }
    }

    return true;
  }

  // Start the initial game and timer
  startTimer();
  renderPuzzle(currentPuzzle);
});
