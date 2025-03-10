document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".sudoku-grid");

    // Dynamically generate a 9x9 grid
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("input");
        cell.type = "text";
        cell.classList.add("cell");
        cell.maxLength = 1;

        // Restrict input to numbers 1-9
        cell.addEventListener("input", function (event) {
            const value = event.target.value;
            if (!/^[1-9]$/.test(value)) {
                event.target.value = ""; // Clear invalid input
                cell.style.borderColor = "red"; // Visual indicator
                setTimeout(() => cell.style.borderColor = "", 500); // Reset after 0.5s
            }
        });

        gridContainer.appendChild(cell);
    }

    // Create a "Check Solution" button
    const checkButton = document.createElement("button");
    checkButton.textContent = "Check Solution";
    checkButton.addEventListener("click", function () {
        // Placeholder: Add solution-checking logic here
        alert("Solution checking logic is not implemented yet!");
    });

    document.body.appendChild(checkButton);
});
