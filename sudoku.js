document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");
  const timerElement = document.getElementById("timer");
  let timerInterval;
  let selectedInput = null; // Track the currently selected cell input

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

  // Render Sudoku Grid
  function renderPuzzle(puzzle) {
    grid.innerHTML = ""; // Clear the grid
    puzzle.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (value !== 0) {
          cell.textContent = value;
          cell.classList.add("fixed");
        } else {
          const input = document.createElement("input");
          input.type = "text";
          input.maxLength = 1;
          input.setAttribute("aria-label", `Cell at row ${rowIndex + 1}, column ${colIndex + 1}`);
          input.dataset.row = rowIndex; // Save row index for logic
          input.dataset.col = colIndex; // Save col index for logic
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

  // Handle Keypad Button Clicks
  document.querySelectorAll(".keypad-btn").forEach((button) => {
    button.addEventListener("click", function () {
      if (!selectedInput) {
        alert("Please select a cell first!");
        return;
      }

      const value = this.getAttribute("data-value");
      if (value === "0") {
        // Clear the cell
        selectedInput.value = "";
        const row = selectedInput.dataset.row;
        const col = selectedInput.dataset.col;
        currentPuzzle[row][col] = 0;
      } else if (/^[1-9]$/.test(value)) {
        // Set the value in the selected cell
        selectedInput.value = value;
        const row = selectedInput.dataset.row;
        const col = selectedInput.dataset.col;
        currentPuzzle[row][col] = parseInt(value);
      }
    });
  });

  // Button Event Listeners
  document.getElementById("new-game").addEventListener("click", () => {
    resetTimer();
    startTimer();
    initialPuzzle = generateSudoku(selectedDifficulty);
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  document.getElementById("reset").addEventListener("click", () => {
    resetTimer();
    startTimer();
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  document.getElementById("check-solution").addEventListener("click", () => {
    clearInterval(timerInterval); // Stop the timer
    if (isValidSudoku(currentPuzzle)) {
      alert("Congratulations! The solution is correct!");
    } else {
      alert("The solution is incorrect. Keep trying!");
      startTimer(); // Resume timer if incorrect
    }
  });

  // Validate the Sudoku Board
  function isValidSudoku(board) {
    function isUnique(array) {
      const nums = array.filter(num => num !== 0);
      return nums.length === new Set(nums).size;
    }

    for (let i = 0; i < 9; i++) {
      if (!isUnique(board[i])) return false; // Check rows
      if (!isUnique(board.map(row => row[i]))) return false; // Check columns
    }

    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const grid = [];
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

  // Start the initial game and timer
  startTimer();
  renderPuzzle(currentPuzzle);
});
