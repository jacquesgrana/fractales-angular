import { MathLibrary } from "../libraries/math-library";

export class ComplexNb {

  private real: number;
  private imag: number;
  private mod: number;
  private arg: number;

  constructor(isCart: boolean, value1: number, value2: number) {
    if(isCart) {
      this.real = value1;
      this.imag = value2;
      this.mod = Math.sqrt(value1*value1 + value2*value2);
      this.arg = MathLibrary.radToDegree(Math.atan2(value2, value1));
    }
    else {
      this.mod = value1;
      this.arg = value2;
      this.real = value1*Math.cos(MathLibrary.degreeToRad(value2));
      this.imag = value1*Math.sin(MathLibrary.degreeToRad(value2));
    }
  }

  updateTrigo(): void {
    this.mod = Math.sqrt(this.real*this.real + this.imag*this.imag);
    this.arg = MathLibrary.radToDegree(Math.atan2(this.imag, this.real));
  }
  updateCart(): void {
    this.real = this.mod*Math.cos(MathLibrary.degreeToRad(this.arg));
    this.imag = this.mod*Math.sin(MathLibrary.degreeToRad(this.arg));
  }

  conj(): ComplexNb {
        return new ComplexNb(true, this.real, -1*this.imag);
  }
  add(toAdd: ComplexNb): ComplexNb {
        return new ComplexNb(true, this.real + toAdd.real, this.imag + toAdd.imag);
  }
  sub(toSub: ComplexNb): ComplexNb {
        return new ComplexNb(true, this.real - toSub.real, this.imag - toSub.imag);
  }
  mult(toMult: ComplexNb): ComplexNb {
        return new ComplexNb(true, this.real*toMult.real - this.imag*toMult.imag,
        this.real*toMult.imag + this.imag*toMult.real);
  }

  /**
        Division of Complex numbers (doesn't change this Complex number).
        <br>(x+i*y)/(s+i*t) = ((x*s+y*t) + i*(y*s-y*t)) / (s^2+t^2)
        @param w is the number to divide by
        @return new Complex number z/w where z is this Complex number
    */
  div(toDiv: ComplexNb): ComplexNb {
        let modSq = toDiv.mod*toDiv.mod;
        return new ComplexNb(true, (this.real*toDiv.real + this.imag*toDiv.imag)/modSq,
        (this.imag*toDiv.real - this.real*toDiv.imag)/modSq);
  }

  setReal(real: number): void {
    this.real = real;
  }
  setImag(imag: number): void {
    this.imag = imag;
  }
  setMod(mod: number): void {
    this.mod = mod;
  }
  setArg(arg: number): void {
    this.arg = arg;
  }

  getReal(): number {
    return this.real;
  }
  getImag(): number {
    return this.imag;
  }
  getMod(): number {
    return this.mod;
  }
  getArg(): number {
    return this.arg;
  }

  clone(): ComplexNb {
    return new ComplexNb(true, this.getReal(), this.getImag());
  }

  toString(): string {
   return " real : " + this.real + " imag : " + this.imag + " mod : " + this.mod + " arg : " + this.arg;
  }
}
