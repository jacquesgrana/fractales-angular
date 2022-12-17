import { newArray } from '@angular/compiler/src/util';
import { ElementRef, Injectable } from '@angular/core';
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

  public backgroundColor: string = 'rgb(40,40,40)';
  public axesColor: string = 'rgba(230,230,230,62)';
  public originColor: string = 'rgba(240,240,240,62)';

  public currentScene!: Scene;
  public trans!: Point;
  public angle!: number;
  public zoom!: number;

  public fractal!: JuliaFractal;

  constructor() {
    this.fractal = new JuliaFractal(new ComplexNb(true, -0.4, -0.59), 2, 150);
   }

  public initService(): void {
    this.initTabToDraw();
    this.angle = 0;
    this.zoom = 1;
    this.trans = new Point(0,0);
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
    for(let i=0; i<this.canvasWidth; i++) {
      this.tabToDraw[i]= new Array(this.canvasHeight);
      for(let j=0; j<this.canvasHeight; j++) {
        this.tabToDraw[i][j]= this.backgroundColor;
      }
    }
  }

  public initImageData(): void {
    this.imageData = this.context.createImageData(this.canvasWidth, this.canvasHeight);
      //this.data = this.imageData.data;
  }


  public updateTabToDraw(): void {
    let pix = new Pixel(0, 0);
    for (let i=0; i<this.canvasWidth; i++) {
      for (let j=0; j<this.canvasHeight; j++) {
        pix.setI(i);
        pix.setJ(j);
        let pointM = GraphicLibrary.calcPointFromPix(pix, this.currentScene, this.canvasWidth, this.canvasHeight);
        let z = new ComplexNb(true, pointM.getX(), pointM.getY());
        let colorPt = this.fractal.calcColorFromJuliaFractal(z, 3, 2, this.backgroundColor);
        this.tabToDraw[i][j] = colorPt;
        //console.log('color : i :', i, ':', j, ':', colorPt);

      }
    }
  }

  public loadImageFromTab(): void {
    for (let i=0; i<this.canvasWidth; i++) {
      for (let j=0; j<this.canvasHeight; j++) {
        let str = this.tabToDraw[i][j].substring(4);
        str = str.substring(0, str.length-1);
        let tabVal = str.split(',');
        let red: number = parseInt(tabVal[0]);
        let green: number = parseInt(tabVal[1]);
        let blue: number = parseInt(tabVal[2]);

        let indice: number = (j * this.canvasWidth * 4) + (i * 4);
        this.imageData.data[indice] = red;
        this.imageData.data[indice+1] = green;
        this.imageData.data[indice+2] = blue;
        this.imageData.data[indice+3] = 255;
      }
    }
    //this.imageData.data = this.data;
  }


}
