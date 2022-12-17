export class MathLibrary {

/*
 * Fonction qui renvoie le log à base n de x
 *
 * @param Double n : base du log
 * @param Double x : valeur a traiter
 * @return Double : log à base n de x
 */
static log(n: number, x: number): number | null {
  if (n>0 && x>0) {
    return (Math.log(x) / Math.log(n));
  }
  return null;
}

/*
 * Fonction qui renvoie la valeur en radian d'un angle en degré
 *
 * @param Double angleDegree : angle en degré
 * @return Double : angle en radian
 */
static degreeToRad(angleRad: number): number {
  return (angleRad * Math.PI / 180);
}

/*
 * Fonction qui renvoie la valeur en degré d'un angle en radian
 *
 * @param Double angleRad : angle en radian
 * @return Double : angle en degré
 */
static radToDegree(angleDegree: number): number {
  return (angleDegree * 180 / Math.PI);
}

static arr(value: number, rank: number): number {
 return (Math.round(value*Math.pow(10,rank))/ Math.pow(10,rank));
}
}
