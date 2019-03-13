const express = require("express"),
	router = express.Router(),
	fs = require("fs"),
	bodyParser = require("body-parser"),
	path = require("path");

const { createCanvas, loadImage } = require("canvas");
const Point = require("./../library/Point");
const LineSegment = require("./../library/LineSegment");

var urlencodedParser = bodyParser.urlencoded({
	extended: true
});

router.get("/", (req, res) => {
	res.send("api works");
});

router.get("/test-image", (req, res) => {
	res.sendFile(path.join(__dirname, "../../images/simplerbg.png"));
});

// // Draw line under text
// var text = ctx.measureText("Awesome!");
// ctx.strokeStyle = "rgba(0,0,0,0.5)";
// ctx.beginPath();
// ctx.lineTo(50, 102);
// ctx.lineTo(50 + text.width, 102);
// ctx.stroke();

// // Draw cat with lime helmet
// loadImage("./images/tester.jpg").then(image => {
// 	ctx.drawImage(image, 50, 0, 70, 70);

// 	console.log('<img src="' + canvas.toDataURL() + '" />');
// });

var thresh;
var ctx;

var pixelMap = [];
var img;

const CheckTolerance = pixelData => {
	if (pixelData[0] < thresh && pixelData[1] < thresh && pixelData[2] < thresh) return true;
	return false;
};

router.post("/canvas/xy", urlencodedParser, (req, res) => {
	//	console.log(req.body);
	var p = Point.createPoint(req.body.point.x, req.body.point.y);
	//	console.log(p.toString());

	var that = this;
	//Create the canvas
	const canvas = createCanvas(req.body.imgSize.x, req.body.imgSize.y);
	ctx = canvas.getContext("2d");

	loadImage("./images/simplerbg.png")
		.then(imag => {
			img = imag;
			//console.log("loaded");
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			var pixelData = ctx.getImageData(p.x, p.y, 1, 1).data;
			thresh = req.body.threshold;
			thresh = 220;

			console.log(pixelData);
			//within the threshold
			if (CheckTolerance(pixelData)) {
				//implement the algorithm here

				var lineStack = [];

				var line = DetectNewLineSegment(p);
				AddLineToPixelMap(line);
				lineStack.push(line);

				while (lineStack.length > 0) {
					console.log(lineStack.length);
					var curLine = lineStack.pop();

					var tempPoint = Point.createPoint(curLine.left.x, curLine.left.y);

					tempPoint = CheckYAxisOfLine(curLine, true);
					var firstTime = 0;
					//todo Stuck in a infinite loop here
					while (tempPoint.toString() != curLine.left.toString() && !pixelMap.some(p => p.x == tempPoint.x && p.y == tempPoint.y)) {
						if (firstTime < 5) {
							console.log(tempPoint);
							console.log(tempPoint.toString() != curLine.left.toString());
							console.log(!pixelMap.includes(tempPoint));
							firstTime++;
						}

						var newLine = DetectNewLineSegment(Point.createPoint(tempPoint.x, tempPoint.y));
						console.log(newLine);
						AddLineToPixelMap(LineSegment.createBothEnds(newLine.left, newLine.right));
						console.log(pixelMap);
						lineStack.push(LineSegment.createBothEnds(newLine.left, newLine.right));
						tempPoint = CheckYAxisOfLine(LineSegment.createBothEnds(curLine.left, curLine.right), true);
					}

					tempPoint = CheckYAxisOfLine(LineSegment.createBothEnds(curLine.left, curLine.right), false);

					while (tempPoint.toString() != curLine.left.toString() && !pixelMap.some(p => p.x == tempPoint.x && p.y == tempPoint.y)) {
						console.log("The second while loop");
						var newLine = DetectNewLineSegment(Point.createPoint(tempPoint.x, tempPoint.y));
						AddLineToPixelMap(LineSegment.createBothEnds(newLine.left, newLine.right));
						lineStack.push(LineSegment.createBothEnds(newLine.left, newLine.right));
						tempPoint = CheckYAxisOfLine(LineSegment.createBothEnds(curLine.left, curLine.right), false);
					}
				}
				//Draw the pixelmap to the image
				var imgData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

				pixelMap.forEach(element => {
					//console.log(element);
					//					blueComponent = imageData.data[((50 * (imageData.width * 4)) + (200 * 4)) + 2];
					imgData.data[element.y * (imgData.width * 4) + element.x * 4 + 0] = 0;
					imgData.data[element.y * (imgData.width * 4) + element.x * 4 + 1] = 255;
					imgData.data[element.y * (imgData.width * 4) + element.x * 4 + 2] = 0;
					imgData.data[element.y * (imgData.width * 4) + element.x * 4 + 3] = 255;
				});
				ctx.putImageData(imgData, imgData.naturalWidth, imgData.naturalHeight);
				// ctx.lineTo(p.x, p.y);
				// ctx.lineTo(p.x + 100, p.y);
				// ctx.stroke();
			}

			//have this stored before I send it back, use it in the next time its called
			var dat = canvas.toDataURL();
			//	console.log(dat);
			res.send(JSON.stringify(imgData));
		})
		.catch(err => {
			console.log(err);
		});

	// var img = Image();

	// img.src = "../../images/tester.jpg";
	// img.onload = function() {
	// 	console.log("loaded");

	// 	that.ctx.drawImage(this, 0, 0, that.canvas.width, that.canvas.height);

	// 	var pixelData = that.ctx.getImageData(p.x, p.y, 1, 1).data;
	// 	console.log(pixelData);

	// 	res.send(p.toString());
	// };
});

const ValidPoint = point => {
	if (point.x < 0 || point.y < 0) {
		return false;
	} else if (img.width < point.x || img.height < point.y) {
		return false;
	} else {
		return true;
	}
};

const DetectNewLineSegment = point => {
	var returnLine = LineSegment.createSinglePoint(point);
	var currentPoint = Point.createPoint(point.x, point.y);
	var moreLeft = true;

	//Finds left most point
	while (moreLeft && ValidPoint(point)) {
		currentPoint = Point.createPoint(currentPoint.x - 1, currentPoint.y);
		if (ValidPoint(currentPoint) && !pixelMap.includes(currentPoint)) {
			var pixelData = ctx.getImageData(currentPoint.x, currentPoint.y, 1, 1).data;

			if (CheckTolerance(pixelData)) {
				returnLine.left = Point.createPoint(currentPoint.x, currentPoint.y);
			} else moreLeft = false;
		} else moreLeft = false;
	}

	//Finds right most point
	currentPoint = Point.createPoint(point.x, point.y);
	var moreRight = true;
	while (moreRight && ValidPoint(point)) {
		currentPoint = Point.createPoint(currentPoint.x + 1, currentPoint.y);
		if (ValidPoint(currentPoint) && !pixelMap.includes(currentPoint)) {
			var pixelData = ctx.getImageData(currentPoint.x, currentPoint.y, 1, 1).data;

			if (CheckTolerance(pixelData)) {
				returnLine.right = currentPoint;
			} else moreRight = false;
		} else moreRight = false;
	}
	return returnLine;
};

var firstTimeOnly = 0;

const AddLineToPixelMap = line => {
	var currentPoint = Point.createPoint(line.left.x, line.left.y);

	// console.log(line);
	while (currentPoint.toString() != line.right.toString()) {
		// if (firstTimeOnly < 4) {
		// 	console.log("Start");
		// 	console.log(pixelMap);
		// }
		//the problem isnt here, its that im editing somehting inside the pixelmap so the logic is fucking up. I need to make sure im not using references
		pixelMap.push(currentPoint);
		// if (firstTimeOnly < 4) {
		// 	firstTimeOnly++;
		// 	console.log(pixelMap);
		// 	console.log("finish");
		// }

		currentPoint = Point.createPoint(currentPoint.x + 1, currentPoint.y);
	}
	//THIS MIGHT NOT WORK
	pixelMap.push(line.right);
};

//js version
const CheckYAxisOfLine = (line, above) => {
	//useful things to shorten the code
	var yOffSet = above ? 1 : -1;
	var x = line.left.x;
	var y = line.left.y;
	var rightX = line.right.x;

	//Check to make sure I stay within bounds of the image
	if (!ValidPoint(Point.createPoint(x, y + yOffSet))) return Point.createPoint(line.left.x, line.left.y);

	var curPoint = Point.createPoint(x, y + yOffSet);
	for (var i = 0; i + x < rightX; ++i) {
		curPoint.x = x + i;
		//Check to make sure the current point isn't already in the pixelmap
		if (!pixelMap.includes(curPoint)) {
			var pixelData = ctx.getImageData(curPoint.x, curPoint.y, 1, 1).data;

			if (CheckTolerance(pixelData)) {
				return Point.createPoint(curPoint.x, curPoint.y);
			}
		}
	}

	return Point.createPoint(line.left.x, line.left.y);
};

module.exports = router;
