import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { Subject } from 'rxjs';
import { Color } from '../classes/color';
import { ComplexNb } from '../classes/complex-nb';
import { JuliaFractal } from '../classes/julia-fractal';
import { Pixel } from '../classes/pixel';
import { Point } from '../classes/point';
import { Scene } from '../classes/scene';
import { GraphicLibrary } from '../libraries/graphic-library';
import { MathLibrary } from '../libraries/math-library';


const COLOR_FILL_SELECT: string = 'rgba(235, 125, 52, 0.38)';
const COLOR_STROKE_SELECT: string = 'rgba(235, 125, 52, 0.0)';
const COLOR_STROKE_ANGLE_INDICATOR: string = 'rgba(255,255,255,0.38)';//
const COLOR_FILL_ANGLE_INDICATOR_DOT: string = 'rgba(245, 34, 45, 1.0)';
const COLOR_FILL_ANGLE_INDICATOR: string = 'rgba(252, 141, 30, 0.62)';
const COLOR_BACKGROUND: string = 'rgba(20,20,20,1.0)';
const COLOR_STROKE_AXES: string = 'rgba(255,255,255,0.38)';
const COLOR_FILL_AXES: string = 'rgba(255,255,255,0.62)';

const DEFAULT_ZOOM_PERCENT_VALUE: number = 11.76;
const STEP_ZOOM_PERCENT_VALUE: number = 5.96;

const DEFAULT_GRADIENT_START: number = 3;
const DEFAULT_GRADIANT_END: number = 5;
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

  public context!: CanvasRenderingContext2D;

  //public backgroundColor: string = 'rgba(20,20,20,1.0)';
  //public axesColor: string = 'rgba(255,255,255,0.38)';
  //public originColor: string = 'rgba(255,255,255,0.62)';

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

  public gradientStart: number = DEFAULT_GRADIENT_START;
  public gradientEnd: number = DEFAULT_GRADIANT_END;

  public isFractalDisplayed: boolean = true;
  public isAxesDisplayed: boolean = true;
  public isSettingsDisplayed: boolean = false;
  public isSelectionDraw: boolean = false;
  //public isMouseIn: boolean = false; // TODO passer en Subject<boolean> ?

  public mouseDownPix: Pixel | null = null;
  public mouseUpPix: Pixel | null = null;
  public mouseOverPix: Pixel | null = null;

  public startPixTemp: Pixel | null = null;
  public dataTemp: ImageData | null = null;

  public calcFractalProgressObs$!: Subject<number>;
  public calcFractalProgress: number = 0;

  public zoomProgressObs$!: Subject<number>;
  public zoomProgress: number = 0;

  public calcTimeObs$!: Subject<number>;
  public calcTime: number = 0;

  public cd!: ChangeDetectorRef

  public worker = new Worker(new URL('./../workers/calculate.worker', import.meta.url));

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
    });
    this.calcFractalProgressObs$.next(0);

    this.zoomProgressObs$ = new Subject<number>();
    this.zoomProgressObs$.subscribe(v => {
      this.zoomProgress = v;
    });
    this.zoomProgressObs$.next(DEFAULT_ZOOM_PERCENT_VALUE);

    this.calcTimeObs$ = new Subject<number>();
    this.calcTimeObs$.subscribe(v => {
      this.calcTime = v;
    })
  }

  calculateZoomPercent(zoom: number): number {
    return DEFAULT_ZOOM_PERCENT_VALUE + STEP_ZOOM_PERCENT_VALUE * MathLibrary.logN(10, 1 / zoom);
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


  }

  /**
   * Méthode d'initialisation du tableau qui sera affiché dans le canvas
   */
  private initTabToDraw(): void {
    this.tabToDraw = new Array(this.canvasWidth);
    for (let i = 0; i < this.canvasWidth; i++) {
      this.tabToDraw[i] = new Array(this.canvasHeight);
      for (let j = 0; j < this.canvasHeight; j++) {
        this.tabToDraw[i][j] = Color.createFromRgba(COLOR_BACKGROUND);
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



    //this.cd.detectChanges();
    return new Promise<Color[][]>((resolve) => {
      let startTime: Date = new Date(Date.now());
      let endTime: Date;
      let tabToDraw: Color[][] = new Array(this.canvasHeight);;

      const max = (this.canvasWidth * this.canvasHeight) - 1;
      let cpt = 0;
      let pix = new Pixel(0, 0);
      //let tabToDraw: Color[][] = new Array(this.canvasWidth);
      for (let i = 0; i < this.canvasWidth; i++) {
        tabToDraw[i] = new Array(this.canvasHeight);
        for (let j = 0; j < this.canvasHeight; j++) {

          pix.setI(i);
          pix.setJ(j);
          let pointM = GraphicLibrary.calcPointFromPix(pix, this.currentScene, this.canvasWidth, this.canvasHeight);
          let z = new ComplexNb(true, pointM.getX(), pointM.getY());
          let colorPt = this.fractal.calcColorFromJuliaFractal(z, this.gradientStart, this.gradientEnd - this.gradientStart, COLOR_BACKGROUND);
          tabToDraw[pix.getI()][pix.getJToDraw(this.canvasHeight)] = colorPt;

          let jobPercent = Math.round(100 * cpt / max);
          //if (jobPercent % 25 === 0) {

          //}
          cpt++;
        }
      }

      this.calcFractalProgressObs$.next(100);
      endTime = new Date(Date.now());
      this.calcTimeObs$.next(endTime.getTime() - startTime.getTime());

      setTimeout(() => {
        this.calcFractalProgressObs$.next(0);
      }, 400);
      resolve(tabToDraw);
    });

  }

  /**
   * Méthode qui calcule et renvoie le tableau des couleurs calculées selon la fractale
   * en utilisant le web worker : this.worker
   * @returns promise tableau contenant les couleurs calculées des pixels du canvas
   */
  public async updateTabToDrawWithWorker(): Promise<Color[][]> {
    let startTime: Date = new Date(Date.now());
    let endTime: Date;
    //let tabToDraw: Color[][] = new Array(this.canvasWidth);


    return new Promise<Color[][]>((resolve) => {

      this.worker.onmessage = ({ data }) => {
        //console.log(`page got message: ${data}`);
        if (data.isJobDone === 'true') {
          this.calcFractalProgressObs$.next(data.jobPercent);
          endTime = new Date(Date.now());
          this.calcTimeObs$.next(endTime.getTime() - startTime.getTime());
          resolve(data.tabToDraw);
        }
        else if (data.isJobDone === 'false') {
          this.calcFractalProgressObs$.next(data.jobPercent);
        }
      };
      let dataToSend: any = {};
      dataToSend = {
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        currentScene: this.currentScene,
        gradientStart: this.gradientStart,
        gradientEnd: this.gradientEnd,
        fractal: this.fractal,
        COLOR_BACKGROUND: COLOR_BACKGROUND
      }
      this.worker.postMessage(dataToSend);
    });
  }

  /**
   * Méthode qui copie les couleurs du tableau vers l'imageData.data du canvas
   */
  public loadImageFromTab(): void {
    for (let i = 0; i < this.canvasWidth; i++) {
      for (let j = 0; j < this.canvasHeight; j++) {
        let indice: number = (j * this.canvasWidth * 4) + (i * 4);
        this.imageData.data[indice] = this.tabToDraw[i][j].red;
        this.imageData.data[indice + 1] = this.tabToDraw[i][j].green;
        this.imageData.data[indice + 2] = this.tabToDraw[i][j].blue;
        this.imageData.data[indice + 3] = this.tabToDraw[i][j].alpha;
      }
    }
    //this.imageData.data = this.data;
  }

  /**
   * Centre l'affichage sur le Pixel center : calcule et met à jour la translation de currentScene
   *
   * @param center Pixel sur lequel il faut centrer l'affichage
   */
  public centerOnPixel(center: Pixel): void {
    let centerOriginPix = new Pixel(Math.round(center.getI() - (this.canvasWidth / 2)), Math.round(center.getJ() - (this.canvasHeight / 2)));
    let centerOriginPt: Point = GraphicLibrary.calcPointFromPix(centerOriginPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let originPix: Pixel = new Pixel(0, 0);
    let originPt: Point = GraphicLibrary.calcPointFromPix(originPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let Tx: number = this.currentScene.getTrans().getX() + (centerOriginPt.getX() - originPt.getX());
    let Ty: number = this.currentScene.getTrans().getY() + (centerOriginPt.getY() - originPt.getY());
    this.currentScene.getTrans().setX(Tx);
    this.currentScene.getTrans().setY(Ty);
    this.currentScene.updateMatrix();
    this.updateDisplay();
  }

  /**
   * Zoome et centre l'affichage sur la zone définie par start et end : calcule et met à jour le zoom et la translation de currentScene
   * @param start Pixel de départ de la sélection
   * @param end Pixel de fin de la sélection
   */
  public zoomIn(start: Pixel, end: Pixel): void {
    let startPt: Point = GraphicLibrary.calcPointFromPix(start, this.currentScene, this.canvasWidth, this.canvasHeight);
    let endPt: Point = GraphicLibrary.calcPointFromPix(end, this.currentScene, this.canvasWidth, this.canvasHeight);
    let deltaX: number = endPt.getX() - startPt.getX();
    let deltaY: number = endPt.getY() - startPt.getY();
    let newCenterPix: Pixel = new Pixel(Math.round((start.getI() + end.getI()) / 2), Math.round((start.getJ() + end.getJ()) / 2));
    let newCenterPt: Point = GraphicLibrary.calcPointFromPix(newCenterPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let minPix: Pixel = new Pixel(0, 0);
    let maxPix: Pixel = new Pixel(this.canvasWidth - 1, this.canvasHeight - 1);
    let minPt: Point = GraphicLibrary.calcPointFromPix(minPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let maxPt: Point = GraphicLibrary.calcPointFromPix(maxPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let startDeltaX: number = maxPt.getX() - minPt.getX();
    let startDeltaY: number = maxPt.getY() - minPt.getY();

    let cos: number = Math.cos(MathLibrary.degreeToRad(this.currentScene.getAngle()));
    let sin: number = Math.sin(MathLibrary.degreeToRad(this.currentScene.getAngle()));

    let tempStartDeltaX: number = startDeltaX * cos + startDeltaY * sin;
    let tempStartDeltaY: number = -1 * startDeltaX * sin + startDeltaY * cos;
    startDeltaX = tempStartDeltaX;
    startDeltaY = tempStartDeltaY;

    let tempDeltaX: number = deltaX * cos + deltaY * sin;
    let tempDeltaY: number = -1 * deltaX * sin + deltaY * cos;
    deltaX = tempDeltaX;
    deltaY = tempDeltaY;

    let zoom: number = 1;
    if (this.canvasWidth > this.canvasHeight) {
      zoom = Math.abs(deltaY / startDeltaY);
    }
    else if (this.canvasWidth < this.canvasHeight) {
      zoom = Math.abs(deltaX / startDeltaX);
    }
    else if (this.canvasWidth === this.canvasHeight) {
      zoom = Math.abs(deltaX / startDeltaX);
    }
    let centerPix = new Pixel(Math.round(this.canvasWidth / 2) - 1, Math.round(this.canvasHeight / 2) - 1);
    let centerPt: Point = GraphicLibrary.calcPointFromPix(centerPix, this.currentScene, this.canvasWidth, this.canvasHeight);
    let Tx = this.currentScene.getTrans().getX() + newCenterPt.getX() - centerPt.getX();
    let Ty = this.currentScene.getTrans().getY() + newCenterPt.getY() - centerPt.getY();
    this.currentScene.setZoom(this.currentScene.getZoom() * zoom);
    this.currentScene.getTrans().setX(Tx);
    this.currentScene.getTrans().setY(Ty);
    this.currentScene.updateMatrix();
    this.zoom = this.currentScene.getZoom();
    this.zoomProgressObs$.next(this.calculateZoomPercent(this.zoom));
    this.updateDisplay();
  }

  calculateTrans(deltaX: number, deltaY: number): void {
    const cos: number = Math.cos(MathLibrary.degreeToRad(this.currentScene.getAngle()));
    const sin: number = Math.sin(MathLibrary.degreeToRad(this.currentScene.getAngle()));
    const dX: number = deltaX * cos - 1 * deltaY * sin;
    const dY: number = deltaX * sin + deltaY * cos;
    this.currentScene.getTrans().setX(this.currentScene.getTrans().getX() + dX);
    this.currentScene.getTrans().setY(this.currentScene.getTrans().getY() + dY);
    this.currentScene.updateMatrix();
  }

  /**
   * Méthode qui affiche la zone de sélection.
   * Pour éviter l'empilement, la méthode garde en réserve dans dataTemp la zone avant le dessin
   * et, dès le second affichage du rectangle de sélection, affiche dataTemp pour revenir à l'etat initial
   * avant d'afficher le nouveau rectangle de sélection
   */
  drawSelection(): void {
    if (this.mouseDownPix !== null && this.mouseOverPix !== null) {
      //console.log('appel draw selection');
      // si tempData !== null dessin de dataTemp avec les dimensions (startPixTemp et endPixTemp) putImageData(imageData, dx, dy)

      //let startPt: Point;
      let startPix = new Pixel(this.mouseDownPix.getI(), this.mouseDownPix.getJToDraw(this.canvasHeight));
      // = GraphicLibrary.calcPointFromPix(startPix, this.currentScene, this.canvasWidth, this.canvasHeight);
      let endPix = new Pixel(this.mouseOverPix.getI(), this.mouseOverPix.getJToDraw(this.canvasHeight));
      //let endPt = GraphicLibrary.calcPointFromPix(endPix, this.currentScene, this.canvasWidth, this.canvasHeight);

      const minPix = new Pixel(Math.min(startPix.getI(), endPix.getI()), Math.min(startPix.getJ(), endPix.getJ()));

      this.deleteSelection();
      // copie de l'ancien rectangle dans le tempData et des dimensions getImageData(sx, sy, sw, sh)
      this.startPixTemp = minPix;
      let deltaI = Math.abs(endPix.getI() - startPix.getI());
      let deltaJ = Math.abs(endPix.getJ() - startPix.getJ());
      if (deltaI > 0 && deltaJ > 0
        && this.startPixTemp.getI() + deltaI < this.canvasWidth
        && this.startPixTemp.getJ() + deltaJ < this.canvasHeight) {
        this.dataTemp = this.context.getImageData(this.startPixTemp.getI(), this.startPixTemp.getJ(), deltaI, deltaJ);
      }
      else {
        this.dataTemp = null;
      }

      this.drawRect(startPix, endPix, true, 1, COLOR_STROKE_SELECT, COLOR_FILL_SELECT, 1.0, this.context);
    }
  }

  deleteSelection(): void {
    if (this.dataTemp !== null && this.startPixTemp !== null
      && this.startPixTemp.getI() >= 0 && this.startPixTemp.getI() + this.dataTemp.width < this.canvasWidth
      && this.startPixTemp.getJ() >= 0 && this.startPixTemp.getJ() + this.dataTemp.height < this.canvasHeight
    ) {
      this.context.putImageData(this.dataTemp, this.startPixTemp.getI(), this.startPixTemp.getJ());
      this.dataTemp = null;
      this.startPixTemp = null;
    }
  }

  /**
   * Méthode qui met à jour l'affichage du canvas
   */
  public updateDisplay(): void {
    //this.currentScene.updateMatrix();
    if (this.isFractalDisplayed) {
      this.drawFractal();
      //if(this.isSelectionDraw) this.drawSelection();
    }
    else {
      this.drawBlank();
    }
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
   * Méthode qui affiche la fractale ******************************************************************************************************************************************************
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
        //this.calcFractalProgressObs$.next(0);
        if (this.isAxesDisplayed) this.drawAxes();
      }
    );
  }

  /**
   * Méthode qui met à jour la fractale selon les valeurs choisies dans les réglages
   */
  uptadeFractal(): void {
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

  /**
   * Réinitialise la fractale courante aux valeurs initiales et réinitialise les couleurs d'affichage
   */
  public resetFractal(): void {
    let fractalInit = this.fractalsInit.filter(f => f.getId() === this.fractal.getId())[0].clone();
    this.fractal.setId(fractalInit.getId());
    this.fractal.setName(fractalInit.getName());
    this.fractal.getSeed().setReal(fractalInit.getSeed().getReal());
    this.fractal.getSeed().setImag(fractalInit.getSeed().getImag());
    this.fractal.setLimit(fractalInit.getLimit());
    this.fractal.setMaxIt(fractalInit.getMaxIt());
    this.real = this.fractal.getSeed().getReal();
    this.imag = this.fractal.getSeed().getImag();
    this.limit = this.fractal.getLimit();
    this.iterNb = this.fractal.getMaxIt();
    this.gradientStart = DEFAULT_GRADIENT_START;
    this.gradientEnd = DEFAULT_GRADIANT_END;
  }

  /**
   * Réinitialise la scene courante aux valeurs initiales
   */
  public resetSceneValues(): void {
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
    this.zoomProgressObs$.next(this.calculateZoomPercent(this.zoom));
  }

  /**
   * Méthode qui dessine les axes et l'indicateur graphique de la rotation
   */
  drawAxes(): void {
    const originPt = new Point(0.0, 0.0);
    const originPx = GraphicLibrary.calcPixelFromPoint(originPt, this.currentScene, this.canvasWidth, this.canvasHeight);
    const vectorIPoint = new Point(1, 0);
    const vectorIPix = GraphicLibrary.calcPixelFromPoint(vectorIPoint, this.currentScene, this.canvasWidth, this.canvasHeight);
    const vectorIOppPoint = new Point(-1, 0);
    const vectorJPoint = new Point(0, 1);
    const vectorJOppPoint = new Point(0, -1);
    this.drawLine(vectorIPoint, vectorIOppPoint, 1, COLOR_STROKE_AXES, this.context);
    this.drawLine(vectorJPoint, vectorJOppPoint, 1, COLOR_STROKE_AXES, this.context);
    this.drawCircle(vectorIPoint, 4, true, 1, COLOR_STROKE_AXES, COLOR_FILL_AXES, this.context);
    this.drawCircle(vectorJPoint, 4, true, 1, COLOR_STROKE_AXES, COLOR_FILL_AXES, this.context);
    this.drawCircle(originPt, originPx.calcDist(vectorIPix), false, 1, COLOR_STROKE_AXES, COLOR_FILL_AXES, this.context);
    this.drawCircle(originPt, 8, false, 1, COLOR_STROKE_AXES, COLOR_FILL_AXES, this.context);
    this.drawRotIndicator();
  }

  drawRotIndicator(): void {
    const radius: number = 20;
    const gap: number = 20;
    const gapLittle: number = 5;
    const radiusLittle: number = 3;

    const center: Pixel = new Pixel(gap + radius, gap + radius);
    const angleRad: number = MathLibrary.degreeToRad(this.currentScene.getAngle());
    //console.log('angleRad :', angleRad);
    const isTrigoNotRot = angleRad < 0;
    //this.context.save();

    if (angleRad !== 0) {
      this.context.beginPath();
      this.context.moveTo(center.getI(), center.getJToDraw(this.canvasHeight));
      this.context.arc(center.getI(), center.getJToDraw(this.canvasHeight), radius, 0, angleRad, isTrigoNotRot);
      this.context.closePath();
      this.context.fillStyle = COLOR_FILL_ANGLE_INDICATOR;
      this.context.fill();
    }



    this.context.beginPath();
    //this.context.moveTo(center.getI(), center.getJToDraw(this.canvasHeight));
    this.context.arc(center.getI(), center.getJToDraw(this.canvasHeight), radius, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.strokeStyle = COLOR_STROKE_ANGLE_INDICATOR;
    this.context.stroke();


    //const centerLittle: Pixel = new Pixel(gap + radius, gap + radius + radius + gapLittle + radiusLittle);
    const radiusBig: number = radius + radiusLittle + gapLittle;

    const cos = Math.cos(MathLibrary.degreeToRad(this.currentScene.getAngle()));
    const sin = Math.sin(MathLibrary.degreeToRad(this.currentScene.getAngle()));
    const rotCenterLittle: Pixel = new Pixel(center.getI() + radiusBig * sin, center.getJ() + radiusBig * cos);

    this.context.beginPath();
    this.context.moveTo(rotCenterLittle.getI(), rotCenterLittle.getJToDraw(this.canvasHeight));
    this.context.arc(rotCenterLittle.getI(), rotCenterLittle.getJToDraw(this.canvasHeight), radiusLittle, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.fillStyle = COLOR_FILL_ANGLE_INDICATOR_DOT;
    this.context.fill();

    //this.context.restore();
  }

  drawCircleFromPix(center: Pixel, isFilled: boolean, radius: number, strokeWeight: number, strokeColor: string, fillColor: string, context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(center.getI(), center.getJToDraw(this.canvasHeight), radius, 0, 2 * Math.PI, true);
    context.closePath();
    if (isFilled) {
      context.fillStyle = fillColor;
      context.fill();
    }
    context.lineWidth = strokeWeight;
    context.strokeStyle = strokeColor;
    this.context.stroke();
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
    context.closePath();
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWeight;
    context.stroke();
  }

  /**
   * Méthode qui dessine un cercle, dans les contexte context, ayant pour centre centerPt, de rayon radius, rempli ou non selon isFilled,
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
    context.closePath();
    if (isFilled) {
      context.fillStyle = fillColor;
      context.fill();
    }
    context.lineWidth = strokeWeight;
    context.strokeStyle = strokeColor;
    this.context.stroke();
  }

  /**
   * Méthode qui dessine un rectangle, dans les contexte context, ayant pour extrémités startPix et endPix, rempli ou non selon isFilled,
   * de couleur de contour strokeColor, de couleur de remplissage fillColor et de paramètre alpha global globalAlpha.
   * @param startPix
   * @param endPix
   * @param isFilled
   * @param strokeWeight
   * @param strokeColor
   * @param fillColor
   * @param globalAlpha
   * @param context
   */
  drawRect(startPix: Pixel, endPix: Pixel, isFilled: boolean, strokeWeight: number, strokeColor: string, fillColor: string, globalAlpha: number, context: CanvasRenderingContext2D): void {
    context.save();
    context.globalAlpha = globalAlpha;
    if (isFilled) {
      context.fillStyle = fillColor;
      context.fillRect(startPix.getI(), startPix.getJ(), endPix.getI() - startPix.getI(), endPix.getJ() - startPix.getJ());
    }
    context.lineWidth = strokeWeight;
    context.strokeStyle = strokeColor;
    context.strokeRect(startPix.getI(), startPix.getJ(), endPix.getI() - startPix.getI(), endPix.getJ() - startPix.getJ());
    context.restore();
  }
}
