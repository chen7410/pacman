var GAMEBOARD = [];

var getXY = function (x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP / 2) / BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9) / 17.75);

  return {
    x: i,
    y: j
  }
}

var buildGameboard = function () {
  GAMEBOARD = [];
  for (var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for (var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false
      });
    }
  }

  for (var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split(";");
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if (eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      if (!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble) {
        GAMEBOARD[i][j] = null;
      }
    }
  }

  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      if ((i === 0 && (j === 13)) ||
        (i === 1 && (j === 13)) ||
        (i === 2 && (j === 13)) ||
        (i === 3 && (j === 13)) ||
        (i === 4 && (j === 13)) ||
        (i === 6 && (j === 13)) ||
        (i === 7 && (j === 13)) ||
        (i === 8 && (j >= 10 && j <= 18)) ||
        (i === 9 && (j === 10 || j === 16)) ||
        (i === 10 && (j === 10 || j === 16)) ||
        (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
        (i === 12 && (j === 10 || j === 16)) ||
        (i === 13 && (j === 10 || j === 16)) ||
        (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
        (i === 15 && (j === 10 || j === 16)) ||
        (i === 16 && (j === 10 || j === 16)) ||
        (i === 17 && (j >= 10 && j <= 18)) ||
        (i === 18 && (j === 13)) ||
        (i === 19 && (j === 13)) ||
        (i === 21 && (j === 13)) ||
        (i === 22 && (j === 13)) ||
        (i === 23 && (j === 13)) ||
        (i === 24 && (j === 13)) ||
        (i === 25 && (j === 13))) {
        GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false
        };
      }
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
  if (GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].inky = true;
  p = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
  if (GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pinky = true;
  p = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
  if (GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].blinky = true;
  p = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
  if (GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].clyde = true;

  p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if (GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pacman = true;

};

function drawRect(i, j) {
  var ctx = PACMAN_CANVAS_CONTEXT;
  var ygap = 17.75;
  var x = BUBBLES_X_START + i * BUBBLES_GAP - BUBBLES_GAP / 2;
  var y = BUBBLES_Y_START + j * ygap - 9;
  var w = BUBBLES_GAP;
  var h = ygap;

  if (GAMEBOARD[i][j]) {
    ctx.strokeStyle = "green";
    ctx.rect(x, y, w, h);
    ctx.stroke();
  }
}

function drawDebug() {
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      drawRect(i, j);
    }
  }
}

/**
 * check if the given point within two blocks has a ghost.
 * @param {*} point 
 */
function isGhost(x, y) {
  var result = false;

  if (GAMEBOARD[x][y] != null) {
    var cell = GAMEBOARD[x][y];
    result = (cell.blinky || cell.clyde || cell.inky || cell.pinky);
  }
  if (x < 26 && x > -1 && y < 29 && y > 0 && GAMEBOARD[x][y - 1] != null) {
    var Up = GAMEBOARD[x][y - 1];
    result = result || (Up.blinky || Up.clyde || Up.inky || Up.pinky);
  }
  if (x < 26 && x > -1 && y < 29 && y > 1 && GAMEBOARD[x][y - 2] != null) {
    var Up = GAMEBOARD[x][y - 2];
    result = result || (Up.blinky || Up.clyde || Up.inky || Up.pinky);
  }
  if (x < 26 && x > -1 && y < 29 && y > 2 && GAMEBOARD[x][y - 3] != null) {
    var Up = GAMEBOARD[x][y - 3];
    result = result || (Up.blinky || Up.clyde || Up.inky || Up.pinky);
  }

  if (x < 26 && x > -1 && y < 28 && y > -1 && GAMEBOARD[x][y + 1] != null) {
    var down = GAMEBOARD[x][y + 1];
    result = result || (down.blinky || down.clyde || down.inky || down.pinky);
  }
  if (x < 26 && x > -1 && y < 27 && y > -1 && GAMEBOARD[x][y + 2] != null) {
    var down = GAMEBOARD[x][y + 2];
    result = result || (down.blinky || down.clyde || down.inky || down.pinky);
  }
  if (x < 26 && x > -1 && y < 26 && y > -1 && GAMEBOARD[x][y + 3] != null) {
    var down = GAMEBOARD[x][y + 3];
    result = result || (down.blinky || down.clyde || down.inky || down.pinky);
  }

  if (x < 25 && x > -1 && y < 29 && y > -1 && GAMEBOARD[x + 1][y] != null) {
    var right = GAMEBOARD[x + 1][y];
    result = result || (right.blinky || right.clyde || right.inky || right.pinky);
  }
  if (x < 24 && x > -1 && y < 29 && y > -1 && GAMEBOARD[x + 2][y] != null) {
    var right = GAMEBOARD[x + 2][y];
    result = result || (right.blinky || right.clyde || right.inky || right.pinky);
  }
  if (x < 23 && x > -1 && y < 29 && y > -1 && GAMEBOARD[x + 3][y] != null) {
    var right = GAMEBOARD[x + 3][y];
    result = result || (right.blinky || right.clyde || right.inky || right.pinky);
  }

  if (x < 26 && x > 0 && y < 29 && y > -1 && GAMEBOARD[x - 1][y] != null) {
    var left = GAMEBOARD[x - 1][y];
    result = result || (left.blinky || left.clyde || left.inky || left.pinky);
  }
  if (x < 26 && x > 1 && y < 29 && y > -1 && GAMEBOARD[x - 2][y] != null) {
    var left = GAMEBOARD[x - 2][y];
    result = result || (left.blinky || left.clyde || left.inky || left.pinky);
  }
  if (x < 26 && x > 2 && y < 29 && y > -1 && GAMEBOARD[x - 3][y] != null) {
    var left = GAMEBOARD[x - 3][y];
    result = result || (left.blinky || left.clyde || left.inky || left.pinky);
  }
  return result;

}

function isBubble(x, y) {
  return (GAMEBOARD[x][y].bubble && !GAMEBOARD[x][y].eaten);

}

function isBigBubble(x, y) {
  return (GAMEBOARD[x][y].superBubble && !GAMEBOARD[x][y].eaten);

}

/**
 * check if the given point is visted.
 * @param {*} visitedPoints
 * @param {*} point 
 */
function isVisited(visitedPoints, point) {
  var result = false;
  for (var i = 0; i < visitedPoints.length; i++) {
    if (visitedPoints[i].x === point.x && visitedPoints[i].y === point.y) {
      result = true;
      break;
    }
  }
  return result;
}

/**check what is in the give x and y location of the GAMEBOARD */
function getLocationStatus(x, y) {
  if (x < 26 && x > -1 && y < 29 && y > -1 && GAMEBOARD[x][y] != null) {
    if (isGhost(x, y)) {
      return "blocked";
    } else if (isBubble(x, y)) {
      return "bubble";
    } else if (isBigBubble(x, y)) {
      return "superBubble";
    } else {
      return "valid";
    }
  }
  return "invalid";

}

function exploreInDirection(currentLocation, tryDirection, visitedPoints) {
  var x = currentLocation.x;
  var y = currentLocation.y;
  var newPath = currentLocation.path.slice();

  if (tryDirection === 1) { //right
    x += 1;
  } else if (tryDirection === 2) { //down
    y += 1
  } else if (tryDirection === 3) { //left
    x -= 1;
  } else if (tryDirection === 4) { //up
    y -= 1;
  }

  newPath.push(tryDirection);
  var status = getLocationStatus(x, y);

  var newLocation = {
    status: status,
    x: x,
    y: y,
    path: newPath
  }

  if (newLocation.status === "valid") {
    if (!isVisited(visitedPoints, newLocation)) {
      visitedPoints.push({ x: newLocation.x, y: newLocation.y });
    } else {
      newLocation.status = "visited";
    }
  }
  return newLocation;
}

function findNextBubble(start) {
  var x = start.x;
  var y = start.y;

  var location = {
    status: "start",
    x: x,
    y: y,
    path: []
  }

  var queue = [location];
  var visitedPoints = [];

  while (queue.length > 0) {
    var currentLocation = queue.shift();
    // var pacmanLocation = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    visitedPoints.push({ x: currentLocation.x, y: currentLocation.y });

    for (var i = 1; i < 5; i++) {
      var newLocation = exploreInDirection(currentLocation, i, visitedPoints); //go right
      if (newLocation.status === "bubble" || newLocation.status === "superBubble") {
        return newLocation.path;
      } else if (newLocation.status === "valid") {

        queue.push(newLocation);
      }
    }
  }
}


function selectMove() {
  buildGameboard();

  if (!PACMAN_DEAD && !GAMEOVER && !PAUSE && !LOCK) { // make sure the game is running

    var pacmanLocation = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    // console.dir(pacmanLocation);
    var dir = findNextBubble(pacmanLocation)[0];
    
    movePacman(dir);
    // console.log('after move pacman')
    // console.dir(getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y));
  }
}

// setInterval(drawDebug, 1000 / 3);
