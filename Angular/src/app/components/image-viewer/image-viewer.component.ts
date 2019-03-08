import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable, interval } from "rxjs";
import { Vector } from "../../classes/vector";
import { Interpolation } from "../../classes/interpolation";

@Component({
  selector: "app-image-viewer",
  templateUrl: "./image-viewer.component.html",
  styleUrls: ["./image-viewer.component.scss"]
})
export class ImageViewerComponent implements OnInit {
  @Input() imageSource$: Observable<ImageData>;
  @Input() width: number;
  @Input() height: number;

  @Output() onClick = new EventEmitter();

  hasData = false;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewer: HTMLDivElement;
  loading: HTMLDivElement;

  imageData: ImageData;

  viewerCenter: Vector;

  canvasHalfSize: Vector;
  shift: Vector;
  position = new Vector();
  velocity = new Vector();
  mousePosition = new Vector();
  lastMousePosition = new Vector();

  scale = 1;
  zoomDeltaDamper = 150;
  zoomCoefficient = 0.9;

  correctionTime = 0.5;
  correction: {
    t: Vector;
    start: Vector;
    vector: Vector;
  };

  velocityDieDownTime = 0.5;
  velocityDieDown: {
    t: number;
    start: Vector;
  };

  threshold = 0.05;

  lastTime = Date.now();
  clicked = false;
  timer = interval(30);

  mouseStartPosition: Vector;

  constructor() { }

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.viewer = <HTMLDivElement>document.getElementById("viewer");
    this.loading = <HTMLDivElement>document.getElementById("loading");

    this.viewerCenter = new Vector(this.width, this.height).div(2);
    this.viewer.style.width = `${this.width}px`;
    this.viewer.style.height = `${this.height}px`;

    this.loading.style.width = `${this.width}px`;
    this.loading.style.height = `${this.height}px`;
    this.loading.style.padding = `${(this.height - 100) / 2}px ${(this.width - 100) / 2}px`;

    this.velocityDieDown = {
      t: 0,
      start: new Vector()
    }

    this.timer.subscribe(() => {
      this.timerMethod();
    });

    this.imageSource$.subscribe(data => this.updateImageSource(data));
  }

  timerMethod() {
    if (!this.hasData) {
      return;
    }

    var now = Date.now();
    var dt = (Date.now() - this.lastTime) / 1000;
    this.lastTime = now;

    if (!this.clicked) {
      this.slide(dt);
    } else {
      this.velocity = this.mousePosition.sub(this.lastMousePosition).div(dt);
      this.correction = null;
      this.lastMousePosition = this.mousePosition;
    }
  }

  getCorrectionVelocity(threshold: number): Vector {
    var correction = new Vector();

    var canvasCenter = this.getCanvasCenter();

    if (this.canvas.width < this.viewer.clientWidth) {
      correction.x = this.viewerCenter.x - canvasCenter.x;
    } else if (this.position.x > threshold) {
      correction.x = threshold - this.position.x;
    } else if (
      this.position.x + this.canvas.width <
      this.viewerCenter.x * 2 - threshold
    ) {
      correction.x =
        this.viewerCenter.x * 2 -
        threshold -
        (this.position.x + this.canvas.width);
    }

    if (this.canvas.height < this.viewer.clientHeight) {
      correction.y = this.viewerCenter.y - canvasCenter.y;
    } else if (this.position.y > threshold) {
      correction.y = threshold - this.position.y;
    } else if (
      this.position.y + this.canvas.height <
      this.viewerCenter.y * 2 - threshold
    ) {
      correction.y =
        this.viewerCenter.y * 2 -
        threshold -
        (this.position.y + this.canvas.height);
    }

    return correction.mult(1);
  }

  getCanvasCenter(): Vector {
    return this.position.add(this.canvasHalfSize.mult(this.scale));
  }

  slide(dt: number) {
    var correctionVector = this.getCorrectionVelocity(50);
    if ((Math.abs(correctionVector.x) > this.threshold || Math.abs(correctionVector.y) > this.threshold) && !this.correction) {
      this.correction = {
        t: new Vector(),
        start: new Vector(this.position.x, this.position.y),
        vector: new Vector(
          this.velocity.x ? 0 : correctionVector.x,
          this.velocity.y ? 0 : correctionVector.y
        )
      };
    } else if (this.correction) {
      if (this.correction.t.x == 0 && this.velocity.x == 0) {
        this.correction.t.x = 0;
        this.correction.vector.x = correctionVector.x;
        this.correction.start.x = this.position.x;
      }
      if (this.correction.t.y == 0 && this.velocity.y == 0) {
        this.correction.t.y = 0;
        this.correction.vector.y = correctionVector.y;
        this.correction.start.y = this.position.y;
      }
    }

    if (this.correction) {
      var correctX = this.correction.vector.x;
      var correctY = this.correction.vector.y;

      var correctionPosition = new Vector(this.position.x, this.position.y);

      if (correctX) {
        this.correction.t.x += dt / this.correctionTime;
        if (this.correction.t.x > 1) {
          this.correction.t.x = 1;
        }
        correctionPosition.x =
          this.correction.start.x +
          this.correction.vector.x *
          Interpolation.cubicInOut(this.correction.t.x);
      }

      if (correctY) {
        this.correction.t.y += dt / this.correctionTime;
        if (this.correction.t.y > 1) {
          this.correction.t.y = 1;
        }
        correctionPosition.y =
          this.correction.start.y +
          this.correction.vector.y *
          Interpolation.cubicInOut(this.correction.t.y);
      }

      // console.log(`Position: ${this.position.x}, ${this.position.y}`);
      // console.log(
      //   `NewPosition: ${correctionPosition.x}, ${correctionPosition.y}`
      // );
      // console.log(
      //   `Correction: time:${this.correction.time}, t:${this.correction.t.x}, ${
      //     this.correction.t.y
      //   }, start:${this.correction.start.x}, ${
      //     this.correction.start.y
      //   }, vector:${this.correction.vector.x}, ${this.correction.vector.y}`
      // );

      this.setPosition(correctionPosition);

      if (
        (this.correction.t.x >= 1 || this.correction.t.x == 0) &&
        (this.correction.t.y >= 1 || this.correction.t.y == 0)
      ) {
        this.correction = null;
      }
    }

    if (this.velocityDieDown.t > 0) {
      this.setPosition(this.position.add(this.velocity.mult(dt)));

      // this.velocity = this.velocity.mult(Math.pow(this.frictionMultiplier, dt));
      this.velocityDieDown.t -= dt / this.velocityDieDownTime;
      this.velocity = this.velocityDieDown.start.mult(
        Interpolation.quadraticIn(this.velocityDieDown.t)
      );
    } else {
      this.velocity = new Vector();
      if (correctionVector.x === 0 && correctionVector.y === 0) {
        this.canvas.removeAttribute("moving");
      }
    }
  }

  updateImageSource(data: ImageData) {
    if (!data) {
      this.hasData = false;
      return;
    } else {
      this.hasData = true;
    }

    this.imageData = data;

    this.canvas.width = data.width;
    this.canvas.height = data.height;

    this.canvasHalfSize = new Vector(
      this.canvas.width,
      this.canvas.height
    ).mult(0.5);

    this.scale = 1;

    this.setPosition(this.viewerCenter.sub(this.canvasHalfSize));

    this.ctx.clearRect(0, 0, data.width, data.height);
    this.ctx.putImageData(data, 0, 0);
  }

  handleMouseEvent(event: MouseEvent) {

    this.mousePosition = new Vector(event.offsetX, event.offsetY);

    switch (event.type) {
      case "mousedown":
      case "mouseenter":
        if (event.buttons) {
          this.clicked = true;
          this.canvas.setAttribute("moving", "");
          this.lastMousePosition = this.mousePosition;
          this.mouseStartPosition = this.mousePosition;
          this.shift = this.mousePosition.sub(this.position);
        }
        break;
      case "mouseup":
        if (this.mouseStartPosition.x == this.mousePosition.x && this.mouseStartPosition.y == this.mousePosition.y) {
          var clickPosition = this.mousePosition.sub(this.position).div(this.scale);
          var clickPosition = new Vector(Math.round(clickPosition.x), Math.round(clickPosition.y))
          this.onClick.emit(clickPosition);
        }
      case "mouseout":
        this.shift = null;
        this.clicked = false;
        this.velocityDieDown = {
          t: 1,
          start: new Vector(this.velocity.x, this.velocity.y)
        };
        break;
      case "scroll":
    }
  }

  onMove(event: MouseEvent) {
    if (this.shift) {
      this.mousePosition = new Vector(event.offsetX, event.offsetY);
      this.setPosition(this.mousePosition.sub(this.shift));
    }
  }

  setPosition(newPos: Vector) {
    this.position = newPos;
    this.canvas.style.left = `${this.position.x}px`;
    this.canvas.style.top = `${this.position.y}px`;
  }

  onScroll(event: WheelEvent) {
    event.preventDefault();
    this.correction = null;

    var oldScale = this.scale;
    this.scale *= Math.pow(this.zoomCoefficient, event.deltaY / this.zoomDeltaDamper);

    if (this.scale < 0.5) {
      this.scale = 0.5;
    }

    if (this.scale > 8) {
      this.scale = 8;
    }

    this.canvas.width = this.canvasHalfSize.x * 2 * this.scale;
    this.canvas.height = this.canvasHalfSize.y * 2 * this.scale;

    var scaled = this.scaleImageData(this.imageData, this.scale);
    this.ctx.putImageData(scaled, 0, 0);

    var zoomCenter = new Vector(event.offsetX, event.offsetY);
    var zoomCenterToPosition = this.position.sub(zoomCenter).mult(this.scale / oldScale);
    this.setPosition(zoomCenter.add(zoomCenterToPosition));
  }

  scaleImageData(imageData: ImageData, scale: number): ImageData {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = imageData.width;
    newCanvas.height = imageData.height;

    newCanvas.getContext("2d").putImageData(imageData, 0, 0);

    // Second canvas, for scaling
    var scaleCanvas = document.createElement("canvas");
    scaleCanvas.width = this.canvas.width;
    scaleCanvas.height = this.canvas.height;

    var scaleCtx = scaleCanvas.getContext("2d");

    scaleCtx.scale(scale, scale);
    scaleCtx.drawImage(newCanvas, 0, 0);

    var scaledImageData = scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height);

    return scaledImageData;
  }
}