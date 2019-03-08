export class Vector {
  constructor(public x: number = 0, public y?: number) {
    if (y === null || y === undefined) {
      this.y = this.x;
    }
  }

  static lerp(t: number, a: Vector, b: Vector): Vector {
    return a.mult(1 - t).add(b.mult(t));
  }

  add(otherVec: Vector) {
    var nV = new Vector();
    nV.x = this.x + otherVec.x;
    nV.y = this.y + otherVec.y;
    return nV;
  }

  sub(otherVec: Vector) {
    var nV = new Vector();
    nV.x = this.x - otherVec.x;
    nV.y = this.y - otherVec.y;
    return nV;
  }

  mult(scale: number) {
    var nV = new Vector();
    nV.x = this.x * scale;
    nV.y = this.y * scale;
    return nV;
  }

  div(scale: number) {
    return this.mult(1 / scale);
  }

  neg() {
    return this.mult(-1);
  }

  dist(otherVec: Vector) {
    var xLeg = otherVec.x - this.x;
    var yLeg = otherVec.y - this.y;
    return Math.sqrt(xLeg * xLeg + yLeg * yLeg);
  }

  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unit() {
    var nV = new Vector();
    var len = this.len();
    nV.x = this.x / len;
    nV.y = this.y / len;
    return nV;
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  rotate(radians: number) {
    var nV = new Vector();
    nV.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    nV.y = this.x * Math.sin(radians) + this.y * Math.cos(radians);
    return nV;
  }
}
