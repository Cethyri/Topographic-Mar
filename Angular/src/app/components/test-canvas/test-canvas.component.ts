import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-test-canvas",
	templateUrl: "./test-canvas.component.html",
	styleUrls: ["./test-canvas.component.scss"]
})
export class TestCanvasComponent implements OnInit {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	img: HTMLImageElement;

	constructor(http: HttpClient) {}

	ngOnInit() {
		this.canvas = <HTMLCanvasElement>document.getElementById("zach-test");
		this.ctx = this.canvas.getContext("2d");
		this.img = <HTMLImageElement>document.getElementById("image");
		var that = this;
		this.img.onload = function() {
			console.log("loaded");
			that.canvas.width = that.img.width;
			that.canvas.height = that.img.height;

			that.ctx.drawImage(that.img, 0, 0, that.canvas.width, that.canvas.height);
		};
		this.img.src = "http://localhost:8080/api/test-image";
		//	this.canvas.getContext("2d").drawImage(this.img, 0, 0, this.img.width, this.img.height);
		this.addListener();
	}

	addListener() {
		var that = this;
		this.canvas.addEventListener("mousemove", function(event) {
			var pixelData = that.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
			console.log(`X: ${event.offsetX}, Y: ${event.offsetY}`);
			console.log("R: " + pixelData[0] + "  G: " + pixelData[1] + " B: " + pixelData[2] + " A: " + pixelData[3]);
		});
	}
}
