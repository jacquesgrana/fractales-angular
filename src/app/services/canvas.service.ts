import { newArray } from '@angular/compiler/src/util';
import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  public gradientStart: number = 3;
  //public gradientRange: number = 2;
  public gradientEnd: number = 5;

  public isFractalDisplayed: boolean = true;
  public isAxesDisplayed: boolean = true;
  public isSettingsDisplayed: boolean = false;
  public isHelpDisplayed: boolean = false;

  public calcFractalProgressObs$!: Subject<number>;
  public calcFractalProgress: number = 0;

  public cd!: ChangeDetectorRef

  constructor() {
    this.initFractalList();
    this.fractal = this.fractals[0];
    this.real = this.fractal.getSeed().getReal();
    this.imag = this.fractal.getSeed().getImag();
    this.limit = this.fractal.getLimit();
    this.iterNb = this.fractal.getMaxIt();

    this.calcFractalProgressObs$ = new Subject<number>();
    this.calcFractalProgressObs$.subscribe(v => {
      this.calcFractalProgress = v;
      //this.cd.detectChanges();
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
    //console.log('nombre de fractales dans la liste :', length);
  }

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
  public async updateTabToDraw(): Promise<string[][]> {
      const max = (this.canvasWidth * this.canvasHeight) - 1;
      //this.setCalcFractalProgress(0);
      //this.calcFractalProgressObs$.next(0);

      //this.cd.markForCheck();
      //this.cd.detectChanges();


      let cpt = 0;
      let pix = new Pixel(0, 0);
      let tabToDraw: string[][] = new Array(this.canvasWidth);
      for (let i = 0; i < this.canvasWidth; i++) {
        tabToDraw[i] = new Array(this.canvasHeight);
        for (let j = 0; j < this.canvasHeight; j++) {

          pix.setI(i);
          pix.setJ(j);
          let pointM = GraphicLibrary.calcPointFromPix(pix, this.currentScene, this.canvasWidth, this.canvasHeight);
          let z = new ComplexNb(true, pointM.getX(), pointM.getY());
          let colorPt = this.fractal.calcColorFromJuliaFractal(z, this.gradientStart, this.gradientEnd - this.gradientStart, this.backgroundColor);
          tabToDraw[pix.getI()][pix.getJToDraw(this.canvasHeight)] = colorPt;

          let jobPercent = Math.round(100 * cpt / max);
/*
          if(jobPercent%20 === 0) {
            //console.log('% : ', jobPercent);
            //this.calcFractalProgressObs$.next(jobPercent);
            setTimeout( () => {
              this.calcFractalProgressObs$.next(jobPercent);
             }, 0 );
            //this.cd.detectChanges();
            //this.cd.markForCheck();
          }
*/
          cpt++;
        }
      }
      this.calcFractalProgressObs$.next(100);
      setTimeout( () => {
        this.calcFractalProgressObs$.next(0);
       }, 500 );

      return tabToDraw;

  }

  public loadImageFromTab(): void {
    for (let i = 0; i < this.canvasWidth; i++) {
      for (let j = 0; j < this.canvasHeight; j++) {
        let str = this.tabToDraw[i][j].substring(5);
        str = str.substring(0, str.length - 1);
        let tabVal = str.split(',');
        let red: number = parseInt(tabVal[0]);
        let green: number = parseInt(tabVal[1]);
        let blue: number = parseInt(tabVal[2]);
        let alpha: number = parseFloat(tabVal[3]);

        let indice: number = (j * this.canvasWidth * 4) + (i * 4);
        this.imageData.data[indice] = red;
        this.imageData.data[indice + 1] = green;
        this.imageData.data[indice + 2] = blue;
        this.imageData.data[indice + 3] = Math.round(alpha*255);
      }
    }
    //this.imageData.data = this.data;
  }

  public updateDisplay(): void {
    //this.calcFractalProgressObs$.next(0);
    this.currentScene.updateMatrix();
    if(this.isFractalDisplayed) {
      this.drawFractal();
    }
    else {
      this.drawBlank();
    }
    //this.isFractalDisplayed ? await this.drawFractal() : this.drawBlank();


    }

  drawBlank(): void {
    //this.canvasService.updateTabToDraw();
    this.initImageData();
    this.initTabToDraw();
    this.loadImageFromTab();
    this.context.imageSmoothingQuality = "high";
    this.context.putImageData(this.imageData, 0, 0);
    if (this.isAxesDisplayed) this.drawAxes();
  }



  drawFractal(): void {
    this.initImageData();
    this.updateTabToDraw().then(
      data => {
        //console.log('travail fini : tabToDraw', this.tabToDraw);
        this.tabToDraw = data;
        this.loadImageFromTab();
        this.context.imageSmoothingQuality = "high";
        this.context.putImageData(this.imageData, 0, 0);
        if (this.isAxesDisplayed) this.drawAxes();
      }
    );

  }

  setCalcFractalProgress(value: number): void {
    this.calcFractalProgress = value;
  }

  uptadeFractal(): void {
    //console.log("update fractale");

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

  drawAxes() {
    const originPt = new Point(0.0, 0.0);
    const originPx = GraphicLibrary.calcPixelFromPoint(originPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    const vectorIPoint = new Point(1, 0);
    const vectorIPix = GraphicLibrary.calcPixelFromPoint(vectorIPoint, this.currentScene, this.canvasWidth, this.canvasHeight);
    const vectorIOppPoint = new Point(-1, 0);
    const vectorJPoint = new Point(0, 1);
    const vectorJOppPoint = new Point(0, -1);
    this.drawLine(vectorIPoint, vectorIOppPoint, 1, this.axesColor, this.context);
    this.drawLine(vectorJPoint, vectorJOppPoint, 1, this.axesColor, this.context);
    this.drawCircle(vectorIPoint, 4, true, 1, this.axesColor, this.originColor, this.context);
    this.drawCircle(vectorJPoint, 4, true, 1, this.axesColor, this.originColor, this.context);
    this.drawCircle(originPt, originPx.calcDist(vectorIPix), false, 1, this.axesColor, this.originColor, this.context);
    this.drawCircle(originPt, 8, false, 1, this.axesColor, this.originColor, this.context);
  }

  drawLine(startPt: Point, endPt: Point, stokeWeight: number, strokeColor: string, context: CanvasRenderingContext2D): void {
    const startPix = GraphicLibrary.calcPixelFromPoint(startPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    const endPix = GraphicLibrary.calcPixelFromPoint(endPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    context.beginPath();
    context.moveTo(startPix.getI(), startPix.getJToDraw(this.canvasHeight));
    context.lineTo(endPix.getI(), endPix.getJToDraw(this.canvasHeight));
    context.strokeStyle = strokeColor;
    context.lineWidth = stokeWeight;
    context.stroke();
  }

  drawCircle(centerPt: Point, radius: number, isFilled: boolean, stokeWeight: number, strokeColor: string, fillColor: string, context: CanvasRenderingContext2D): void {
    const centerPix = GraphicLibrary.calcPixelFromPoint(centerPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    context.beginPath();
    context.arc(centerPix.getI(), centerPix.getJToDraw(this.canvasHeight), radius, 0, 2 * Math.PI, true);
    if(isFilled) {
      context.fillStyle = fillColor;
      context.fill();
    }
    context.lineWidth = stokeWeight;
    context.strokeStyle = strokeColor;
    this.context.stroke();

  }
}
