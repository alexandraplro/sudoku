let selectedInput = null;
let inputs= [];
let timerInterval; // Declare here for accessibility in functions

document.addEventListener("DOMContentLoaded", function () {  
    const grid = document.getElementById("sudoku-grid");
    const timerElement = document.getElementById("timer");
    if (!grid || !timerElement) {
        console.error("Grid or timerElement is missing in the DOM.");
    return;
    }

    if (!timerElement) {
        console.error("Element with ID 'timer' not found. Ensure it exists in the DOM.");
        return;
    }

    let selectedDifficulty = "medium";
    let initialPuzzle = generateSudoku(selectedDifficulty);
    let currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));

    const cell = document.createElement("div"); // Properly define cell
    
        console.log("Generated puzzle array (Initial):", initialPuzzle);

        function renderPuzzle(grid, puzzle) {
            console.log("Rendering Sudoku grid...");

            // Validate the puzzle before proceeding
            if (!Array.isArray(puzzle)) {
                console.error("Invalid puzzle data. Expected an array:", puzzle);
                return;
            }

            grid.innerHTML = ""; // Clear the grid
            inputs.length = 0; // Reset inputs array for navigation

            // Iterate through rows and columns to create cells
            puzzle.forEach((row, rowIndex) => {
                if (!Array.isArray(row)) {
                    console.error(`Invalid row data at index ${rowIndex}. Expected an array:`, row);
                    return;
                }

                row.forEach((value, colIndex) => {
                    console.log(`Rendering cell at row ${rowIndex}, col ${colIndex} with value:`, value);

                    const cell = document.createElement("div");
                    cell.classList.add("cell");

                    let input;

                    if (value === 0) { // Empty cell
                        input = document.createElement("input");
                        input.type = "text";
                        input.maxLength = 1;
                        input.dataset.row = rowIndex;
                        input.dataset.col = colIndex;

                        inputs.push(input); // Add the input to the inputs array

                        cell.appendChild(input);

                        console.log("Input element:", input);

                        // Add the event listener here, where `input` is defined
                        input.addEventListener("click", function () {
                                if (selectedInput) selectedInput.classList.remove("selected");
                                selectedInput = this;
                                selectedInput.classList.add("selected");
                                console.log(`Input clicked at row ${rowIndex}, col ${colIndex}`);
                        });
                    } else {
                                    cell.textContent = value; // Fixed cell value
                        cell.classList.add("fixed");
                    }
                    
                    // Subgrid coloring and borders logic...
                    const subgridRow = Math.floor(rowIndex / 3);
                    const subgridCol = Math.floor(colIndex / 3);
                    const isSubgridEven = (subgridRow + subgridCol) % 2 === 0;
                    cell.style.backgroundColor = isSubgridEven ? "var(--subgrid-color-1)" : "var(--subgrid-color-2)";

                    // Add borders for subgrid visualization
                    if (rowIndex % 3 === 0) cell.classList.add("top-border");
                    if (colIndex % 3 === 0) cell.classList.add("left-border");
                    if (rowIndex % 3 === 2) cell.classList.add("bottom-border");
                    if (colIndex % 3 === 2) cell.classList.add("right-border");


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
                        showValidationMessage();
                    });
                });

                clearHighlights();
                highlightInvalidCells(getInvalidCells(currentPuzzle));
                showValidationMessage();
        
                grid.appendChild(cell); // Append the cell to the grid
        });

};

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

        function isUnique(array) {
            const nums = array.filter(num => num !== 0);
            const uniqueNums = new Set(nums);
            return nums.length === uniqueNums.size;
        }

        function isValidSudoku(puzzle) {
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

        function getInvalidCells(puzzle) {
            const invalidCells = [];

            // Check rows
            puzzle.forEach((row, rowIndex) => {
                if (!isUnique(row)) {
                    row.forEach((value, colIndex) => {
                        if (value !== 0 && !isUnique(row.filter((_, i) => i !== colIndex))) {
                            invalidCells.push([rowIndex, colIndex]);
                        }
                    });
                }
            });

            // Check columns
            // Check columns
            for (let col = 0; col < 9; col++) {
                const column = puzzle.map(row => row[col]); // Extract the column

                if (!isUnique(column)) { // Validate the column
                    column.forEach((value, rowIndex) => {
                        if (value !== 0 && !isUnique(column.filter((_, i) => i !== rowIndex))) {
                            invalidCells.push([rowIndex, col]);
                        }
                    }); // Correctly closed here
                }
            }


            // Check subgrids
            for (let subgridRow = 0; subgridRow < 3; subgridRow++) {
                for (let subgridCol = 0; subgridCol < 3; subgridCol++) {
                    const subgrid = [];
                    const invalidSubgridCells = [];
                    for (let row = subgridRow * 3; row < subgridRow * 3 + 3; row++) {
                        for (let col = subgridCol * 3; col < subgridCol * 3 + 3; col++) {
                            subgrid.push(puzzle[row][col]);
                            invalidSubgridCells.push([row, col]);
                        }
                    }
                    if (!isUnique(subgrid)) {
                        subgrid.forEach((value, index) => {
                            if (value !== 0 && !isUnique(subgrid.filter((_, i) => i !== index))) {
                                invalidCells.push(invalidSubgridCells[index]);
                            }
                        });
                    }
                }
            }

            return invalidCells;
        }

        function highlightInvalidCells(invalidCells) {
            invalidCells.forEach(([rowIndex, colIndex]) => {
                const input = inputs.find(
                    el => el.dataset.row == rowIndex && el.dataset.col == colIndex
                );
                if (input) input.classList.add("highlight-error");
            });
        }


        function clearHighlights() {
            document.querySelectorAll(".highlight-error").forEach(cell => {
                cell.classList.remove("highlight-error");
            });
        }

        function showValidationMessage() {
            const validationMessage = document.getElementById("validation-message");
            const invalidCells = getInvalidCells(currentPuzzle);
            if (invalidCells.length > 0) {
                validationMessage.textContent = "Some cells are invalid. Please check your inputs.";
                validationMessage.style.color = "red";
            } else {
                validationMessage.textContent = "";
            }
        }

        const modal = document.getElementById("contactModal");
        const closeButton = document.getElementById("closeModalButton");

        console.log("modal:", modal);
        console.log("closeButton:", closeButton);

        if (closeButton && modal) {
            closeButton.addEventListener("click", () => {
                modal.setAttribute("inert", "");
                modal.setAttribute("aria-hidden", "true");
            });
        } else {
            console.error("Close button or modal is missing in the DOM.");
        }

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
                if (timerElement) {
                    timerElement.textContent = formattedTime;
                } else {
                    console.error("timerElement is null. Ensure an element with ID 'timer' exists in the DOM.");
                }
            }, 1000); // Update every second
            console.log("Timer started");
        }

        function resetTimer() {
            clearInterval(timerInterval);
            timerElement.textContent = "00:00:00"; // Reset timer display
            console.log("Timer reset");
        }

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
        document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(level => {
            level.addEventListener("click", function () {
                selectedDifficulty = this.textContent.trim().toLowerCase(); // Update the difficulty
                console.log(`Selected difficulty: ${selectedDifficulty}`);

                // Ensure the selected difficulty is valid
                if (!["easy", "medium", "hard"].includes(selectedDifficulty)) {
                    console.error("Invalid difficulty selected!");
                    alert("Please select a valid difficulty.");
                    return;
                }

                console.log(`Selected difficulty: ${selectedDifficulty}`);

                // Regenerate puzzle for the selected difficulty
                initialPuzzle = generateSudoku(selectedDifficulty); // Generate puzzle
                currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle)); // Deep copy for game state
                renderPuzzle(grid, currentPuzzle); // Update the grid

                resetTimer(); // Reset the timer display
                startTimer(); // Restart the timer
            });
        }); // Correctly closes the dropdown-menu listener loop

        document.getElementById("new-game").addEventListener("click", function () {
            initialPuzzle = generateSudoku(selectedDifficulty);
            currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
            renderPuzzle(grid, currentPuzzle);
            resetTimer();
            startTimer();
        });

        document.getElementById("reset").addEventListener("click", function () {
            currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
            renderPuzzle(grid, currentPuzzle);
        });

        document.getElementById("check-solution").addEventListener("click", function () {
            showValidationMessage();
            if (isValidSudoku(currentPuzzle)) {
                alert("Congratulations! The solution is correct.");
            } else {
                alert("Keep trying!");
            }
        });

        // Add click event listeners to keypad buttons
        document.querySelectorAll(".keypad-btn").forEach(button => {
            button.addEventListener("click", () => {
                const value = button.dataset.value;
                if (!selectedInput) {
                    alert("Please select a cell first!");
                    return;
                }
                if (/^[1-9]$/.test(value)) {
                    selectedInput.value = value;
                } else {
                    selectedInput.value = ""; // Clear input for invalid or '0'
                }
            });
        }); // Correctly closes the forEach loop and its callback

        // "Contact Us" modal logic
        const sendMessageButton = document.getElementById("sendMessageButton");
        console.log("sendMessageButton:", sendMessageButton);
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
        // Correctly closes the event listener
        renderPuzzle(grid, currentPuzzle);
        startTimer();
    });
