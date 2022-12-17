import { MathLibrary } from "../libraries/math-library";

/*
 * Classe représentant un point du plan des réels
 */
export class Point {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
   this.x = x;
   this.y = y;
  }

  setX(x: number): void {
   this.x = x;
  }
  setY(y: number): void {
   this.y = y;
  }
  getX(): number {
   return this.x;
  }
  getY(): number {
   return this.y;
  }
  toString(): string {
   return ("x : " + this.x + " y : " + this.y);
  }

  calcMagnitude(): number {
   return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  calcAngle(): number {
   return MathLibrary.radToDegree(Math.atan2(this.y, this.x));
  }

  calcDist(endPoint: Point): number {
    return Math.sqrt((endPoint.getX() - this.x)*(endPoint.getX() - this.x) + (endPoint.getY() - this.y)*(endPoint.getY() - this.y));
  }

 }
