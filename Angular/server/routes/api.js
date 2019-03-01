const express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	path = require("path");

const Point = require("./../library/Point");

var urlencodedParser = bodyParser.urlencoded({
	extended: true
});

router.get("/", (req, res) => {
	res.send("api works");
});

router.get("/test-image", (req, res) => {
	res.sendFile(path.join(__dirname, "../../images/simplerbg.png"));
});

router.post("/canvas/xy", urlencodedParser, (req, res) => {
	var p = Point.createPoint(req.body.x, req.body.y);
	console.log(p.toString());
	res.send("Done");
});

module.exports = router;
