var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var grid = [];
var start = null;
var end = null;

function setup() {
  for (var i = 0; i < 50; i++) {
    var row = [];
    for (var j = 0; j < 50; j++) {
      row.push(new Cell(i, j));
    }
    grid.push(row);
  }

  start = grid[0][0];
  end = grid[49][49];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      grid[i][j].draw(ctx);
    }
  }

  if (start != null && end != null) {
    var path = aStar(start, end);
    for (var i = 0; i < path.length; i++) {
      path[i].highlight(ctx);
    }
  }
}

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.highlighted = false;

  this.draw = function(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x * 10, this.y * 10, 10, 10);
  };

  this.highlight = function(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x * 10, this.y * 10, 10, 10);
  };
}

function aStar(start, end) {
  var open = [];
  var closed = [];

  start.g = 0;
  start.h = distance(start, end);
  open.push(start);

  while (open.length > 0) {
    var current = open.shift();

    if (current == end) {
      return reconstructPath(current);
    }

    closed.push(current);

    for (var neighbor of current.neighbors) {
      if (neighbor.visited) {
        continue;
      }

      var tentative_g = current.g + distance(current, neighbor);
      if (tentative_g < neighbor.g) {
        neighbor.g = tentative_g;
        neighbor.parent = current;
      }

      if (!closed.includes(neighbor)) {
        open.push(neighbor);
      }
    }
  }

  return [];
}

function distance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function reconstructPath(current) {
  var path = [];
  while (current != null) {
    path.push(current);
    current = current.parent;
  }

  path.reverse();
  return path;
}

window.addEventListener("load", setup);