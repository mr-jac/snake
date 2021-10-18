var OPTIONS = {
	nSquares: {x: 30, y: 30},
	maxDimension: 600,
	wrapAround: true,
	speed: 0.1 //seconds
};

var menu = document.querySelector('#menu');
var gameCanvas = document.querySelector("#game");
var SQUARESIZE = OPTIONS.maxDimension/Math.max(OPTIONS.nSquares.x,OPTIONS.nSquares.y);
gameCanvas.setAttribute('width',OPTIONS.nSquares.x*SQUARESIZE);
gameCanvas.setAttribute('height',OPTIONS.nSquares.y*SQUARESIZE);
var ctx = gameCanvas.getContext('2d');

var bodySquares, direction, targetLocation;

var KEYS = {37: 'left', 38: 'down', 39: 'right', 40: 'up'};

function clearCanvas() {
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function makeSquare(x,y,fill=false,color="#000000") {
	if (!fill) {
		ctx.beginPath();
		ctx.rect(x*SQUARESIZE,y*SQUARESIZE,SQUARESIZE,SQUARESIZE);
		ctx.stroke();
		ctx.closePath();
	} else {
		ctx.fillStyle = color;
		ctx.fillRect(x*SQUARESIZE,y*SQUARESIZE,SQUARESIZE,SQUARESIZE);
	}
}

function spawnTarget() {
	var x=null,y=null;
	while (x == null || bodySquares.some(function(square) {
		return (x == square.x && y == square.y);
	})) { //This while loop makes sure a target is not generated somewhere in the snake's body
		x = Math.floor(Math.random() * (OPTIONS.nSquares.x));
		y = Math.floor(Math.random() * (OPTIONS.nSquares.y));
	}
	targetLocation.x = x;
	targetLocation.y = y;
	//TODO: IF EVERY SQUARE IS A BODY SQUARE, YOU WIN!
}

document.addEventListener("keydown", (event) => {
	if (Object.keys(KEYS).includes(event.keyCode.toString())) {
		direction = KEYS[event.keyCode];
	}
});

function startGame() {

	menu.style.display = 'none';
	bodySquares = [{x: Math.floor(OPTIONS.nSquares.x/2), y: Math.floor(OPTIONS.nSquares.y/2) }]; //front first
	direction = 'right';
	targetLocation = {x: 0, y: 0};
	spawnTarget();
	var game = setInterval(function(){
		var collected = (bodySquares[0].x == targetLocation.x && bodySquares[0].y == targetLocation.y);
		bodySquares.unshift(JSON.parse(JSON.stringify(bodySquares[0])));
		var lastSquare = JSON.parse(JSON.stringify(bodySquares.pop()));
		var collision = false;
		switch (direction) {
			case 'up':
				bodySquares[0].y++;
				if (bodySquares[0].y >= OPTIONS.nSquares.y) {
					bodySquares[0].y = 0;
					if (!OPTIONS.wrapAround) { collision = true; }
				};
				break;
			case 'down':
				bodySquares[0].y--;
				if (bodySquares[0].y < 0) {
					bodySquares[0].y = OPTIONS.nSquares.y-1;
					if (!OPTIONS.wrapAround) { collision = true; }
				};
				break;
			case 'left':
				bodySquares[0].x--;
				if (bodySquares[0].x < 0) {
					bodySquares[0].x = OPTIONS.nSquares.x-1;
					if (!OPTIONS.wrapAround) { collision = true; }
				};
				break;
			case 'right':
				bodySquares[0].x++;
				if (bodySquares[0].x >= OPTIONS.nSquares.x) {
					bodySquares[0].x = 0;
					if (!OPTIONS.wrapAround) { collision = true; }
				};
				break;
		}
		if (!collision) {
			collision = bodySquares.slice(1).some(function(square) {
				return (bodySquares[0].x == square.x && bodySquares[0].y == square.y);
			});
		}
		if (collision) {
			clearInterval(game);
			menu.style.display = '';
			return true;
		}
		if (collected) {
			spawnTarget();
			bodySquares.push(lastSquare);
		}
		clearCanvas();
		makeSquare(targetLocation.x,targetLocation.y,fill=true,color='#00ffff');
		bodySquares.forEach(function(square) {
			makeSquare(square.x,square.y);
		})
	},OPTIONS.speed*1000);

}
document.querySelector('#startgame').addEventListener('click', startGame);