import { GraphicLibrary } from "../libraries/graphic-library";
import { ComplexNb } from "./complex-nb";

/*
 * Classe représentant les paramètres de calcul de la fractale de Julia
 */
export class JuliaFractal {
  private seed: ComplexNb; // seed (c) de la fractale
  private limit: number; // limite du module de la boucle de calcul de la fractale
  private maxIt: number; // maximum d'itérations de la boucle de calcul de la fractale

  /*
   * Constructeur
   */
  constructor(seed: ComplexNb, limit: number, maxIt: number) {
   this.seed = seed;
   this.limit = limit;
   this.maxIt = maxIt;
  }

  getSeed(): ComplexNb {
   return this.seed;
  }
  getLimit(): number {
   return this.limit;
  }
  getMaxIt(): number {
   return this.maxIt;
  }

  setSeed(seed: ComplexNb): void {
   this.seed = seed;
  }
  setLimit(limit: number): void {
   this.limit = limit;
  }
  setMaxIt(maxIt: number): void {
   this.maxIt = maxIt;
  }

    /*
 * Fontion qui renvoie une couleur en fonction du nombre complexe z après traitement selon les
    * paramètres de la fractale
    *
    * @param Complex z : nombre complexe à traiter
    * @param JuliaFractal fractal : objet contenant les paramètres de la fractale (seed c, seuil du module
    * et le nombre d'itération maximum de la boucle de calcul de la fractale
    * @return color colorToReturn : couleur calculée par le traitement de z selon fractal
    */
   calcColorFromJuliaFractal(z: ComplexNb, gradientStart: number, gradientRange: number, bgColor: string): string { // ComplexNb c, Double limitModule, Integer maxIteration
     let colorToReturn = bgColor;
     let c = this.getSeed();
     let limitModule = this.getLimit();
     let iteration = this.getMaxIt();
     let xz = z.getReal();
     let yz = z.getImag();
     let xc = c.getReal();
     let yc = c.getImag();
     //Double module = (double) Math.sqrt(xz * xz + yz * yz);
     let module = z.getMod();

     while ((module < limitModule) && (iteration > 0)) {
       let tmpX = xz * xz - yz * yz + xc;
       yz = 2 * xz * yz + yc;
       xz = tmpX;
       module = Math.sqrt(xz * xz + yz * yz);
       iteration--;
     }
     if (iteration > 0) {
       colorToReturn = bgColor;
     } else {
       colorToReturn = GraphicLibrary.calculateRVB(module, limitModule, gradientStart, gradientRange);
     }
     return colorToReturn;
   }

  toString() {
   return ("seed : ( " + this.seed.toString() + " ) limit : " + this.limit + " maxIt : " + this.maxIt);
  }
 }
