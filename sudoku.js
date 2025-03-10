document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".sudoku-grid");
    const canvas = document.getElementById("sudokuCanvas");
    const context = canvas.getContext("2d");
    const difficultySelector = document.getElementById("difficulty");
    const checkButton = document.getElementById("checkButton");

    const levels = {
        easy: [
            5, 3, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 1, 9, 5, 0, 0, 0,
            0, 9, 8, 0, 0, 0, 0, 6, 0,
            8, 0, 0, 0, 6, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 6,
            0, 6, 0, 0, 0, 0, 2, 8, 0,
            0, 0, 0, 4, 1, 9, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 9,
        ],
        medium: [
            0, 3, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 1, 0, 5, 0, 0, 0,
            0, 0, 8, 0, 0, 0, 0, 6, 0,
            8, 0, 0, 0, 0, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 6,
            0, 6, 0, 0, 0, 0, 2, 0, 0,
            0, 0, 0, 4, 1, 0, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 0,
        ],
        hard: [
            0, 0, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 0, 0, 5, 0, 0, 0,
            0, 9, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 6, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 0,
            0, 6, 0, 0, 0, 0, 2, 0, 0,
            0, 0, 0, 4, 0, 0, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 0,
        ]
    };

    function drawGrid() {
        const containerSize = gridContainer.offsetWidth;
        const cellSize = containerSize / 9;
        canvas.width = containerSize;
        canvas.height = containerSize;

        for (let i = 0; i <= 9; i++) {
            context.lineWidth = (i % 3 === 0) ? 3 : 1;
            context.moveTo(0, i * cellSize);
            context.lineTo(containerSize, i * cellSize);
            context.moveTo(i * cellSize, 0);
            context.lineTo(i * cellSize, containerSize);
        }
        context.stroke();
    }

    function loadGrid(level) {
        gridContainer.innerHTML = "";
        const startingGrid = levels[level];

        startingGrid.forEach((value, i) => {
            const cell = document.createElement("input");
            cell.type = "text";
            cell.classList.add("cell");
            cell.maxLength = 1;

            if (value !== 0) {
                cell.value = value;
                cell.disabled = true;
            }

            gridContainer.appendChild(cell);
        });

        drawGrid();
    }

    // Event listener for difficulty selection
    difficultySelector.addEventListener("change", function () {
        loadGrid(difficultySelector.value);
    });

    // Load the default difficulty level (easy) on page load
    loadGrid("easy");

    // Check solution (placeholder logic for now)
    checkButton.addEventListener("click", function () {
        alert("Solution checking logic will go here!");
    });
});
