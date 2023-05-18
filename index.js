
// Grid dimensions
const rows = 20;
const cols = 30;

// Create the grid
const grid = createGrid();

// Start and end points
let start = null;
let end = null;

// Add event listener to the grid for selecting start and end points
const gridElement = document.getElementById("grid");
gridElement.addEventListener("click", handleGridClick);


// Clear the grid
function clearGrid() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("start", "end", "path");
    });
  }

// Generate the shortest path from start to end
function generatePath() {
  if (!start || !end) {
    alert("Please select both start and end points.");
    return;
  }
  clearGrid();
  clearPath();
  const { path, distance } = aStar();
  visualizePath(path);

  
  showDialog(
    `Shortest distance: ${distance}\n\nPlease click "Restart Visualization" to restart.`,
    restartVisualization
  );

 
}

// Show dialog box
function showDialog(message) {
  const dialog = document.createElement("div");
  dialog.className = "dialog";

  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  dialog.appendChild(messageElement);

  document.body.appendChild(dialog);
}

// Visualize the shortest path
function visualizePath(path) {
  for (const cell of path) {
    cell.classList.add("path");
  }
}

// Handle grid cell click event
function handleGridClick(event) {
  const cell = event.target;

  if (!start) {
    start = cell;
    cell.classList.add("start");
  } else if (!end) {
    end = cell;
    cell.classList.add("end");
  }
}

// Clear the path
function clearPath() {
  const pathCells = document.querySelectorAll(".path");
  pathCells.forEach((cell) => cell.classList.remove("path"));
}

// Restart the visualization
function restartVisualization() {

  clearPath();
  start.classList.remove("start");
  end.classList.remove("end");
  start = null;
  end = null;
  // Remove the dialog box if it exists
  const dialog = document.querySelector(".dialog");
  if (dialog) {
    document.body.removeChild(dialog);
  }
}


// A* algorithm for pathfinding
function aStar() {
  const openSet = [start];
  const closedSet = [];

  const gScore = create2DArray(rows, cols, Infinity);
  gScore[start.dataset.row][start.dataset.col] = 0;

  const fScore = create2DArray(rows, cols, Infinity);
  fScore[start.dataset.row][start.dataset.col] = heuristic(start, end);

  while (openSet.length > 0) {
    const current = getLowestFScore(openSet, fScore);
    if (current === end) {
      return {
        path: reconstructPath(current),
        distance: gScore[end.dataset.row][end.dataset.col],
      };
    }

    removeElementFromArray(openSet, current);
    closedSet.push(current);

    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor)) {
        continue;
      }

      const tentativeGScore =
        gScore[current.dataset.row][current.dataset.col] + 1;
      if (
        !openSet.includes(neighbor) ||
        tentativeGScore <
          gScore[neighbor.dataset.row][neighbor.dataset.col]
      ) {
        neighbor.gScore = tentativeGScore;
        gScore[neighbor.dataset.row][neighbor.dataset.col] =
          tentativeGScore;
        fScore[neighbor.dataset.row][neighbor.dataset.col] =
          tentativeGScore + heuristic(neighbor, end);
        neighbor.parent = current;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { path: null, distance: null }; // No path found
}


// Create the grid and append it to the HTML
function createGrid() {
  const gridElement = document.getElementById("grid");
  const grid = [];

  for (let row = 0; row < rows; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";

    const rowArray = [];

    for (let col = 0; col < cols; col++) {
      const cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.dataset.row = row;
      cellElement.dataset.col = col;
      rowElement.appendChild(cellElement);

      rowArray.push(cellElement);
    }

    gridElement.appendChild(rowElement);
    grid.push(rowArray);
  }

  return grid;
}

// Get the neighbors of a cell
function getNeighbors(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const neighbors = [];

  if (row > 0) {
    neighbors.push(grid[row - 1][col]); // Top
  }

  if (row < rows - 1) {
    neighbors.push(grid[row + 1][col]); // Bottom
  }

  if (col > 0) {
    neighbors.push(grid[row][col - 1]); // Left
  }

  if (col < cols - 1) {
    neighbors.push(grid[row][col + 1]); // Right
  }

  return neighbors;
}

// Reconstruct the path from end to start
function reconstructPath(cell) {
  const path = [];

  while (cell.parent) {
    path.unshift(cell);
    cell = cell.parent;
  }

  return path;
}

// Get the cell coordinates (row and column)
function getCellCoordinates(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  return { row, col };
}

// Heuristic function (Manhattan distance)
function heuristic(cellA, cellB) {
  const { row: rowA, col: colA } = getCellCoordinates(cellA);
  const { row: rowB, col: colB } = getCellCoordinates(cellB);

  return Math.abs(rowA - rowB) + Math.abs(colA - colB);
}

// Remove an element from an array
function removeElementFromArray(array, element) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

// Get the cell with the lowest fScore
function getLowestFScore(cells, fScore) {
  let lowest = cells[0];
  let lowestFScore = fScore[lowest.dataset.row][lowest.dataset.col];

  for (const cell of cells) {
    const cellFScore = fScore[cell.dataset.row][cell.dataset.col];
    if (cellFScore < lowestFScore) {
      lowest = cell;
      lowestFScore = cellFScore;
    }
  }

  return lowest;
}

// Helper function to create a 2D array with initial values
function create2DArray(rows, cols, initialValue) {
  const array = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(initialValue);
    }
    array.push(rowArray);
  }
  return array;
}