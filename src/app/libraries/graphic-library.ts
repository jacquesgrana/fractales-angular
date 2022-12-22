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
static calculateRVB(value: number, limit: number, start: number, range: number): Color {
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
  return new Color(red, green, blue, 255);
  //return "rgba(" + red + ", " + green + ", " + blue + ", " + 1.0 + ")";
  //return color(red, green, blue);
}

/**
   * Fonction qui renvoie le point(x,y) correspondant au pixel(i,j) de la fenêtre (ou canvas)
   *
   * @param pixel : pixel a convertir en coordonnées x,y
   * @param currenScene : objet scene contenant les paramétres de la scène
   * @param sizeI : largeur en pixel de la fenêtre
   * @param sizeJ : hauteur en pixel de la fenêtre
   * @return point obtenu
   */
public static calcPointFromPix(pixel: Pixel, currentScene: Scene, sizeI: number, sizeJ: number) {
  let x = currentScene.getMinX() + currentScene.calcStepX(sizeI)*pixel.getI();
  let y = currentScene.getMinY() + currentScene.calcStepY(sizeJ)*pixel.getJ();
  //return this.calcDir(new Point(x, y), currentScene);
  return GraphicLibrary.transfDir(new Point(x, y), currentScene);
}

/**
* Fonction qui renvoie le pixel(i,j)  de la fenêtre (ou canvas) correspondant au point(x,y)
 *
 * @param start : point à convertir en pixel
 * @param currenScene : objet scene contenant les paramétres de la scène
 * @param sizeI : largeur en pixel de la fenêtre
 * @param sizeJ : hauteur en pixel de la fenêtre
 * @return pixel obtenu
 */
 public static calcPixelFromPoint(start: Point, currentScene: Scene, sizeI: number, sizeJ: number) {
  let end = GraphicLibrary.transfInv(start, currentScene);
  let x = end.getX();
  let y = end.getY();
  let i = Math.round((x - currentScene.getMinX())*sizeI/currentScene.getRangeX());
  let j = Math.round((y - currentScene.getMinY())*sizeJ/currentScene.getRangeY());
  return new Pixel(i, j);
}

static transfDir(point: Point, currentScene: Scene) {
  let start = new Matrix(3, 1);
  start.setValueAt(0, 0, point.getX());
  start.setValueAt(1, 0, point.getY());
  start.setValueAt(2, 0, 1);
  let end = MatrixLibrary.multiply(currentScene.getMatrixDir(), start);
  return new Point(end.getValueAt(0, 0), end.getValueAt(1, 0));
}

static transfInv(point: Point, currentScene: Scene) {
  let start = new Matrix(3, 1);
  start.setValueAt(0, 0, point.getX());
  start.setValueAt(1, 0, point.getY());
  start.setValueAt(2, 0, 1);
  let end = MatrixLibrary.multiply(currentScene.getMatrixInv(), start);
  return new Point(end.getValueAt(0, 0), end.getValueAt(1, 0));
}
}
