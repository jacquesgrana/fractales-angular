/*
 * Classe représentant un pixel d'une fenêtre de hauteur SIZE_J
 */
export class Pixel {
  private i : number; // coordonnée horizontale du pixel
  private j : number; // coordonnée verticale du pixel

  /*
   * Constructeur
   */
  constructor(i: number, j: number) {
   this.i =i;
   this.j =j;
  }

  setI(i: number): void {
   this.i = i;
  }
  setJ(j: number): void {
   this.j = j;
  }
  getI(): number {
   return this.i;
  }
  getJ(): number {
   return this.j;
  }

  /*
   * Fonction qui renvoie la coordonnée verticale du pixel pour tenir compte de "l'inversement"
   * de l'axe vertical de la fenêtre
   */
  getJToDraw(SIZE_J: number) {
   return (SIZE_J - this.j -1);
  }
  toString(): string {
   return "i : " + this.i + " / j : " + this.j;
  }

  calcDist(endPixel: Pixel): number {
    return Math.sqrt((endPixel.getI() - this.getI())*(endPixel.getI() - this.getI()) + (endPixel.getJ() - this.getJ())*(endPixel.getJ() - this.getJ()));
  }

  equals(toCompare: Pixel): boolean {
    return this.getI() === toCompare.getI() && this.getJ() === toCompare.getJ();
  }
 }
