import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from '../classes/color';
import { ComplexNb } from '../classes/complex-nb';
import { JuliaFractal } from '../classes/julia-fractal';
import { Pixel } from '../classes/pixel';
import { Point } from '../classes/point';
import { Scene } from '../classes/scene';
import { GraphicLibrary } from '../libraries/graphic-library';


/**
 * Classe du service qui gère le canvas
 */
@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  public imageData!: ImageData;
  //public data!: Uint8ClampedArray;
  public tabToDraw!: Color[][];

  public canvasWidth!: number;
  public canvasHeight!: number;

  public canvas!: ElementRef;
  //public canvasHtml = this.canvas.nativeElement as HTMLCanvasElement;

  public context!: CanvasRenderingContext2D;

  public backgroundColor: string = 'rgba(20,20,20,1.0)';
  public axesColor: string = 'rgba(255,255,255,0.38)';
  public originColor: string = 'rgba(255,255,255,0.62)';

  public currentScene!: Scene;
  public trans: Point = new Point(0, 0);;
  public angle!: number;
  public zoom!: number;

  public fractal!: JuliaFractal;
  public fractals!: Array<JuliaFractal>;
  public fractalsInit!: Array<JuliaFractal>;

  public real: number = 0;
  public imag: number = 0;
  public limit: number = 2;
  public iterNb: number = 100;

  public gradientStart: number = 3;
  public gradientEnd: number = 5;

  public isFractalDisplayed: boolean = true;
  public isAxesDisplayed: boolean = true;
  public isSettingsDisplayed: boolean = false;
  public isHelpDisplayed: boolean = false;
  public isSelectionDraw: boolean = false;
  //public isMouseIn: boolean = false; // TODO passer en Subject<boolean> ?

  public mouseDownPix: Pixel | null = null;
  public mouseUpPix: Pixel | null = null;

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

  /**
   * Méthode d'initialisation de la liste des fractales
   */
  initFractalList(): void {
    let length: number = 0;
    this.fractals = new Array<JuliaFractal>();
    this.fractalsInit = new Array<JuliaFractal>();

    length = this.fractals.push(new JuliaFractal(0, "Classique", new ComplexNb(true, -0.4, -0.59), 2, 150));
    length = this.fractals.push(new JuliaFractal(1, "Pas mal", new ComplexNb(true, 0.355534, -0.337292), 2, 1000));
    length = this.fractals.push(new JuliaFractal(2, "A voir", new ComplexNb(true, -0.4, -0.59), 2, 100));
    length = this.fractals.push(new JuliaFractal(3, "Jolie", new ComplexNb(true, -0.54, 0.54), 2, 100));
    length = this.fractals.push(new JuliaFractal(4, "A zoomer", new ComplexNb(true, 0.355, 0.355), 2, 100));
    length = this.fractals.push(new JuliaFractal(5, "Cool", new ComplexNb(true, -0.7, 0.27015), 2, 200));
    length = this.fractals.push(new JuliaFractal(6, "Ouech", new ComplexNb(true, 0.285, 0.01), 2, 75));
    length = this.fractals.push(new JuliaFractal(7, "Strange", new ComplexNb(true, -1.417022285618, 0.0099534), 2, 20));
    length = this.fractals.push(new JuliaFractal(8, "Si on veut", new ComplexNb(true, -0.038088, 0.9754633), 2, 20));
    length = this.fractals.push(new JuliaFractal(9, "Faut voir...", new ComplexNb(true, 0.285, 0.013), 2, 200));
    length = this.fractals.push(new JuliaFractal(10, "Arrg", new ComplexNb(true, -0.4, 0.6), 2, 100));
    length = this.fractals.push(new JuliaFractal(11, "Wow", new ComplexNb(true, -0.8, 0.156), 2, 150));
    length = this.fractals.push(new JuliaFractal(12, "Waouw", new ComplexNb(true, 0.0, 0.8), 2, 25));
    length = this.fractals.push(new JuliaFractal(13, "Hé bé", new ComplexNb(true, 0.3, 0.5), 2, 50));
    length = this.fractals.push(new JuliaFractal(14, "Voilà", new ComplexNb(true, -0.8, 0.0), 2, 200));
    //console.log('nombre de fractales dans la liste :', length);
    let i: number = 0;
    this.fractals.forEach(f => {
      i = this.fractalsInit.push(f.clone());
    });
    //console.log('nombre de fractales dans la liste init :', i);
  }

  /**
   * Méthode d'initialisation des données du service
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

  /**
   * Méthode d'initialisation du tableau qui sera affiché dans le canvas
   */
  private initTabToDraw(): void {
    this.tabToDraw = new Array(this.canvasWidth);
    for (let i = 0; i < this.canvasWidth; i++) {
      this.tabToDraw[i] = new Array(this.canvasHeight);
      for (let j = 0; j < this.canvasHeight; j++) {
        this.tabToDraw[i][j] = Color.createFromRgba(this.backgroundColor);
      }
    }
  }

  /**
   * Méthode d'initialisation de l'imageData du canvas
   */
  public initImageData(): void {
    this.imageData = this.context.createImageData(this.canvasWidth, this.canvasHeight);
    //this.data = this.imageData.data;
  }


  /**
   * Méthode qui calcule et renvoie le tableau des couleurs calculées selon la fractale
   * @returns promise tableau contenant les couleurs calculées des pixels du canvas
   */
  public async updateTabToDraw(): Promise<Color[][]> {
    const max = (this.canvasWidth * this.canvasHeight) - 1;
    let cpt = 0;
    let pix = new Pixel(0, 0);
    let tabToDraw: Color[][] = new Array(this.canvasWidth);
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
    setTimeout(() => {
      this.calcFractalProgressObs$.next(0);
    }, 500);

    return tabToDraw;

  }

  /**
   * Méthode qui copie les couleurs du tableau vers l'imageData.data du canvas
   */
  public loadImageFromTab(): void {
    for (let i = 0; i < this.canvasWidth; i++) {
      for (let j = 0; j < this.canvasHeight; j++) {
        /*
        let str = this.tabToDraw[i][j].substring(5);
        str = str.substring(0, str.length - 1);
        let tabVal = str.split(',');
        let red: number = parseInt(tabVal[0]);
        let green: number = parseInt(tabVal[1]);
        let blue: number = parseInt(tabVal[2]);
        let alpha: number = parseFloat(tabVal[3]);
        */
        let indice: number = (j * this.canvasWidth * 4) + (i * 4);
        this.imageData.data[indice] = this.tabToDraw[i][j].getRed();
        this.imageData.data[indice + 1] = this.tabToDraw[i][j].getGreen();
        this.imageData.data[indice + 2] = this.tabToDraw[i][j].getBlue();
        this.imageData.data[indice + 3] = this.tabToDraw[i][j].getAlpha();
      }
    }
    //this.imageData.data = this.data;
  }

  public centerOnPixel(center: Pixel): void {
    //console.log('appel centerOnPixel : center :', center.toString());
    let centerOriginPix = new Pixel(Math.round(center.getI() - (this.canvasWidth / 2)), Math.round(center.getJ() - (this.canvasHeight / 2)));
    let centerOriginPt: Point = GraphicLibrary.calcPointFromPix(centerOriginPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    //console.log('centerPt :', centerOriginPt.toString());

    let originPix: Pixel = new Pixel(0,0);
    let originPt: Point = GraphicLibrary.calcPointFromPix(originPix, this.currentScene, this.canvasWidth, this.canvasHeight);

    //console.log('originPt :', originPt.toString());


    let Tx: number = this.currentScene.getTrans().getX() + (centerOriginPt.getX() - originPt.getX());
    let Ty: number = this.currentScene.getTrans().getY() + (centerOriginPt.getY() - originPt.getY());
    //console.log('Tx :', Tx, 'Ty :', Ty);

    this.currentScene.getTrans().setX(Tx);
    this.currentScene.getTrans().setY(Ty);
    this.currentScene.updateMatrix();
    this.updateDisplay();

  }

  public zoomIn(start: Pixel, end: Pixel): void {
    //console.log('appel zoom in : start : ', start.toString(), ' : end :', end.toString());
    let startPt: Point = GraphicLibrary.calcPointFromPix(start, this.currentScene, this.canvasWidth, this.canvasHeight);
    //startPt = GraphicLibrary.transfInv(startPt, this.currentScene);

    let endPt: Point = GraphicLibrary.calcPointFromPix(end, this.currentScene, this.canvasWidth, this.canvasHeight);
    //endPt = GraphicLibrary.transfInv(endPt, this.currentScene);

    let deltaX: number = endPt.getX() - startPt.getX();
    let deltaY: number = endPt.getY() - startPt.getY();

    let newCenterPix: Pixel = new Pixel(Math.round((start.getI() + end.getI())/2), Math.round((start.getJ() + end.getJ())/2));
    //let max: number = Math.max(deltaX, deltaY);
    let newCenterPt: Point = GraphicLibrary.calcPointFromPix(newCenterPix, this.currentScene, this.canvasWidth, this.canvasHeight);

    let minPix: Pixel = new Pixel(0,0);
    let maxPix: Pixel = new Pixel(this.canvasWidth - 1, this.canvasHeight - 1);
    let minPt: Point = GraphicLibrary.calcPointFromPix(minPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let maxPt: Point = GraphicLibrary.calcPointFromPix(maxPix, this.currentScene, this.canvasWidth, this.canvasHeight);

    let startDeltaX: number = maxPt.getX() - minPt.getX();
    let startDeltaY: number = maxPt.getY() - minPt.getY();


    //console.log('deltas : deltaX :', deltaX, ' : deltaY :', deltaY);
    //console.log('max :', max);
    let zoom: number = 0.5;


    if (this.canvasWidth > this.canvasHeight) {
      // comparaison sur deltaY
      zoom = Math.abs(deltaX / startDeltaX);
    }
    else if (this.canvasWidth < this.canvasHeight) {
      // comparaison sur deltaX
      zoom = Math.abs(deltaY / startDeltaY);
    }
    else if (this.canvasWidth === this.canvasHeight) {
      zoom = Math.abs(deltaX / startDeltaX);
    }

    console.log('zoom :', zoom);

    let centerPix = new Pixel(Math.round(this.canvasWidth / 2) -1,Math.round(this.canvasHeight / 2) -1);
    let centerPt: Point = GraphicLibrary.calcPointFromPix(centerPix, this.currentScene, this.canvasWidth, this.canvasHeight);

    let pt = new Point(0,0);

    //this.currentScene.updateMatrix();
    // TODO centrer sur le pt et par sur le pixel
    let Tx = this.currentScene.getTrans().getX() + newCenterPt.getX() - centerPt.getX();
    let Ty = this.currentScene.getTrans().getY() + newCenterPt.getY() - centerPt.getY();



    //console.log('Tx :', Tx, 'Ty :', Ty);
    this.currentScene.setZoom(this.currentScene.getZoom() * zoom);
    this.currentScene.getTrans().setX(Tx);
    this.currentScene.getTrans().setY(Ty);
    this.currentScene.updateMatrix();

    this.zoom = this.currentScene.getZoom();
    //this.updateDisplay();
    //this.centerOnPixel(newCenterPix);
    this.updateDisplay();
  }

  /**
   * Méthode qui met à jour l'affichage du canvas
   */
  public updateDisplay(): void {
    //this.currentScene.updateMatrix();
    if (this.isFractalDisplayed) {
      this.drawFractal();
    }
    else {
      this.drawBlank();
    }
    //this.isFractalDisplayed ? await this.drawFractal() : this.drawBlank();


  }

  /**
   * Méthode qui affiche le canvas sans la fractale (canvas rempli par la couleur du background)
   */
  drawBlank(): void {
    //this.canvasService.updateTabToDraw();
    this.initImageData();
    this.initTabToDraw();
    this.loadImageFromTab();
    this.context.imageSmoothingQuality = "high";
    this.context.putImageData(this.imageData, 0, 0);
    if (this.isAxesDisplayed) this.drawAxes();
  }



  /**
   * Méthode qui affiche la fractale
   */
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

  /**
   * Méthode qui met à jour la fractale selon les valeurs choisies dans les réglages
   */
  uptadeFractal(): void {
    //console.log("update fractale");

    this.fractal.getSeed().setReal(this.real);
    this.fractal.getSeed().setImag(this.imag);
    this.fractal.setLimit(this.limit);
    this.fractal.setMaxIt(this.iterNb);
    this.updateDisplay();
  }

  /**
   * Méthode qui met à jour les valeurs bindées à partir de la fractale
   */
  changeFractal(): void {
    this.real = this.fractal.getSeed().getReal();
    this.imag = this.fractal.getSeed().getImag();
    this.limit = this.fractal.getLimit();
    this.iterNb = this.fractal.getMaxIt();
    this.updateDisplay();
  }

  public resetFractal(): void {
    //this.fractal
    //this.fractals = this.fractals.filter(f => f.getId() !== this.fractal.getId());
    let fractalInit = this.fractalsInit.filter(f => f.getId() === this.fractal.getId())[0].clone();
    this.fractal.setId(fractalInit.getId());
    this.fractal.setName(fractalInit.getName());
    this.fractal.getSeed().setReal(fractalInit.getSeed().getReal());
    this.fractal.getSeed().setImag(fractalInit.getSeed().getImag());
    this.fractal.setLimit(fractalInit.getLimit());
    this.fractal.setMaxIt(fractalInit.getMaxIt());
    //this.fractals.push(this.fractal);
    //console.log('this.fractal', this.fractal.toString());

    this.real = this.fractal.getSeed().getReal();
    this.imag = this.fractal.getSeed().getImag();
    this.limit = this.fractal.getLimit();
    this.iterNb = this.fractal.getMaxIt();


    this.gradientStart = 3;
    this.gradientEnd = 5;

    this.cd.detectChanges();
  }

  public resetSceneValues(): void {
    //console.log('debut reserSceneValues');

    this.angle = 0;
    this.zoom = 1;
    this.trans = new Point(0, 0);
    const deltaY = 2;
    const minY = -1;
    const deltaX = deltaY * this.canvasWidth / this.canvasHeight;
    const minX = -1 * deltaX / 2;

    this.currentScene.setMinX(minX);
    this.currentScene.setMinY(minY);
    this.currentScene.setRangeX(deltaX);
    this.currentScene.setRangeY(deltaY);
    this.currentScene.setTrans(this.trans);
    this.currentScene.setAngle(this.angle);
    this.currentScene.setZoom(this.zoom);

    this.currentScene.updateMatrix();
  }

  /**
   * Méthode qui dessine les axes
   */
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

  /**
   * Méthode qui dessine une ligne, dans le contexte context, de startPt à endPt, d'épaisseur strokeWeight,
   * de couleur de contour strokeColor
   * @param startPt
   * @param endPt
   * @param strokeWeight
   * @param strokeColor
   * @param context
   */
  drawLine(startPt: Point, endPt: Point, strokeWeight: number, strokeColor: string, context: CanvasRenderingContext2D): void {
    const startPix = GraphicLibrary.calcPixelFromPoint(startPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    const endPix = GraphicLibrary.calcPixelFromPoint(endPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    context.beginPath();
    context.moveTo(startPix.getI(), startPix.getJToDraw(this.canvasHeight));
    context.lineTo(endPix.getI(), endPix.getJToDraw(this.canvasHeight));
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWeight;
    context.stroke();
  }

  /**
   * Méthode qui dessine un cercle, dane les contexte context, ayant pour centre centerPt, de rayon radius, rempli ou non selon isFilled,
   * de couleur de contour strokeColor et de couleur de remplissage fillColor
   * @param centerPt
   * @param radius
   * @param isFilled
   * @param stokeWeight
   * @param strokeColor
   * @param fillColor
   * @param context
   */
  drawCircle(centerPt: Point, radius: number, isFilled: boolean, strokeWeight: number, strokeColor: string, fillColor: string, context: CanvasRenderingContext2D): void {
    const centerPix = GraphicLibrary.calcPixelFromPoint(centerPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    context.beginPath();
    context.arc(centerPix.getI(), centerPix.getJToDraw(this.canvasHeight), radius, 0, 2 * Math.PI, true);
    if (isFilled) {
      context.fillStyle = fillColor;
      context.fill();
    }
    context.lineWidth = strokeWeight;
    context.strokeStyle = strokeColor;
    this.context.stroke();
  }

  drawRect(startPt: Point, endPt: Point, isFilled: boolean, strokeWeight: number, strokeColor: string, fillColor: string, context: CanvasRenderingContext2D): void {
    const startPix = GraphicLibrary.calcPixelFromPoint(startPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    const endPix = GraphicLibrary.calcPixelFromPoint(endPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    if (isFilled) {
      context.fillStyle = fillColor;
      context.fillRect(startPix.getI(), startPix.getJ(), endPix.getI() - startPix.getI(), endPix.getJ() - startPix.getJ());
    }
    context.lineWidth = strokeWeight;
    context.strokeStyle = strokeColor;
    context.strokeRect(startPix.getI(), startPix.getJ(), endPix.getI() - startPix.getI(), endPix.getJ() - startPix.getJ());
  }
}
