import { MathLibrary } from "../libraries/math-library";
import { MatrixLibrary } from "../libraries/matrix-library";
import { Matrix } from "./matrix";
import { Point } from "./point";

/*
 * Classe représentant les paramètres d'une scene
 */
export class Scene {
  private minX: number; // minimum des x (variable intermédiaire de valcul, à ne pas modifier
  private minY: number; // minimum des y (variable intermédiaire de valcul, à ne pas modifier
  private rangeX: number; // "largeur" des x (variable intermédiaire de valcul, à ne pas modifier
  private rangeY: number; // "largeur" des y (variable intermédiaire de valcul, à ne pas modifier
  private trans: Point; // vecteur de la translation effectuée
  private angle: number; // angle en degré de la rotation effectuée
  private zoom: number; // taux d'agrandissement/réduction effectué
  private matrixDir: Matrix;
  private matrixInv: Matrix;


  /*
  * Constructeur
   */
  constructor(minX: number, minY: number, rangeX: number, rangeY: number, trans: Point, angle: number, zoom: number) {
    this.minX = minX;
    this.minY = minY;
    this.rangeX = rangeX;
    this.rangeY = rangeY;
    this.trans = trans;
    this.angle = angle;
    this.zoom = zoom;
    this.matrixDir = new Matrix(3, 3);
    this.matrixInv = new Matrix(3, 3);
    this.updateMatrix();
  }

  getMinX(): number {
    return this.minX;
  }
  getMinY(): number {
    return this.minY;
  }
  getRangeX(): number {
    return this.rangeX;
  }
  getRangeY(): number {
    return this.rangeY;
  }
  getTrans(): Point {
    return this.trans;
  }
  getAngle(): number {
    return this.angle;
  }
  getZoom(): number {
    return this.zoom;
  }
  getMatrixDir(): Matrix {
    return this.matrixDir;
  }
  getMatrixInv(): Matrix {
    return this.matrixInv;
  }

  setMinX(minX: number): void {
    this.minX = minX;
  }
  setMinY(minY: number): void {
    this.minY = minY;
  }
  setRangeX(rangeX: number): void {
    this.rangeX = rangeX;
  }
  setRangeY(rangeY: number): void {
    this.rangeY = rangeY;
  }
  setTrans(trans: Point): void {
    this.trans = trans;
  }
  setAngle(angle: number): void {
    this.angle = angle;
  }
  setZoom(zoom: number): void {
    this.zoom = zoom;
  }

  updateMatrix() {
    let cos = Math.cos(MathLibrary.degreeToRad(this.getAngle()));
    let sin = Math.sin(MathLibrary.degreeToRad(this.getAngle()));

    let zoom = this.getZoom();
    let trans = this.getTrans();

    let matrixDir = new Matrix(3, 3);

    matrixDir.setValueAt(0, 0, zoom*cos);
    matrixDir.setValueAt(0, 1, -zoom*sin);
    matrixDir.setValueAt(0, 2, trans.getX());

    matrixDir.setValueAt(1, 0, zoom*sin);
    matrixDir.setValueAt(1, 1, zoom*cos);
    matrixDir.setValueAt(1, 2, trans.getY());

    matrixDir.setValueAt(2, 0, 0);
    matrixDir.setValueAt(2, 1, 0);
    matrixDir.setValueAt(2, 2, 1);

    this.matrixDir = matrixDir;
    //console.log("mat dir :\n" + matrixDir.toString());
    let matrixInv = new Matrix(3, 3);

    matrixInv = MatrixLibrary.inverse(matrixDir);
    this.matrixInv = matrixInv;
    //console.log("mat inv :\n" + matrixInv.toString());
  }

  toString(): string {
    return ("minX : " + this.minX + " minY : " + this.minY + " rangeX : " + this.rangeX + " rangeY : " + this.rangeY + " trans ( " + this.trans.toString() + " ) angle : " + this.angle + " zoom : " + this.zoom);
  }

  /*
   * Fonction qui renvoie le pas de la boucle sur l'axe des x en tenant compte de la largeur de la fenêtre
   *
   * @param Integer sizeX : taille horizontale de la fenêtre en pixels
   * @return Double : pas de la boucle sur l'axe des x
   */
  calcStepX(sizeX: number): number {
    return (this.rangeX/sizeX);
  }

  /*
   * Fonction qui renvoie le pas de la boucle sur l'axe des y en tenant compte de la hauteur de la fenêtre
   *
   * @param Integer sizeY : taille verticale de la fenêtre en pixels
   * @return Double : pas de la boucle sur l'axe des y
   */
  calcStepY(sizeY: number): number {
    return (this.rangeY/sizeY);
  }

  /*
  * Fonction qui renvoie le point du milieu de entre (minX) et (minX + rangeX) et entre (minY) et (minY + rangeX)
   *
   * @return Point : milieu
   */
  calcMiddle(): Point {
    let toReturn = new Point(0.0, 0.0);
    toReturn.setX(this.minX + this.rangeX/2);
    toReturn.setY(this.minY + this.rangeY/2);
    return toReturn;
  }
}
