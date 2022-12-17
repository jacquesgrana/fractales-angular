export class Color {

  private red: number;
  private green: number;
  private blue: number;
  private alpha: number;

  constructor(red: number, green: number, blue: number, alpha: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
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

  public setRed(red: number): void {
    this.red = red;
  }
  public setGreen(green: number): void {
    this.green = green;
  }
  public setBlue(blue: number): void {
    this.blue = blue;
  }
  public setAlpha(alpha: number): void {
    this.alpha = alpha;
  }

  public getColor(): string {
    return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
  }

  public toString(): string {
    return 'color [red : ' + this.red + ' green : ' + this.green + ' blue : ' + this.blue + ' alpha : ' + this.alpha + ']';
  }
}
