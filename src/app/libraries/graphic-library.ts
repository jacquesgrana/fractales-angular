import { Pixel } from "../classes/pixel";
import { Point } from "../classes/point";
import { Scene } from "../classes/scene";
import { MatrixLibrary } from "./matrix-library";
import { Matrix } from 'src/app/classes/matrix';
import { Color } from "../classes/color";

export class GraphicLibrary {
  /*
 * Fonction qui renvoie une couleur selon value comparé à limit sur une partie ou tout "l'arc en ciel"
 * qui est découpé en 6 parties
 *
 * @param Double value : valeur à comparer, valeur allant de 0 à limit
 * @param Double limit : maximum de value
 * @param Integer start : détermine la couleur de début du dégradé dans l'arc en ciel
 * @param Integer range : détermine la partie de l'arc en ciel utilisée par le dégradé (start + range <= 6)
 * @return color : couleur déterminée par la comparaison sur une partie ou tout "l'arc en ciel"
 */
static calculateRVB(value: number, limit: number, start: number, range: number): string {
  let red = 0;
  let green = 0;
  let blue = 0;

  if ((start + range) <= 6) {
    let x = start + range * value / limit;

    if (x >= 0 && x < 1) {
      red = 255;
    } else if (x >= 1 && x < 2) {
      red = Math.round(255 - (x - 1)*255);
    } else if (x >= 2 && x < 4) {
      red = 0;
    } else if (x >= 4 && x < 5) {
      red = Math.round((x - 4)*255);
    } else if (x >= 5 && x <= 6) {
      red = 255;
    }

    if (x >= 0 && x < 1) {
      green = Math.round(x*255);
    } else if (x >= 1 && x < 3) {
      green = 255;
    } else if (x >= 3 && x < 4) {
      green = Math.round(255 - (x - 3)*255);
    } else if (x >= 4 && x <= 6) {
      green = 0;
    }

    if (x >= 0 && x < 2) {
      blue = 0;
    } else if (x >= 2 && x < 3) {
      blue = Math.round((x - 2)*255);
    } else if (x >= 3 && x < 5) {
      blue = 255;
    } else if (x >= 5 && x <= 6) {
      blue = Math.round(255 - (x - 5)*255);
    }
  }
  let colorToReturn = new Color(red, green, blue, 255);
  return "rgba(" + red + ", " + green + ", " + blue + ", " + 1.0 + ")";
  //return color(red, green, blue);
}

/*
   * Fonction qui renvoie le point(x,y) correspondant au pixel(i,j) de la fenêtre
   *
   * @param Pixel pixel : pixel a convertir en coordonnées x,y
   * @param Point trans : "vecteur" de la tranlation
   * @param Double age : taux d'agrandissement/réduction
   * @param Double angle : angle en degré de la rotation
   * @param Scene currenScene : objet scene contenant les paramétres de la scène
   * @return Point
   */
public static calcPointFromPix(pixel: Pixel, currentScene: Scene, sizeI: number, sizeJ: number) {
  let x = currentScene.getMinX() + currentScene.calcStepX(sizeI)*pixel.getI();
  let y = currentScene.getMinY() + currentScene.calcStepY(sizeJ)*pixel.getJ();
  //return this.calcDir(new Point(x, y), currentScene);
  return GraphicLibrary.transfDir(new Point(x, y), currentScene);
}

/*
* Fonction qui renvoie le pixel(i,j)  de la fenêtre correspondant au point(x,y)
 *
 * @param Point start : point à convertir en pixel
 * @param Point trans : "vecteur" de la tranlation
 * @param Double age : taux d'agrandissement/réduction
 * @param Double angle : angle en degré de la rotation
 * @param Scene currenScene : objet scene contenant les paramétres de la scène
 à @return Pixel
 */
 public static calcPixelFromPoint(start: Point, currentScene: Scene, sizeI: number, sizeJ: number) {
  //let end = this.calcInv(start, currentScene);
  let end = GraphicLibrary.transfInv(start, currentScene);
  let x = end.getX();
  let y = end.getY();
  //console.log("x :", x);
  //console.log("y :", y);

  let i = Math.round((x - currentScene.getMinX())*sizeI/currentScene.getRangeX());
  let j = Math.round((y - currentScene.getMinY())*sizeJ/currentScene.getRangeY());
  return new Pixel(i, j);
}

static transfDir(point: Point, currentScene: Scene) {
  let start = new Matrix(3, 1);
  //print("start : 0,0 : " + start.getValueAt(0,0));
  start.setValueAt(0, 0, point.getX());
  start.setValueAt(1, 0, point.getY());
  start.setValueAt(2, 0, 1);
  //console.log("mat point start transf dir :\n" + start.toString());

  //print("mat point start transf dir :\n" + start.toString());
  let end = MatrixLibrary.multiply(currentScene.getMatrixDir(), start);
  //print("mat point end transf dir :\n" + start.toString());
  return new Point(end.getValueAt(0, 0), end.getValueAt(1, 0));
}

static transfInv(point: Point, currentScene: Scene) {
  let start = new Matrix(3, 1);
  start.setValueAt(0, 0, point.getX());
  start.setValueAt(1, 0, point.getY());
  start.setValueAt(2, 0, 1);
  //console.log("mat point start transf inv :\n" + start.toString());

  //print("mat point start transf inv :\n" + start.toString());
  let end = MatrixLibrary.multiply(currentScene.getMatrixInv(), start);
  //console.log("matrice inverse : " + currentScene.getMatrixInv().toString());

  //print("matrice inverse : " + this.matrixInv.toString());
  //let end = multiply(this.matrixInv, start);
  //print("point end transf inv :\n" + end.toString());
  return new Point(end.getValueAt(0, 0), end.getValueAt(1, 0));
}
}
