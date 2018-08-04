range = [ -8, 8 ];
paddingBottom = 100;

function onLoad() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	context = canvas.getContext("2d");

	minY = Number.MAX_VALUE;
	maxY = -Number.MAX_VALUE;
	for (var x = range[0]; x <= range[1]; x += (range[1] - range[0]) / canvas.width) {
		var y = f(x);
		minY = Math.min(y, minY);
		maxY = Math.max(y, maxY);
	}

	var rangeSize = range[1] - range[0];
	var domainSize = maxY - minY;
	if (rangeSize > domainSize) {
		scale = rangeSize / canvas.width;
	} else {
		scale = domainSize / canvas.height;
	}
	//	console.log("scale", scale);

	var angle = 0;
	setInterval(function() {
		paint();
		for (var x = range[0]; x <= range[1]; x += 2 * (range[1] - range[0]) / canvas.width) {
			drawReflection(x, angle * Math.PI, false, true, false);
			drawReflection(x, -angle * Math.PI, false, true, false);
		}
		angle += 0.004;
		angle %= 2 * Math.PI;
	}, 20);
}

function paint() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = "1";
	context.strokeStyle = "#ff0000";
	context.beginPath();
	for (var x = range[0]; x <= range[1]; x += (range[1] - range[0]) / canvas.width) {
		var point = {
			x : x,
			y : f(x)
		};
		var canvasPoint = toCanvasPoint(point);
		//		console.log("point", point);
		//		console.log("canvasPoint ", canvasPoint);
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
}

function mouseMove(e) {
	var x = e.pageX - canvas.offsetLeft;
	//	console.log("x", x);
	paint();
	x = toFunctionX(x);
	drawReflection(x, Math.PI / 2, true, true, true);
}

function drawReflection(x, angle, isDrawPoint, isDrawIncidentRay, isDrawTangent) {
	//	console.log("function x", x);
	var point = {
		x : x,
		y : f(x)
	};
	//	console.log("point ", point);

	context.fillStyle = "#000";
	context.strokeStyle = "rgba(255, 128, 0, 0.3)";
	context.lineWidth = 2;

	if (isDrawPoint) {
		context.beginPath();
		var canvasPoint = toCanvasPoint(point);
		context.arc(canvasPoint.x, canvasPoint.y, 4, 0, 2 * Math.PI);
		context.fill();
		context.closePath();
	}

	var dx = 0.00001;
	var m = (f(point.x + dx) - f(point.x)) / dx;
	var b = point.y - m * point.x;
	if (isDrawTangent) {
		// draw tangent
		context.beginPath();
		//	var m = fPrime(point.x);
		//	console.log("slope", m);
		var tangentPoint = {
			x : range[0],
			y : m * range[0] + b
		};
		var canvasPoint = toCanvasPoint(tangentPoint);
		context.moveTo(canvasPoint.x, canvasPoint.y);
		var tangentPoint = {
			//		x : 0,
			//		y : point.y - m * point.x
			x : range[1],
			y : m * range[1] + b
		};
		var canvasPoint = toCanvasPoint(tangentPoint);
		context.lineTo(canvasPoint.x, canvasPoint.y);
		context.stroke();
		context.closePath();
	}

	var mi = angle == Math.PI / 2 ? 1e4 : Math.tan(angle);
	if (isDrawIncidentRay) {
		// draw incident ray
		context.beginPath();
		var canvasPoint = toCanvasPoint(point);
		context.moveTo(canvasPoint.x, canvasPoint.y);
		var b = point.y - mi * point.x;
		var incidentPoint = {
			x : range[0],
			y : mi * range[0] + b
		};
		//		console.log("incidentPoint ", incidentPoint);
		var canvasPoint = toCanvasPoint(incidentPoint);
		context.lineTo(canvasPoint.x, canvasPoint.y);
		context.stroke();
		context.closePath();
	}

	// draw reflection
	context.beginPath();
	//	m = -1 / m;  // perpendicular
	//	console.log("incident angle", Math.atan(mi) / Math.PI);
	//	console.log("reflection angle", Math.atan(-mi) / Math.PI);
	//	console.log("tangent angle", Math.atan(m) / Math.PI);
	var theta = -Math.PI - Math.atan(mi) + 2 * Math.atan(m);
	var mr = Math.tan(theta);
	//	console.log("reflection slope", mr);
	var b = point.y - mr * point.x;
	var canvasPoint = toCanvasPoint(point);
	context.moveTo(canvasPoint.x, canvasPoint.y);
	var reflectionX = m > 0 ? range[1] : range[0];
	var reflectionPoint = {
		//		x : 0,
		//		y : point.y - m * point.x
		x : reflectionX,
		y : mr * reflectionX + b
	};
	var canvasPoint = toCanvasPoint(reflectionPoint);
	context.lineTo(canvasPoint.x, canvasPoint.y);
	context.stroke();
	context.closePath();
}

function f(x) {
	return -Math.pow(x * 0.5, 2);
}

//function fPrime(x) {
//	return -2 * x;
//}

function toCanvasPoint(p) {
	return {
		x : (p.x - range[0]) / scale,
		y : (p.y - minY) / scale - paddingBottom
	};
}

function toFunctionX(x) {
	return range[0] + x * scale;
}
