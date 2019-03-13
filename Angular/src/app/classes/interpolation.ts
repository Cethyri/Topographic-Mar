export class Interpolation {
  static lerp(t: number, a: number, b: number): number {
    return a * (1 - t) + b * t;
  }

  static linear(t: number): number {
    return t;
  }

  static smoothStep(t: number): number {
    return t * t * (3.0 - 2.0 * t);
  }

  static smootherStep(t: number): number {
    return t * t * t * (t * (6.0 * t - 15.0) + 10.0);
  }

  static sineIn(t: number): number {
    return Math.sin((t - 1.0) * Math.PI * 0.5) + 1.0;
  }

  static sineOut(t: number): number {
    return Math.sin(t * Math.PI * 0.5);
  }

  static sineInOut(t: number): number {
    return (1.0 - Math.cos(t * Math.PI)) * 0.5;
  }

  static quadraticIn(t: number): number {
    return t * t;
  }

  static quadraticOut(t: number): number {
    return -(t * (t - 2.0));
  }

  static quadraticInOut(t: number): number {
    return t < 0.5 ? 2.0 * (t * t) : -2.0 * t * t + 4 * t - 1;
  }

  static cubicIn(t: number): number {
    return Math.pow(t, 3);
  }

  static cubicOut(t: number): number {
    return 1.0 - Math.pow(1.0 - t, 3);
  }

  static cubicInOut(t: number): number {
    return t < 0.5
      ? Math.pow(t * 2.0, 3) * 0.5
      : 1.0 - Math.pow((1.0 - t) * 2.0, 3) * 0.5;
  }

  static quarticIn(t: number): number {
    return Math.pow(t, 4);
  }

  static quarticOut(t: number): number {
    return 1.0 - Math.pow(1.0 - t, 4);
  }

  static quarticInOut(t: number): number {
    return t < 0.5
      ? Math.pow(t * 2.0, 4) * 0.5
      : 1.0 - Math.pow((1.0 - t) * 2.0, 4) * 0.5;
  }

  static quinticIn(t: number): number {
    return Math.pow(t, 5);
  }

  static quinticOut(t: number): number {
    return 1.0 - Math.pow(1.0 - t, 5);
  }

  static quinticInOut(t: number): number {
    return t < 0.5
      ? Math.pow(t * 2.0, 5) * 0.5
      : 1.0 - Math.pow((1.0 - t) * 2.0, 5) * 0.5;
  }

  static circularIn(t: number): number {
    return 1.0 - Math.sqrt(1.0 - t * t);
  }

  static circularOut(t: number): number {
    return Math.sqrt((2.0 - t) * t);
  }

  static circularInOut(t: number): number {
    return t < 0.5
      ? (1.0 - Math.sqrt(1.0 - 4.0 * (t * t))) * 0.5
      : (Math.sqrt(-(t * 2.0 - 3.0) * (t * 2.0 - 1.0)) + 1.0) * 0.5;
  }

  static expoIn(t: number): number {
    return t == 0.0 ? 0.0 : Math.pow(2, 10.0 * (t - 1.0));
  }

  static expoOut(t: number): number {
    return t == 1.0 ? 1.0 : 1.0 - Math.pow(2, -10.0 * t);
  }

  static expoInOut(t: number): number {
    if (t == 0.0 || t == 1.0) return t;

    t = t * 2.0;
    if (t < 1.0) {
      return Math.pow(1024.0, t - 1.0) * 0.5;
    }

    return (-Math.pow(2.0, -10.0 * (t - 1.0)) + 2.0) * 0.5;
  }

  static backIn(t: number): number {
    var s = 1.70158;

    return t * t * ((s + 1.0) * t - s);
  }

  static backOut(t: number): number {
    var s = 1.70158;

    t = t - 1.0;
    return t * t * ((s + 1.0) * t + s) + 1.0;
  }

  static backInOut(t: number): number {
    var s = 1.70158 * 1.525;

    t = t * 2.0;
    if (t < 1.0) {
      return t * t * ((s + 1.0) * t - s) * 0.5;
    }

    t = t - 2.0;
    return (t * t * ((s + 1.0) * t + s) + 2.0) * 0.5;
  }

  static bounceIn(t: number): number {
    return 1.0 - this.bounceOut(1.0 - t);
  }

  static bounceOut(t: number): number {
    if (t < 1.0 / 2.75) return 7.5625 * t * t;
    else if (t < 2.0 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    else if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;

    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }

  static bounceInOut(t: number): number {
    if (t < 0.5) return this.bounceIn(t * 2.0) * 0.5;

    return this.bounceOut(t * 2.0 - 1.0) * 0.5 + 0.5;
  }

  static elasticIn(t: number): number {
    if (t == 0.0 || t == 1.0) return t;

    return (
      -Math.pow(2.0, 10.0 * (t - 1.0)) * Math.sin((t - 1.1) * 5.0 * Math.PI)
    );
  }

  static elasticOut(t: number): number {
    if (t == 0.0 || t == 1.0) return t;

    return Math.pow(2.0, -10.0 * t) * Math.sin((t - 0.1) * 5.0 * Math.PI) + 1.0;
  }

  static elasticInOut(t: number): number {
    if (t == 0.0 || t == 1.0) return t;

    t = t * 2.0;
    if (t < 1.0) {
      return (
        Math.pow(2, 10.0 * (t - 1)) * Math.sin((t - 1.1) * 5.0 * Math.PI) * -0.5
      );
    }

    return (
      Math.pow(2.0, -10.0 * (t - 1)) *
        Math.sin((t - 1.1) * 5.0 * Math.PI) *
        0.5 +
      1.0
    );
  }

  static catmullRom(t: number, p0: number, p1: number, p2: number, p3): number {
    return (
      0.5 *
      (2.0 * p1 +
        (-p0 + p2) * t +
        (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t +
        (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t * t * t)
    );
  }
}
