import { MathLibrary } from 'src/app/libraries/math-library';

export class Color {

  private red: number;
  private green: number;
  private blue: number;
  private alpha: number;

  constructor(red: number, green: number, blue: number, alpha: number) {
    this.red = Color.capValue(red);
    this.green = Color.capValue(green);
    this.blue = Color.capValue(blue);
    this.alpha = Color.capValue(alpha);
  }

  public getRed(): number {
    return this.red;
  }
  public getGreen(): number {
    return this.green;
  }
  public getBlue(): number {
    return this.blue;
  }
  public getAlpha(): number {
    return this.alpha;
  }

  public getAlphaRatio(): number {
    return MathLibrary.arr(this.alpha / 255, 3);
  }

  public setAlphaByRatio(ratio: number): void {
    this.alpha = Color.capValue(255 * ratio);
  }

  public setRed(red: number): void {
    this.red = Color.capValue(red);
  }
  public setGreen(green: number): void {
    this.green = Color.capValue(green);
  }
  public setBlue(blue: number): void {
    this.blue = Color.capValue(blue);
  }
  public setAlpha(alpha: number): void {
    this.alpha = Color.capValue(alpha);
  }

  public getRgbaColor(): string {
    return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.getAlphaRatio + ')';
  }

  public toString(): string {
    return 'color [red : ' + this.red + ' green : ' + this.green + ' blue : ' + this.blue + ' alpha : ' + this.alpha + ']';
  }

  private static capValue(value : number): number {
    value = Math.round(value);
    if(value < 0) value = 0;
    else if(value > 255) value = 255;
    return value
  }
}
