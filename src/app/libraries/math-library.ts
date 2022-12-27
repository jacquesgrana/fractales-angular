export class MathLibrary {

/**
 * Fonction qui renvoie le log à base n de x
 *
 * @param n : base du log
 * @param x : valeur a traiter
 * @return log à base n de x
 */
static logN(n: number, x: number): number {
  if (n > 0 && x > 0) {
    return (Math.log(x) / Math.log(n));
  }
  return Number.NEGATIVE_INFINITY;
}

/**
 * Fonction qui renvoie la valeur en radian d'un angle en degré
 *
 * @param angleDegree : angle en degré
 * @return angle en radian
 */
static degreeToRad(angleRad: number): number {
  return (angleRad * Math.PI / 180);
}

/**
 * Fonction qui renvoie la valeur en degré d'un angle en radian
 *
 * @param angleRad : angle en radian
 * @return angle en degré
 */
static radToDegree(angleDegree: number): number {
  return (angleDegree * 180 / Math.PI);
}

/**
 * Fonction qui renvoie la valeur arrondie de value avec rank décimales
 *
 * @param value valeur à arrondir
 * @param rank nombre de chiffres après la virgule
 * @returns nombre arrondi obtenu
 */
static arr(value: number, rank: number): number {
 return (Math.round(value*Math.pow(10,rank))/ Math.pow(10,rank));
}
}
