import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Pixel } from 'src/app/classes/pixel';
import { CanvasService } from 'src/app/services/canvas.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {



  private resizeObservable$!: Observable<Event>;
  private resizeSubscription$!: Subscription;

  @ViewChild('canvas') public canvas!: ElementRef;

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
    this.canvasService.context = <CanvasRenderingContext2D>this.canvas.nativeElement.getContext('2d');
    this.updateCanvasDimensions();
    this.initCanvas();
  }

  capPixValues(pixel: Pixel): Pixel {
    if(pixel.getI() < 0) {pixel.setI(0)}
    else if(pixel.getI() > (this.canvasService.canvasWidth - 1)) {pixel.setI(this.canvasService.canvasWidth - 1)};
    if(pixel.getJ() < 0) {pixel.setJ(0)}
    else if(pixel.getJ() > (this.canvasService.canvasHeight - 1)) {pixel.setJ(this.canvasService.canvasHeight - 1)};
    return pixel;
  }

  onMouseDown(event: MouseEvent) {
    let x: number
    let y: number;

    if(document.scrollingElement !== null) {
      y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop + document.scrollingElement?.scrollTop);
      x = event.clientX - this.canvas.nativeElement.offsetLeft;
    }
    else {
      y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop);
      x = event.clientX - this.canvas.nativeElement.offsetLeft;
    }
    this.canvasService.mouseDownPix = new Pixel(x,y);
    this.canvasService.mouseDownPix = this.capPixValues(this.canvasService.mouseDownPix);

    // booleen dessin a vrai

    //console.log('Mouse down : x :', x, ' y :', y);

    //console.log(' mouse down pix :', this.canvasService.mouseDownPix?.toString());
  }



  onMouseUp(event: MouseEvent) {
//console.log('scrolling element top', document.scrollingElement?.scrollTop);
    let x: number
    let y: number;

    if(document.scrollingElement !== null) {
      y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop + document.scrollingElement?.scrollTop);
      x = event.clientX - this.canvas.nativeElement.offsetLeft;
    }
    else {
      y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop);
      x = event.clientX - this.canvas.nativeElement.offsetLeft;
    }
    //console.log('Mouse up : x :', x, ' y :', y);
    this.canvasService.mouseUpPix = new Pixel(x,y);
    this.canvasService.mouseUpPix = this.capPixValues(this.canvasService.mouseUpPix);
    if(this.canvasService.mouseDownPix !== null) this.canvasService.mouseUpPix = !this.canvasService.mouseUpPix.equals(this.canvasService.mouseDownPix) ? this.canvasService.mouseUpPix : null;
    //console.log(' mouse up pix :', this.canvasService.mouseUpPix?.toString());


    if(this.canvasService.mouseUpPix !== undefined && this.canvasService.mouseUpPix !== null
      && this.canvasService.mouseDownPix !== undefined && this.canvasService.mouseDownPix !== null
      && this.canvasService.mouseDownPix.calcDist(this.canvasService.mouseUpPix) > 10) {
        this.canvasService.zoomIn(this.canvasService.mouseUpPix, this.canvasService.mouseDownPix);
        this.canvasService.mouseDownPix = null;
        this.canvasService.mouseUpPix = null;

        // boolean dessin selection a faux
      }
      else {
        if(this.canvasService.mouseDownPix !== null) {
          this.canvasService.centerOnPixel(this.canvasService.mouseDownPix);
          this.canvasService.mouseDownPix = null;
          this.canvasService.mouseUpPix = null;
        }
      }
  }

  onMouseMove(event: MouseEvent) {
    //console.log('Mouse move : x :', event.clientX, ' y :', event.clientY);
    if(this.canvasService.mouseDownPix !== null) {
      let x: number
    let y: number;

    if(document.scrollingElement !== null) {
      y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop + document.scrollingElement?.scrollTop);
      x = event.clientX - this.canvas.nativeElement.offsetLeft;
    }
    else {
      y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop);
      x = event.clientX - this.canvas.nativeElement.offsetLeft;
    }
      this.canvasService.isSelectionDraw = true;
      this.canvasService.mouseOverPix = new Pixel(x, y);
      this.canvasService.drawSelection();
    }
    else {
      this.canvasService.isSelectionDraw = false;
    }
    //console.log('isSelectionDraw :', this.canvasService.isSelectionDraw);
  }

  /**
   * Méthode d'initialisation du canvas
   */
  initCanvas() {
    this.canvasService.initService();
    if (this.canvasService.context !== null) {
      //console.log('canvas width :', this.canvasService.canvasWidth, 'canvas heigth :', this.canvasService.canvasHeight);

      this.canvas.nativeElement.width = this.canvasService.canvasWidth;
      this.canvas.nativeElement.height = this.canvasService.canvasHeight;
      //console.log('canvas nat elem width :', this.canvas.nativeElement.width, 'canvas nat elem heigth :', this.canvas.nativeElement.height);
      this.canvasService.updateDisplay();
    }

  }

  /**
   * Méthode qui met à jour les dimensions du canvas à partir de celles de son parent
   */
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

}
