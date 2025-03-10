document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".sudoku-grid");
    const canvas = document.getElementById("sudokuCanvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions dynamically
    const containerSize = gridContainer.offsetWidth;
    const cellSize = containerSize / 9;
    canvas.width = containerSize;
    canvas.height = containerSize;

    // Draw the Sudoku grid with thicker lines for 3x3 sub-grids
    for (let i = 0; i <= 9; i++) {
        context.lineWidth = (i % 3 === 0) ? 3 : 1;

        // Draw horizontal lines
        context.moveTo(0, i * cellSize);
        context.lineTo(containerSize, i * cellSize);

        // Draw vertical lines
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, containerSize);
    }
    context.stroke();

    // Example starting grid with some pre-filled numbers
    const startingGrid = [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9,
    ];

    // Dynamically generate a 9x9 input grid
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("input");
        cell.type = "text";
        cell.classList.add("cell");
        cell.maxLength = 1;

        // Pre-fill starting numbers
        if (startingGrid[i] !== 0) {
            cell.value = startingGrid[i];
            cell.disabled = true; // Disable editing for pre-filled cells
        }

        gridContainer.appendChild(cell);
    }

    // Add input validation using event delegation
    gridContainer.addEventListener("input", function (event) {
        const cell = event.target;
        if (cell.classList.contains("cell")) {
            const value = cell.value;
            if (!/^[1-9]$/.test(value)) {
                cell.value = ""; // Clear invalid input
                cell.style.borderColor = "red"; // Highlight invalid input
                setTimeout(() => (cell.style.borderColor = ""), 500); // Reset border
            }
        }
    });

    // Example solution array
    const solution = [
        5, 3, 4, 6, 7, 8, 9, 1, 2,
        6, 7, 2, 1, 9, 5, 3, 4, 8,
        1, 9, 8, 3, 4, 2, 5, 6, 7,
        8, 5, 9, 7, 6, 1, 4, 2, 3,
        4, 2, 6, 8, 5, 3, 7, 9, 1,
        7, 1, 3, 9, 2, 4, 8, 5, 6,
        9, 6, 1, 5, 3, 7, 2, 8, 4,
        2, 8, 7, 4, 1, 9, 6, 3, 5,
        3, 4, 5, 2, 8, 6, 1, 7, 9,
    ];

    // Add functionality for the "Check Solution" button
    const checkButton = document.getElementById("checkButton");
    checkButton.addEventListener("click", function () {
        const inputs = document.querySelectorAll(".cell");
        let valid = true;

        inputs.forEach((cell, index) => {
            if (cell.value != solution[index]) {
                valid = false;
                cell.style.backgroundColor = "#ffdddd"; // Highlight incorrect cell
                setTimeout(() => (cell.style.backgroundColor = ""), 500); // Reset color
            }
        });

        if (valid) {
            alert("Congratulations, the solution is correct!");
        } else {
            alert("There are errors in the solution. Try again!");
        }
    });
});
