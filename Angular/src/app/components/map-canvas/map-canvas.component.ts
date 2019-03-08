import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';

@Component({
	selector: "app-map-canvas",
	templateUrl: "./map-canvas.component.html",
	styleUrls: ["./map-canvas.component.scss"]
})
export class MapCanvasComponent implements OnInit {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	img: HTMLImageElement;
	imageTestData: Subject<ImageData>

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.canvas = <HTMLCanvasElement>document.getElementById("zach-test");
		this.ctx = this.canvas.getContext("2d");
		this.img = <HTMLImageElement>document.getElementById("image");
		var that = this;
		this.img.src = "http://localhost:8080/api/test-image";
		this.imageTestData = new Subject();
		this.img.onload = function() {
			console.log("loaded");
			that.canvas.width = that.img.width;
			that.canvas.height = that.img.height;
			
			that.ctx.drawImage(that.img, 0, 0, that.canvas.width, that.canvas.height);
			//that.imageTestData.next(that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height));
		};
		//	this.canvas.getContext("2d").drawImage(this.img, 0, 0, this.img.width, this.img.height);
		this.addListener();
	}

	addListener() {
		var that = this;
		this.canvas.addEventListener("click", function(event) {
			var imageDataAll = that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height);
			that.imageTestData.next(imageDataAll);
			//var pixelData = that.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
			var pixelData = that.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
			//var pixelData = that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height).data;
			console.log(`X: ${event.offsetX}, Y: ${event.offsetY}`);
			//console.log("R: " + pixelData[0] + "  G: " + pixelData[1] + " B: " + pixelData[2] + " A: " + pixelData[3]);
			var point = { x: event.offsetX, y: event.offsetY };
			var imgSize = { x: that.img.naturalWidth, y: that.img.naturalHeight };
			var obj = { point: point, imgSize: imgSize };

			var observable = that.http.post("/api/canvas/xy", obj, { responseType: "text" });
			observable.subscribe(data => {
				// console.log(data);
				that.img.src = data;
			});
		});
	}
}
