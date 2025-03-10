document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");

  // Create 9x9 grid with input fields
  for (let i = 0; i < 81; i++) {
    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", "1");
    input.setAttribute("max", "9");
    input.style.color = "lightyellow"; // Ensure numbers stay light yellow
    grid.appendChild(input);
  }

  // Add functionality to the "Check Solution" button
  const checkButton = document.getElementById("check-solution");
  checkButton.addEventListener("click", function () {
    alert("Checking solution... (Functionality to be implemented!)");
    // You can add validation logic here
  });
});
