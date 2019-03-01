const express = require("express"),
	router = express.Router(),
	path = require("path");

router.get("/", (req, res) => {
	res.send("api works");
});

router.get("/test-image", (req, res) => {
	res.sendFile(path.join(__dirname, "../../images/simplerbg.png"));
});

module.exports = router;
