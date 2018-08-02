range = [ -8, 8 ];

function onLoad() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	context = canvas.getContext("2d");

	minY = 99999999;
	maxY = -99999999;
	for (var x = range[0]; x <= range[1]; x += (range[1] - range[0]) / canvas.width) {
		var y = f(x);
		minY = Math.min(y, minY);
		maxY = Math.max(y, maxY);
	}
	paint();
}

function paint() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = "1";
	context.strokeStyle = "#ff0000";
	context.beginPath();
	for (var x = range[0]; x <= range[1]; x += (range[1] - range[0]) / canvas.width) {
		var canvasPoint = toCanvasPoint({
			x : x,
			y : f(x)
		});
		if (x == range[0]) {
			context.moveTo(canvasPoint.x, canvasPoint.y);
		} else {
			context.lineTo(canvasPoint.x, canvasPoint.y);
		}
	}
	context.stroke();
	context.closePath();
}

function onClick(e) {
	var x = e.pageX - canvas.offsetLeft;
	x = toFunctionX(x);
	var point = {
		x : x,
		y : f(x)
	};
	paint();

	context.fillStyle = "#000";
	context.strokeStyle = "#000";
	context.beginPath();
	var canvasPoint = toCanvasPoint(point);
	context.arc(canvasPoint.x, canvasPoint.y, 4, 0, 2 * Math.PI);
	context.closePath();
	context.fill();

	context.beginPath();
	var m = fPrime(point.x);
	var b = point.y - m * point.x;
	var tangentPoint = {
		x : range[0],
		y : m * range[0] + b
	};
	var canvasPoint = toCanvasPoint(tangentPoint);
	context.moveTo(canvasPoint.x, canvasPoint.y);
	var tangentPoint = {
		x : range[1],
		y : m * range[1] + b
	};
	var canvasPoint = toCanvasPoint(tangentPoint);
	context.lineTo(canvasPoint.x, canvasPoint.y);
	context.stroke();
	context.closePath();
}

function f(x) {
	return -x * x;
}

function fPrime(x) {
	return -2 * x;
}

function toCanvasPoint(p) {
	return {
		x : canvas.width * (p.x - range[0]) / (range[1] - range[0]),
		y : canvas.height * (p.y - minY) / (maxY - minY) - 40
	};
}

function toFunctionX(x) {
	return range[0] + x * (range[1] - range[0]) / canvas.width;
}
