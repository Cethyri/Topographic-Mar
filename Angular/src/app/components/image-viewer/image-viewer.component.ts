import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable, interval } from "rxjs";
import { Vector } from "../../classes/vector";
import { Interpolation } from "../../classes/interpolation";
import { wrappedError } from "@angular/core/src/error_handler";

@Component({
  selector: "app-image-viewer",
  templateUrl: "./image-viewer.component.html",
  styleUrls: ["./image-viewer.component.scss"]
})
export class ImageViewerComponent implements OnInit {
  @Input() imageSource$: Observable<string>;
  @Input() width: number;
  @Input() height: number;

  @Output() onClick = new EventEmitter();

  hasData = false;

  img: HTMLImageElement;
  wrapper: HTMLDivElement;
  viewer: HTMLDivElement;
  loadingIndicator: HTMLDivElement;

  imageData: ImageData;

  viewerCenter: Vector;

  canvasHalfSize = new Vector();
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

  constructor() {}

  ngOnInit() {
    this.img = <HTMLImageElement>document.getElementById("img");
    this.wrapper = <HTMLDivElement>document.getElementById("img-wrapper");
    this.viewer = <HTMLDivElement>document.getElementById("viewer");
    this.loadingIndicator = <HTMLDivElement>(
      document.getElementById("loading-indicator")
    );

    this.width = this.width || this.viewer.clientWidth;
    this.height = this.height || this.viewer.clientHeight;
    this.viewerCenter = new Vector(this.width, this.height).div(2);
    this.viewer.style.width = `${this.width}px`;
    this.viewer.style.height = `${this.height}px`;

    this.loadingIndicator.style.width = `${this.width}px`;
    this.loadingIndicator.style.height = `${this.height}px`;
    this.loadingIndicator.style.padding = `${(this.height - 100) / 2}px ${(this
      .width -
      100) /
      2}px`;

    this.velocityDieDown = {
      t: 0,
      start: new Vector()
    };

    this.timer.subscribe(() => {
      this.timerMethod();
    });

    this.imageSource$.subscribe(data => this.updateImageSource(data));
  }

  timerMethod() {
    if (!this.img.src) {
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

    if (this.img.width < this.viewer.clientWidth) {
      correction.x = this.viewerCenter.x - canvasCenter.x;
    } else if (this.position.x > threshold) {
      correction.x = threshold - this.position.x;
    } else if (
      this.position.x + this.img.width <
      this.viewerCenter.x * 2 - threshold
    ) {
      correction.x =
        this.viewerCenter.x * 2 -
        threshold -
        (this.position.x + this.img.width);
    }

    if (this.img.height < this.viewer.clientHeight) {
      correction.y = this.viewerCenter.y - canvasCenter.y;
    } else if (this.position.y > threshold) {
      correction.y = threshold - this.position.y;
    } else if (
      this.position.y + this.img.height <
      this.viewerCenter.y * 2 - threshold
    ) {
      correction.y =
        this.viewerCenter.y * 2 -
        threshold -
        (this.position.y + this.img.height);
    }

    return correction.mult(1);
  }

  getCanvasCenter(): Vector {
    return this.position.add(this.canvasHalfSize.mult(this.scale));
  }

  slide(dt: number) {
    var correctionVector = this.getCorrectionVelocity(50);
    if (
      (Math.abs(correctionVector.x) > this.threshold ||
        Math.abs(correctionVector.y) > this.threshold) &&
      !this.correction
    ) {
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
        this.wrapper.removeAttribute("moving");
      }
    }
  }

  updateImageSource(data: string) {
    this.hasData = false;
    if (data) {
      let pseudoImg = document.createElement("img");
      pseudoImg.src = data;
      pseudoImg.onload = () => {
        this.hasData = true;
        this.img.src = data;
        this.img.removeAttribute("hidden");

        let newHalfSize = new Vector(pseudoImg.width, pseudoImg.height).mult(
          0.5
        );
        if (
          this.canvasHalfSize.x != newHalfSize.x ||
          this.canvasHalfSize.y != newHalfSize.y
        ) {
          this.canvasHalfSize = newHalfSize;

          this.img.width = pseudoImg.width;
          this.img.height = pseudoImg.height;

          this.scale = 1;

          this.setPosition(this.viewerCenter.sub(this.canvasHalfSize));
        }
      };
    } else {
      this.img.src = "";
      this.img.setAttribute("hidden", "");

      this.canvasHalfSize = new Vector();

      this.img.width = 0;
      this.img.height = 0;

      this.scale = 1;

      this.setPosition(this.viewerCenter.sub(this.canvasHalfSize));
    }
  }

  handleMouseEvent(event: MouseEvent) {
    this.mousePosition = new Vector(event.offsetX, event.offsetY);

    switch (event.type) {
      case "mousedown":
      case "mouseenter":
        if (event.buttons) {
          this.clicked = true;
          this.wrapper.setAttribute("moving", "");
          this.lastMousePosition = this.mousePosition;
          this.mouseStartPosition = this.mousePosition;
          this.shift = this.mousePosition.sub(this.position);
        }
        break;
      case "mouseup":
        if (
          this.hasData &&
          this.mouseStartPosition.dist(this.mousePosition) < 5
        ) {
          var clickPosition = this.mousePosition
            .sub(this.position)
            .div(this.scale);
          var clickPosition = new Vector(
            Math.round(clickPosition.x),
            Math.round(clickPosition.y)
          );
          this.hasData = false;
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
    this.wrapper.style.left = `${this.position.x}px`;
    this.wrapper.style.top = `${this.position.y}px`;
  }

  onScroll(event: WheelEvent) {
    event.preventDefault();
    this.correction = null;

    var oldScale = this.scale;
    this.scale *= Math.pow(
      this.zoomCoefficient,
      event.deltaY / this.zoomDeltaDamper
    );

    let minHeightScale = (this.height - 100) / (this.canvasHalfSize.y * 2);
    let minWidthScale = (this.width - 100) / (this.canvasHalfSize.x * 2);

    let minScale = Math.min(minHeightScale, minWidthScale, 1);

    if (this.scale < minScale) {
      this.scale = minScale;
    }

    if (this.scale > 16) {
      this.scale = 16;
    }

    this.img.width = this.canvasHalfSize.x * 2 * this.scale;
    this.img.height = this.canvasHalfSize.y * 2 * this.scale;

    var zoomCenter = new Vector(event.offsetX, event.offsetY);
    var zoomCenterToPosition = this.position
      .sub(zoomCenter)
      .mult(this.scale / oldScale);
    this.setPosition(zoomCenter.add(zoomCenterToPosition));
  }
}
