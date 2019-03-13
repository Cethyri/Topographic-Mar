import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { ImageViewerComponent } from "../image-viewer/image-viewer.component";
import { Vector } from 'src/app/classes/vector';

@Component({
  selector: "app-map-canvas",
  templateUrl: "./map-canvas.component.html",
  styleUrls: ["./map-canvas.component.scss"]
})
export class MapCanvasComponent implements OnInit {
  img: HTMLImageElement;
  imageTestData: Subject<string>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.img = <HTMLImageElement>document.getElementById("image");
    var that = this;
    this.img.src = "../../api/test-image";
	this.imageTestData = new Subject();
	
    this.img.onload = function() {
      console.log("loaded");
      that.imageTestData.next(that.img.src);
    };
  }

  onClick(event: Vector) {
    console.log(`X: ${event.x}, Y: ${event.y}`);

    var point = { x: event.x, y: event.y };
    var imgSize = { x: this.img.naturalWidth, y: this.img.naturalHeight };
    var obj = { point: point, imgSize: imgSize, threshold: 150 };

    var observable = this.http.post("/api/canvas/xy", obj, {
      responseType: "text"
    });
    observable.subscribe(data => {
      this.img.src = data;
    });
  }
}
