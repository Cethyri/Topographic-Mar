const express = require("express"),
	router = express.Router(),
	fs = require("fs"),
	bodyParser = require("body-parser"),
	path = require("path");

const { createCanvas, loadImage } = require("canvas");
const Point = require("./../library/Point");

var urlencodedParser = bodyParser.urlencoded({
	extended: true
});

router.get("/", (req, res) => {
	res.send("api works");
});

router.get("/test-image", (req, res) => {
	res.sendFile(path.join(__dirname, "../../images/tester.jpg"));
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

router.post("/canvas/xy", urlencodedParser, (req, res) => {
	//	console.log(req.body);
	var p = Point.createPoint(req.body.point.x, req.body.point.y);
	//	console.log(p.toString());

	var that = this;
	//Create the canvas
	const canvas = createCanvas(req.body.imgSize.x, req.body.imgSize.y);
	const ctx = canvas.getContext("2d");

	loadImage("./images/tester.jpg")
		.then(img => {
			//console.log("loaded");
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			var pixelData = ctx.getImageData(p.x, p.y, 1, 1).data;

			console.log(pixelData);
			if (pixelData[0] < 100 && pixelData[1] < 100 && pixelData[2] < 100) {
				ctx.lineTo(req.body.point.x, req.body.point.y);
				ctx.lineTo(req.body.point.x + 100, req.body.point.y);
				ctx.stroke();
			}

			//have this stored before I send it back, use it in the next time its called
			res.send(canvas.toDataURL());
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

module.exports = router;
