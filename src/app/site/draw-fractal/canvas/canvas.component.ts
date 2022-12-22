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

  /*
// TODO améliorer : GAP_X = 40, GAP_Y = 40
  @HostListener('mousemove', ['$event'])
  handleMousemove(event: { clientX: any; clientY: any; }) {
    //console.log(`x: ${event.clientX - 40}, y: ${this.canvasService.canvasHeight - (event.clientY - 40)}`);
  }

  @HostListener('click', ['$event'])
  handleMouseclick(event: { clientX: any; clientY: any; }) {
    //console.log('left ', this.canvas.nativeElement.offsetLeft);
    //console.log('top ', this.canvas.nativeElement.offsetTop);

    let x = event.clientX - this.canvas.nativeElement.offsetLeft;
    let y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop + 54);
    //console.log(`x: ${x}, y: ${y}`);
    this.canvasService.centerOnPixel(new Pixel(x, y));
  }*/

  onMouseDown(event: MouseEvent) {
    let x = event.clientX - this.canvas.nativeElement.offsetLeft;
    let y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop);
    this.canvasService.mouseDownPix = new Pixel(x,y);

    // booleen dessin a vrai

    //console.log('Mouse down : x :', x, ' y :', y);

    console.log(' mouse down pix :', this.canvasService.mouseDownPix?.toString());
  }

  onMouseUp(event: MouseEvent) {
    let x = event.clientX - this.canvas.nativeElement.offsetLeft;
    let y = this.canvasService.canvasHeight - (event.clientY - this.canvas.nativeElement.offsetTop);
    //console.log('Mouse up : x :', x, ' y :', y);
    this.canvasService.mouseUpPix = new Pixel(x,y);
    if(this.canvasService.mouseDownPix !== null) this.canvasService.mouseUpPix = !this.canvasService.mouseUpPix.equals(this.canvasService.mouseDownPix) ? this.canvasService.mouseUpPix : null;
    console.log(' mouse up pix :', this.canvasService.mouseUpPix?.toString());


    if(this.canvasService.mouseUpPix !== undefined && this.canvasService.mouseUpPix !== null
      && this.canvasService.mouseDownPix !== undefined && this.canvasService.mouseDownPix !== null) {
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
    if(this.canvasService.mouseDownPix !== null && this.canvasService.mouseUpPix !== null) {
      this.canvasService.isSelectionDraw = true;
    }
    else {
      this.canvasService.isSelectionDraw = false;
    }
  }

  /**
   * Méthode d'initialisation du canvas
   */
  initCanvas() {
    this.canvasService.initService();
    if (this.canvasService.context !== null) {
      this.canvas.nativeElement.width = this.canvasService.canvasWidth;
      this.canvas.nativeElement.height = this.canvasService.canvasHeight;
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
