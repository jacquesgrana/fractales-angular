import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Matrix } from 'src/app/classes/matrix';
import { Pixel } from 'src/app/classes/pixel';
import { Point } from 'src/app/classes/point';
import { Scene } from 'src/app/classes/scene';
import { GraphicLibrary } from 'src/app/libraries/graphic-library';
import { MatrixLibrary } from 'src/app/libraries/matrix-library';
import { CanvasService } from 'src/app/services/canvas.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {



  private resizeObservable$!: Observable<Event>;
  private resizeSubscription$!: Subscription;

  @ViewChild('canvas') public canvas!: ElementRef;
  //public context!: CanvasRenderingContext2D;

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
    this.canvasService.canvas = this.canvas;
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.updateCanvasDimensions();
      this.initCanvas();
    })
  }

  ngAfterViewInit(): void {
    //this.nativeElement.canvas = <HTMLCanvasElement>document.getElementById('canvas');

    this.canvasService.context = <CanvasRenderingContext2D>this.canvas.nativeElement.getContext('2d');
    this.updateCanvasDimensions();
    this.initCanvas();

  }

  initCanvas() {
    this.canvasService.initService();
    if (this.canvasService.context !== null) {

      this.canvas.nativeElement.width = this.canvasService.canvasWidth;
      this.canvas.nativeElement.height = this.canvasService.canvasHeight;
      //console.log('canvas width : ', this.canvas.nativeElement.width, 'canvas height : ', this.canvas.nativeElement.height);

      this.canvasService.context.fillStyle = this.canvasService.backgroundColor;
      this.canvasService.context.fillRect(0, 0, this.canvasService.canvasWidth, this.canvasService.canvasHeight);

      //console.log('context non null');


      this.canvasService.currentScene.updateMatrix();

      this.drawFractal();
      //this.drawAxes();
      /*
            this.canvasService.imageData = this.canvasService.context.createImageData(this.canvasService.canvasWidth, this.canvasService.canvasHeight);
            this.canvasService.data = this.canvasService.imageData.data;

            for (let i = 0; i < this.canvasService.data.length; i += 4) {
              // Modify pixel data
              this.canvasService.data[i + 0] = (40 + i)%256;  // R value
              this.canvasService.data[i + 1] = (80 + 2*i)%256;    // G value
              this.canvasService.data[i + 2] = (120 + 3*i)%256;  // B value
              this.canvasService.data[i + 3] = 255;  // A value
            }
            this.canvasService.context.putImageData(this.canvasService.imageData, 0, 0);
      */

      //console.log('context ', this.context);
    }

  }

  drawAxes() {
    // TODO a finir
    let originPt = new Point(0.0, 0.0);
    let originPx = GraphicLibrary.calcPixelFromPoint(originPt, this.canvasService.currentScene, this.canvasService.canvasWidth, this.canvasService.canvasHeight);
    //this.canvasService.context.fillStyle = this.canvasService.originColor;
    //console.log("origine :", originPx.toString());
    //console.log("current scene :", this.canvasService.currentScene);
    //console.log("width pixel :", this.canvasService.canvasWidth);
    //console.log("height pixel :", this.canvasService.canvasHeight);


    //originPx.getI(), originPx.getJToDraw(sizeJZone), 20
    this.canvasService.context.beginPath();
    this.canvasService.context.arc(originPx.getI(), originPx.getJToDraw(this.canvasService.canvasHeight), 8, 0, 2 * Math.PI, false);
    //this.canvasService.context.fillStyle = this.canvasService.originColor;
    //this.canvasService.context.fill();
    this.canvasService.context.lineWidth = 1;
    this.canvasService.context.strokeStyle = this.canvasService.axesColor;
    this.canvasService.context.stroke();

    let startXAxe = new Point(this.canvasService.currentScene.getMinX(), 0);
    let endXAxe = new Point(this.canvasService.currentScene.getMinX() + this.canvasService.currentScene.getRangeX(), 0);
    let startXAxePix = GraphicLibrary.calcPixelFromPoint(startXAxe, this.canvasService.currentScene, this.canvasService.canvasWidth, this.canvasService.canvasHeight);
    let endXAxePix = GraphicLibrary.calcPixelFromPoint(endXAxe, this.canvasService.currentScene, this.canvasService.canvasWidth, this.canvasService.canvasHeight);

    this.canvasService.context.beginPath();
    this.canvasService.context.moveTo(startXAxePix.getI(), startXAxePix.getJToDraw(this.canvasService.canvasHeight));
    this.canvasService.context.lineTo(endXAxePix.getI(), endXAxePix.getJToDraw(this.canvasService.canvasHeight));
    this.canvasService.context.strokeStyle = this.canvasService.axesColor;
    this.canvasService.context.lineWidth = 1;
    this.canvasService.context.stroke();

    let startYAxe = new Point(0, this.canvasService.currentScene.getMinY());
    let endYAxe = new Point(0, this.canvasService.currentScene.getMinY() + this.canvasService.currentScene.getRangeY());
    let startYAxePix = GraphicLibrary.calcPixelFromPoint(startYAxe, this.canvasService.currentScene, this.canvasService.canvasWidth, this.canvasService.canvasHeight);
    let endYAxePix = GraphicLibrary.calcPixelFromPoint(endYAxe, this.canvasService.currentScene, this.canvasService.canvasWidth, this.canvasService.canvasHeight);

    this.canvasService.context.beginPath();
    this.canvasService.context.moveTo(startYAxePix.getI(), startYAxePix.getJToDraw(this.canvasService.canvasHeight));
    this.canvasService.context.lineTo(endYAxePix.getI(), endYAxePix.getJToDraw(this.canvasService.canvasHeight));
    this.canvasService.context.strokeStyle = this.canvasService.axesColor;
    this.canvasService.context.lineWidth = 1;
    this.canvasService.context.stroke();
  }

  drawFractal(): void {
    this.canvasService.updateTabToDraw();
    this.canvasService.initImageData();
    this.canvasService.loadImageFromTab();
    this.canvasService.context.putImageData(this.canvasService.imageData, 0, 0);
  }

  updateCanvasDimensions() {
    let element = document.getElementById('block-container');
    let width = element?.offsetWidth;
    let height = element?.offsetHeight;
    //console.log('width :', width, ' height :', height);
    if (width !== undefined) {
      this.canvasService.canvasWidth = width - 80;
    }
    if (height !== undefined) {
      this.canvasService.canvasHeight = 800;
    }
    //console.log('canvas width :', this.canvasService.canvasWidth, ' canvas height :', this.canvasService.canvasHeight);
    //console.log('ctx canvas width :', this.context.canvas.clientWidth, ' ctx canvas height :', this.context.canvas.clientHeight);

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    let Tx: number = 0;
    let Ty: number = 0;
    switch (event.key) {

      case 'ArrowLeft':
        console.log('touche gauche');
        Tx = this.canvasService.currentScene.getTrans().getX() + 0.05 * this.canvasService.currentScene.getRangeX();
        this.canvasService.currentScene.getTrans().setX(Tx);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 'ArrowRight':
        console.log('touche droit');
        Tx = this.canvasService.currentScene.getTrans().getX() - 0.05 * this.canvasService.currentScene.getRangeX();
        this.canvasService.currentScene.getTrans().setX(Tx);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 'ArrowUp':
        console.log('touche haut');
        Ty = this.canvasService.currentScene.getTrans().getY() - 0.05 * this.canvasService.currentScene.getRangeY();
        this.canvasService.currentScene.getTrans().setY(Ty);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 'ArrowDown':
        console.log('touche bas');
        Ty = this.canvasService.currentScene.getTrans().getY() + 0.05 * this.canvasService.currentScene.getRangeY();
        this.canvasService.currentScene.getTrans().setY(Ty);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 'a':
        console.log('touche a');
        this.canvasService.currentScene.setAngle(this.canvasService.currentScene.getAngle() + 5.0);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 'z':
        console.log('touche z');
        this.canvasService.currentScene.setAngle(this.canvasService.currentScene.getAngle() - 5.0);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 'q':
        console.log('touche q');
        this.canvasService.currentScene.setZoom(this.canvasService.currentScene.getZoom() * 0.95);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
      case 's':
        console.log('touche s');
        this.canvasService.currentScene.setZoom(this.canvasService.currentScene.getZoom() * 1.05);
        this.canvasService.currentScene.updateMatrix();
        this.drawFractal();
        //this.drawAxes();
        break;
    }
  }

}
