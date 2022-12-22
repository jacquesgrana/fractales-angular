import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
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
