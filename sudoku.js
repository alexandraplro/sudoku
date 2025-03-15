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
    console.log("Timer started");
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = "00:00:00"; // Reset timer display
    console.log("Timer reset");
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
  console.log("Generated puzzle array (Initial):", initialPuzzle);
  let currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));

  function renderPuzzle(puzzle) {
  console.log("Rendering Sudoku grid...");
  grid.innerHTML = ""; // Clear the grid
  inputs.length = 0; // Reset inputs array for navigation

  // Iterate through rows and columns to create cells
  puzzle.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      console.log(`Rendering cell at row ${rowIndex}, col ${colIndex} with value:`, value);

      // Create a cell for each value in the puzzle
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Set alternating subgrid colors
      const subgridRow = Math.floor(rowIndex / 3);
      const subgridCol = Math.floor(colIndex / 3);
      const isSubgridEven = (subgridRow + subgridCol) % 2 === 0;
      cell.style.backgroundColor = isSubgridEven ? "var(--subgrid-color-1)" : "var(--subgrid-color-2)";

      // Add borders for subgrid visualization
      if (rowIndex % 3 === 0) cell.classList.add("top-border");
      if (colIndex % 3 === 0) cell.classList.add("left-border");
      if (rowIndex % 3 === 2) cell.classList.add("bottom-border");
      if (colIndex % 3 === 2) cell.classList.add("right-border");

      // Populate cells with fixed values or input fields
      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add("fixed");
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.dataset.row = rowIndex;
        input.dataset.col = colIndex;

        // Add the input element to the `inputs` array
        inputs.push(input);

        // Add events for selecting and validating inputs
        input.addEventListener("click", function () {
          if (selectedInput) selectedInput.classList.remove("selected");
          selectedInput = this;
          selectedInput.classList.add("selected");
        });

        input.addEventListener("input", function () {
          if (/^[1-9]$/.test(this.value)) {
            currentPuzzle[rowIndex][colIndex] = parseInt(this.value, 10);
          } else {
            this.value = ""; // Clear invalid input
          }
        });

        // Add the input field to the cell
        cell.appendChild(input);
      }

      // Append the cell to the Sudoku grid
      grid.appendChild(cell);
    });
  });

  console.log("Sudoku grid rendered successfully!");
  console.log("Inputs for empty cells:", inputs);
}

         
    // Add keyboard navigation
    inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && index >= 9) inputs[index - 9].focus();
      else if (e.key === "ArrowDown" && index < 72) inputs[index + 9].focus();
      else if (e.key === "ArrowLeft" && index % 9 !== 0) inputs[index - 1].focus();
      else if (e.key === "ArrowRight" && (index + 1) % 9 !== 0) inputs[index + 1].focus();
    });
  }); // Closes the inputs.forEach loop


  document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(level => {
    level.addEventListener("click", function () {
    selectedDifficulty = this.textContent.trim().toLowerCase(); // Update the difficulty
    console.log(`Selected difficulty: ${selectedDifficulty}`);
    
    // Regenerate puzzle for the selected difficulty
    initialPuzzle = generateSudoku(selectedDifficulty); // Generate puzzle
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle)); // Deep copy for game state
    renderPuzzle(currentPuzzle); // Update the grid

    resetTimer(); // Reset the timer display
    startTimer(); // Restart the timer
  });
}); // Correctly closes the dropdown-menu listener loop

  document.getElementById("new-game").addEventListener("click", function () {
    initialPuzzle = generateSudoku(selectedDifficulty);
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
    resetTimer();
    startTimer();
  });

  document.getElementById("reset").addEventListener("click", function () {
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  document.getElementById("check-solution").addEventListener("click", function () {
    if (isValidSudoku(currentPuzzle)) {
      alert("Congratulations! The solution is correct.");
    } else {
      alert("Keep trying!");
    }
  });
  
  // 
  function isValidSudoku() {
  function isUnique(array, highlightCells = []) {
    const nums = array.filter(num => num !== 0); // Filter out empty cells
    const uniqueNums = new Set(nums);
    if (nums.length !== uniqueNums.size) {
      highlightCells.forEach(cell => cell && cell.classList.add("error")); // Highlight invalid cells
      return false;
    }
    return true;
  }

  // Clear previous error highlights
  document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("error"));

  // Check if the grid is fully filled
  const allInputs = grid.querySelectorAll("input");
  for (const input of allInputs) {
    if (!input.value || input.value === "0") {
      alert("The grid is not complete! Fill all the cells before checking.");
      return false;
    }
  }

  // Validate Rows and Columns
  for (let i = 0; i < 9; i++) {
    const rowCells = grid.querySelectorAll(`input[data-row="${i}"]`);
    const rowValues = Array.from(rowCells).map(cell => parseInt(cell.value) || 0);

    const colCells = grid.querySelectorAll(`input[data-col="${i}"]`);
    const colValues = Array.from(colCells).map(cell => parseInt(cell.value) || 0);

    if (!isUnique(rowValues, Array.from(rowCells))) return false; // Invalid row
    if (!isUnique(colValues, Array.from(colCells))) return false; // Invalid column
  }

  // Validate Subgrids
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      const subgridCells = [];
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          const cell = grid.querySelector(`input[data-row="${i + x}"][data-col="${j + y}"]`);
          subgridCells.push(cell);
        }
      }
      const subgridValues = subgridCells.map(cell => parseInt(cell.value) || 0);
      if (!isUnique(subgridValues, subgridCells)) return false; // Invalid subgrid
    }
  }

  return true; // Grid is valid
}


  // Start the initial game and timer
  startTimer();
  renderPuzzle(currentPuzzle);
});
