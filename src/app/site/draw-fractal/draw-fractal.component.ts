import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-draw-fractal',
  templateUrl: './draw-fractal.component.html',
  styleUrls: ['./draw-fractal.component.scss']
})
export class DrawFractalComponent implements OnInit {

  public canvasWidth!: number;
  public canvasHeight!: number;

  constructor() { }

  ngOnInit(): void {
    //this.updateCanvasDimensions();
  }

  updateCanvasDimensions() {
    let element = document.getElementById('block-container');
    let width = element?.offsetWidth;
    let height = element?.offsetHeight;
    //console.log('width :', width, ' height :', height);
    if (width !== undefined) {
      this.canvasWidth = width - 80;
    }
    if (height !== undefined) {
      if (height - 80 > 600) {
        this.canvasHeight = height - 80;
      }
      else {
        this.canvasHeight = 600;
      }
    }
    //console.log('canvas width :', this.canvasWidth, ' canvas height :', this.canvasHeight);
    //console.log('ctx canvas width :', this.context.canvas.clientWidth, ' ctx canvas height :', this.context.canvas.clientHeight);

  }

}
