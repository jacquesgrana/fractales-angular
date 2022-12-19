import { newArray } from '@angular/compiler/src/util';
import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComplexNb } from '../classes/complex-nb';
import { JuliaFractal } from '../classes/julia-fractal';
import { Pixel } from '../classes/pixel';
import { Point } from '../classes/point';
import { Scene } from '../classes/scene';
import { GraphicLibrary } from '../libraries/graphic-library';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  public imageData!: ImageData;
  //public data!: Uint8ClampedArray;
  public tabToDraw!: string[][];

  public canvasWidth!: number;
  public canvasHeight!: number;

  public canvas!: ElementRef;
  public context!: CanvasRenderingContext2D;

  public backgroundColor: string = 'rgba(20,20,20,1.0)';
  public axesColor: string = 'rgba(255,255,255,0.38)';
  public originColor: string = 'rgba(255,255,255,0.62)';

  public currentScene!: Scene;
  public trans!: Point;
  public angle!: number;
  public zoom!: number;

  public fractal!: JuliaFractal;
  public fractals!: Array<JuliaFractal>;

  public real: number = 0;
  public imag: number = 0;
  public limit: number = 2;
  public iterNb: number = 100;

  public isFractalDisplayed: boolean = true;
  public isAxesDisplayed: boolean = true;
  public isSettingsDisplayed: boolean= false;

  public calcFractalProgressObs$!: BehaviorSubject<number>;
  public calcFractalProgress!: number;

  constructor() {
    //new JuliaFractal(new ComplexNb("Cart", 0.355534, -0.337292), limitModule, 1000);
    //this.fractal = new JuliaFractal(new ComplexNb(true, -0.4, -0.59), 2, 150);
    this.initFractalList();
    this.fractal = this.fractals[0];
    //this.fractal = new JuliaFractal("Fractale de base", new ComplexNb(true, 0.355, 0.355), 2, 100);
    this.real = this.fractal.getSeed().getReal();
    this.imag = this.fractal.getSeed().getImag();
    this.limit = this.fractal.getLimit();
    this.iterNb = this.fractal.getMaxIt();

    this.calcFractalProgressObs$ = new BehaviorSubject<number>(0);
    this.calcFractalProgressObs$.subscribe(v => {
      this.calcFractalProgress = v;
    });
    this.calcFractalProgressObs$.next(0);

  }

  initFractalList(): void {
    let length: number = 0;
    this.fractals = new Array<JuliaFractal>();
    length = this.fractals.push(new JuliaFractal("Classique", new ComplexNb(true, -0.4, -0.59), 2, 150));
    length = this.fractals.push(new JuliaFractal("Pas mal", new ComplexNb(true, 0.355534, -0.337292), 2, 1000));
    length = this.fractals.push(new JuliaFractal("A voir", new ComplexNb(true, -0.4, -0.59), 2, 100));
    length = this.fractals.push(new JuliaFractal("Jolie", new ComplexNb(true, -0.54, 0.54), 2, 100));
    length = this.fractals.push(new JuliaFractal("A zoomer", new ComplexNb(true, 0.355, 0.355), 2, 100));
    length = this.fractals.push(new JuliaFractal("Cool", new ComplexNb(true, -0.7, 0.27015), 2, 200));
    length = this.fractals.push(new JuliaFractal("Ouech", new ComplexNb(true, 0.285, 0.01), 2, 75));
    length = this.fractals.push(new JuliaFractal("Strange", new ComplexNb(true, -1.417022285618, 0.0099534), 2, 20));
    length = this.fractals.push(new JuliaFractal("Si on veut", new ComplexNb(true, -0.038088, 0.9754633), 2, 20));
    length = this.fractals.push(new JuliaFractal("Faut voir...", new ComplexNb(true, 0.285, 0.013), 2, 200));
    length = this.fractals.push(new JuliaFractal("Arrg", new ComplexNb(true, -0.4, 0.6), 2, 100));
    length = this.fractals.push(new JuliaFractal("Wow", new ComplexNb(true, -0.8, 0.156), 2, 150));
    length = this.fractals.push(new JuliaFractal("Waouw", new ComplexNb(true, 0.0, 0.8), 2, 25));
    length = this.fractals.push(new JuliaFractal("Hé bé", new ComplexNb(true, 0.3, 0.5), 2, 50));
    length = this.fractals.push(new JuliaFractal("Voilà", new ComplexNb(true, -0.8, 0.0), 2, 200));
    console.log('nombre de fractales dans la liste :', length);

  }
  /**
   * let tabFractal = new Array(fractalNb);
    tabFractal[0] = new JuliaFractal(new ComplexNb("Cart", -0.4, -0.59), limitModule, 150);
    tabFractal[1] = new JuliaFractal(new ComplexNb("Cart", 0.355534, -0.337292), limitModule, 1000);
    tabFractal[2] = new JuliaFractal(new ComplexNb("Cart", -0.4, -0.59), limitModule, 100);
    tabFractal[3] = new JuliaFractal(new ComplexNb("Cart", -0.54, 0.54), limitModule, 100);
    tabFractal[4] = new JuliaFractal(new ComplexNb("Cart", 0.355, 0.355), limitModule, 100);
    tabFractal[5] = new JuliaFractal(new ComplexNb("Cart", -0.7, 0.27015), limitModule, 200);
    tabFractal[6] = new JuliaFractal(new ComplexNb("Cart", 0.285, 0.01), limitModule, 75);
    tabFractal[7] = new JuliaFractal(new ComplexNb("Cart", -1.417022285618, 0.0099534), limitModule, 20);
    tabFractal[8] = new JuliaFractal(new ComplexNb("Cart", -0.038088, 0.9754633), limitModule, 20);
    tabFractal[9] = new JuliaFractal(new ComplexNb("Cart", 0.285, 0.013 ), limitModule, 200);
    tabFractal[10] = new JuliaFractal(new ComplexNb("Cart", -0.4, 0.6 ), limitModule, 100);
    tabFractal[11] = new JuliaFractal(new ComplexNb("Cart", -0.8, 0.156 ), limitModule, 150);
    tabFractal[12] = new JuliaFractal(new ComplexNb("Cart", 0.0, 0.8), limitModule, 25);
    tabFractal[13] = new JuliaFractal(new ComplexNb("Cart", 0.3, 0.5), limitModule, 50);
    tabFractal[14] = new JuliaFractal(new ComplexNb("Cart", -0.8, 0.0), limitModule, 200);
   */

  public initService(): void {
    this.initTabToDraw();
    this.angle = 0;
    this.zoom = 1;
    this.trans = new Point(0, 0);
    const deltaY = 2;
    const minY = -1;
    const deltaX = deltaY * this.canvasWidth / this.canvasHeight;
    const minX = -1 * deltaX / 2;
    this.currentScene = new Scene(minX, minY, deltaX, deltaY, this.trans, this.angle, this.zoom);
    //console.log('Min x :', minX, 'range x :', deltaX);
    //this.imageData = this.context.createImageData(this.canvasWidth, this.canvasHeight);
    //this.data = this.imageData.data;
  }

  private initTabToDraw(): void {
    this.tabToDraw = new Array(this.canvasWidth);
    for (let i = 0; i < this.canvasWidth; i++) {
      this.tabToDraw[i] = new Array(this.canvasHeight);
      for (let j = 0; j < this.canvasHeight; j++) {
        this.tabToDraw[i][j] = this.backgroundColor;
      }
    }
  }

  public initImageData(): void {
    this.imageData = this.context.createImageData(this.canvasWidth, this.canvasHeight);
    //this.data = this.imageData.data;
  }


  // TODO rendre asynchrone
  public updateTabToDraw(): void {
    const promise = new Promise<void>((resolve, reject) => {
      const max = (this.canvasWidth * this.canvasHeight) - 1;
      //this.setCalcFractalProgress(0);
      this.calcFractalProgressObs$.next(0);
      let cpt = 0;
      let pix = new Pixel(0, 0);
      for (let i = 0; i < this.canvasWidth; i++) {
        for (let j = 0; j < this.canvasHeight; j++) {

          pix.setI(i);
          pix.setJ(j);
          //pix.setJ(pix.getJToDraw(this.canvasHeight));
          let pointM = GraphicLibrary.calcPointFromPix(pix, this.currentScene, this.canvasWidth, this.canvasHeight);
          let z = new ComplexNb(true, pointM.getX(), pointM.getY());
          let colorPt = this.fractal.calcColorFromJuliaFractal(z, 3, 2, this.backgroundColor);
          //let realPix = new Pixel(pix.getI(), pix.getJToDraw(this.canvasHeight));
          this.tabToDraw[pix.getI()][pix.getJToDraw(this.canvasHeight)] = colorPt;
          //console.log('color : i :', i, ':', j, ':', colorPt);
          //console.log('jobPercent :', jobPercent);

          //this.calcFractalProgress = jobPercent;
          let jobPercent = 100 * cpt / max;
          //jobPercent = jobPercent == 100 ? 0 : jobPercent;
          //this.setCalcFractalProgress(jobPercent);
          this.calcFractalProgressObs$.next(jobPercent);
          //this.cd.detectChanges();
          cpt++;
        }
      }
      resolve();
    }).then(() =>
      {
        console.log('calcul fini');
        //this.calcFractalProgressObs$.next(0);
      }
    )


  }

  public loadImageFromTab(): void {
    for (let i = 0; i < this.canvasWidth; i++) {
      for (let j = 0; j < this.canvasHeight; j++) {
        let str = this.tabToDraw[i][j].substring(4);
        str = str.substring(0, str.length - 1);
        let tabVal = str.split(',');
        let red: number = parseInt(tabVal[0]);
        let green: number = parseInt(tabVal[1]);
        let blue: number = parseInt(tabVal[2]);

        let indice: number = (j * this.canvasWidth * 4) + (i * 4);
        this.imageData.data[indice] = red;
        this.imageData.data[indice + 1] = green;
        this.imageData.data[indice + 2] = blue;
        this.imageData.data[indice + 3] = 255;
      }
    }
    //this.imageData.data = this.data;
  }

  public updateDisplay(): void {
    //this.setCalcFractalProgress(0);
    //setTimeout(() => {}, 100);
    /*
    this.calcFractalProgressObs$.unsubscribe();
    this.calcFractalProgressObs$ = new BehaviorSubject<number>(0);
    this.calcFractalProgressObs$.subscribe(v => {
      this.calcFractalProgress = v;
    });*/
    this.calcFractalProgressObs$.next(0);
    this.currentScene.updateMatrix();
    this.isFractalDisplayed ? this.drawFractal() : this.drawBlank();
    if (this.isAxesDisplayed) this.drawAxes();

    }

  drawBlank(): void {
    //this.canvasService.updateTabToDraw();
    this.initImageData();
    this.initTabToDraw();
    this.loadImageFromTab();
    this.context.imageSmoothingQuality = "high";
    this.context.putImageData(this.imageData, 0, 0);
  }

  drawAxes() {
    // TODO a finir
    const originPt = new Point(0.0, 0.0);
    const originPx = GraphicLibrary.calcPixelFromPoint(originPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    //this.canvasService.context.fillStyle = this.canvasService.originColor;
    //console.log("origine :", originPx.toString());
    //console.log("current scene :", this.canvasService.currentScene);
    //console.log("width pixel :", this.canvasService.canvasWidth);
    //console.log("height pixel :", this.canvasService.canvasHeight);


    //originPx.getI(), originPx.getJToDraw(sizeJZone), 20
    this.context.beginPath();
    this.context.arc(originPx.getI(), originPx.getJToDraw(this.canvasHeight), 8, 0, 2 * Math.PI, true);
    //this.canvasService.context.fillStyle = this.canvasService.originColor;
    //this.canvasService.context.fill();
    this.context.lineWidth = 1;
    this.context.strokeStyle = this.axesColor;
    this.context.stroke();

    const vectorIPoint = new Point(1, 0);
    const vectorIPix = GraphicLibrary.calcPixelFromPoint(vectorIPoint, this.currentScene, this.canvasWidth, this.canvasHeight);
    const vectorIOppPoint = new Point(-1, 0);
    const vectorIOppPix = GraphicLibrary.calcPixelFromPoint(vectorIOppPoint, this.currentScene, this.canvasWidth, this.canvasHeight);

    this.context.beginPath();
    this.context.arc(vectorIPix.getI(), vectorIPix.getJToDraw(this.canvasHeight), 4, 0, 2 * Math.PI, true);
    this.context.fillStyle = this.originColor;
    this.context.fill();
    this.context.lineWidth = 1;
    this.context.strokeStyle = this.axesColor;
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(vectorIOppPix.getI(), vectorIOppPix.getJToDraw(this.canvasHeight));
    this.context.lineTo(vectorIPix.getI(), vectorIPix.getJToDraw(this.canvasHeight));
    this.context.strokeStyle = this.axesColor;
    this.context.lineWidth = 1;
    this.context.stroke();

    const vectorJPoint = new Point(0, 1);
    const vectorJPix = GraphicLibrary.calcPixelFromPoint(vectorJPoint, this.currentScene, this.canvasWidth, this.canvasHeight);
    const vectorJOppPoint = new Point(0, -1);
    const vectorJOppPix = GraphicLibrary.calcPixelFromPoint(vectorJOppPoint, this.currentScene, this.canvasWidth, this.canvasHeight);

    this.context.beginPath();
    this.context.arc(vectorJPix.getI(), vectorJPix.getJToDraw(this.canvasHeight), 4, 0, 2 * Math.PI, true);
    this.context.fillStyle = this.originColor;
    this.context.fill();
    this.context.lineWidth = 1;
    this.context.strokeStyle = this.axesColor;
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(vectorJOppPix.getI(), vectorJOppPix.getJToDraw(this.canvasHeight));
    this.context.lineTo(vectorJPix.getI(), vectorJPix.getJToDraw(this.canvasHeight));
    this.context.strokeStyle = this.axesColor;
    this.context.lineWidth = 1;
    this.context.stroke();

    const radius: number = originPx.calcDist(vectorIPix); // TODO a modifier --> calculer plutot la distance // Math.abs(vectorIPix.getI() - originPx.getI());
    //console.log('radius :', radius);
    this.context.beginPath();
    this.context.arc(originPx.getI(), originPx.getJToDraw(this.canvasHeight), radius, 0, 2 * Math.PI, true);
    this.context.lineWidth = 1;
    this.context.strokeStyle = this.axesColor;
    this.context.stroke();

  }

  drawFractal(): void {
    this.updateTabToDraw();
    this.initImageData();
    this.loadImageFromTab();
    this.context.imageSmoothingQuality = "high";
    this.context.putImageData(this.imageData, 0, 0);
  }

  setCalcFractalProgress(value: number): void {
    this.calcFractalProgress = value;
  }

  uptadeFractal(): void {
    console.log("update fractale");

    this.fractal.getSeed().setReal(this.real);
    this.fractal.getSeed().setImag(this.imag);
    this.fractal.setLimit(this.limit);
    this.fractal.setMaxIt(this.iterNb);
    this.updateDisplay();
  }

  changeFractal(): void {
    this.real = this.fractal.getSeed().getReal();
    this.imag = this.fractal.getSeed().getImag();
    this.limit = this.fractal.getLimit();
    this.iterNb = this.fractal.getMaxIt();
    this.updateDisplay();
  }
}
