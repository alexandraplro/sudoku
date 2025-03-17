let timerInterval; // Global scope

document.addEventListener("DOMContentLoaded", function () {  /* global grid, timerElement, timerInterval, inputs, selectedInput */
  const grid = document.getElementById("sudoku-grid");
  const timerElement = document.getElementById("timer");
  let timerInterval;
  let selectedInput = null; // Track the currently selected cell input
  const inputs = []; // Store all input elements for navigation
 
  // Add click event listeners to keypad buttons
  document.querySelectorAll(".keypad-btn").forEach(button => {
  button.addEventListener("click", function () {
    const value = this.dataset.value; 
    if (selectedInput && /^[1-9]$/.test(value)) { 
      selectedInput.value = value; 
    } else if (selectedInput && value === "0") { 
      selectedInput.value = ""; 
    } else {
      alert("Please select a cell first!");
    }
  });
}); // Correctly closes the forEach loop and its callback

  // "Contact Us" modal logic
  const sendMessageButton = document.getElementById("sendMessageButton");
  const nameField = document.getElementById("contactName");
  const emailField = document.getElementById("contactEmail");
  const messageField = document.getElementById("contactMessage");

  sendMessageButton.addEventListener("click", function () {
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    // Validate the form fields
    if (!name || !email || !message) {
      alert("Please fill out all fields before submitting.");
      if (!name) nameField.style.borderColor = "red";
      if (!email) emailField.style.borderColor = "red";
      if (!message) messageField.style.borderColor = "red";
      return;
    }

    // Clear the red borders if validation passes
    nameField.style.borderColor = "";
    emailField.style.borderColor = "";
    messageField.style.borderColor = "";

    // Example action: Display a thank-you message
    alert("Thank you for your message! We'll get back to you soon.");
  });

  // The "Close" button is already handled by Bootstrap's data-bs-dismiss="modal",
  // so no additional JavaScript is required for it.
}); // Correctly closes the event listener
  
  
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

  renderPuzzle(currentPuzzle);

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
          // Allow only numbers 1-9 and block everything else
          const inputValue = this.value.trim();
          if (/^[1-9]$/.test(inputValue)) {
            currentPuzzle[rowIndex][colIndex] = parseInt(inputValue, 10); // Update puzzle
            this.value = inputValue; // Ensure the input value remains visible
          } else {
            this.value = ""; // Clear invalid input
            currentPuzzle[rowIndex][colIndex] = 0; // Reset grid value
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

  console.log("Inputs array:", inputs);

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

function isValidSudoku(puzzle) {
        // Logic for validating rows, columns, and subgrids
        function isUnique(array) {
            const nums = array.filter(num => num !== 0);
            const uniqueNums = new Set(nums);
            return nums.length === uniqueNums.size;
        }

        // Validate rows, columns, and subgrids
        for (let i = 0; i < 9; i++) {
            if (!isUnique(puzzle[i])) return false;
            if (!isUnique(puzzle.map(row => row[i]))) return false;

            // Subgrid validation
            for (let j = 0; j < 9; j += 3) {
                const subgrid = [];
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        subgrid.push(puzzle[i + x][j + y]);
                    }
                }
                if (!isUnique(subgrid)) return false; 
            }
        }
        return true; 
    }

    // Initial setup and rendering
    startTimer();
    renderPuzzle(currentPuzzle);
});
