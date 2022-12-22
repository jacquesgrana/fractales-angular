import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { GraphicLibrary } from 'src/app/libraries/graphic-library';
import { CanvasService } from 'src/app/services/canvas.service';

@Component({
  selector: 'app-draw-fractal',
  templateUrl: './draw-fractal.component.html',
  styleUrls: ['./draw-fractal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawFractalComponent implements OnInit {

  public canvasWidth!: number;
  public canvasHeight!: number;

  @ViewChild('canvasStart', {static: false}) public canvasStart!: ElementRef;
  @ViewChild('canvasEnd', {static: false}) public canvasEnd!: ElementRef;
  @ViewChild('canvasResult', {static: false}) public canvasResult!: ElementRef;


  constructor(public canvasService: CanvasService, private cd: ChangeDetectorRef
    ) { //private cd: ChangeDetectorRef

  }

  ngOnInit(): void {
    //this.updateCanvasDimensions();
    this.canvasService.cd = this.cd;

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

  /*
  formatLabel(value: number): string {
    return `${value}`;
  }
  */

  toggleFractalDisplay(): void {
    this.canvasService.isFractalDisplayed = !this.canvasService.isFractalDisplayed;
    this.canvasService.updateDisplay();
  }

  toggleAxesDisplay(): void {
    this.canvasService.isAxesDisplayed = !this.canvasService.isAxesDisplayed;
    this.canvasService.updateDisplay();
  }

  toggleSettingsDisplay(): void {
    this.canvasService.isSettingsDisplayed = !this.canvasService.isSettingsDisplayed;
    if(this.canvasService.isSettingsDisplayed) {
      this.updateGradients();
    }
  }

  toggleHelpDisplay(): void {
    this.canvasService.isHelpDisplayed = !this.canvasService.isHelpDisplayed;
  }

  updateGradients(): void {
    this.updateStartGradient();
    this.updateEndGradient();
    this.updateResultGradient();
  }

  updateResultGradient(): void {
    this.drawGradientInCanvas(this.canvasResult, this.canvasService.gradientStart, this.canvasService.gradientEnd - this.canvasService.gradientStart);
  }

  updateStartGradient(): void {
   this.drawGradientInCanvas(this.canvasStart, 0, this.canvasService.gradientEnd - 1);
  }

  updateEndGradient(): void {
    this.drawGradientInCanvas(this.canvasEnd, this.canvasService.gradientStart + 1, 5 - this.canvasService.gradientStart);
  }

  drawGradientInCanvas(canvas: ElementRef, start: number, range: number): void {
    let contextCanvasResult = <CanvasRenderingContext2D>canvas.nativeElement.getContext('2d');
    let imageDataResult= contextCanvasResult.createImageData(340, 8);
    for (let i = 0; i < 340; i++) {
      for (let j = 0; j < 8; j++) {
        let color = GraphicLibrary.calculateRVB(i, 340, start, range);
        let indice: number = (j * 340 * 4) + (i * 4);
        imageDataResult.data[indice] = color.getRed();
        imageDataResult.data[indice + 1] = color.getGreen();
        imageDataResult.data[indice + 2] = color.getBlue();
        imageDataResult.data[indice + 3] = color.getAlpha();
      }
    }
    contextCanvasResult.imageSmoothingQuality = "high";
    contextCanvasResult.putImageData(imageDataResult, 0, 0);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    let Tx: number = 0;
    let Ty: number = 0;
    switch (event.key) {

      case 'ArrowLeft':
        //console.log('touche gauche');
        Tx = this.canvasService.currentScene.getTrans().getX() + 0.05 * this.canvasService.currentScene.getRangeX();
        this.canvasService.currentScene.getTrans().setX(Tx);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'ArrowRight':
        //console.log('touche droit');
        Tx = this.canvasService.currentScene.getTrans().getX() - 0.05 * this.canvasService.currentScene.getRangeX();
        this.canvasService.currentScene.getTrans().setX(Tx);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'ArrowUp':
        //console.log('touche haut');
        Ty = this.canvasService.currentScene.getTrans().getY() - 0.05 * this.canvasService.currentScene.getRangeY();
        this.canvasService.currentScene.getTrans().setY(Ty);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'ArrowDown':
        //console.log('touche bas');
        Ty = this.canvasService.currentScene.getTrans().getY() + 0.05 * this.canvasService.currentScene.getRangeY();
        this.canvasService.currentScene.getTrans().setY(Ty);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'a':
        //console.log('touche a');
        this.canvasService.currentScene.setAngle(this.canvasService.currentScene.getAngle() - 5.0);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'z':
        //console.log('touche z');
        this.canvasService.currentScene.setAngle(this.canvasService.currentScene.getAngle() + 5.0);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'q':
        //console.log('touche q');
        this.canvasService.currentScene.setZoom(this.canvasService.currentScene.getZoom() * 1.05);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 's':
        //console.log('touche s');
        this.canvasService.currentScene.setZoom(this.canvasService.currentScene.getZoom() * 0.95);
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'f':
        this.canvasService.isFractalDisplayed = !this.canvasService.isFractalDisplayed;
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'd':
        this.canvasService.isAxesDisplayed = !this.canvasService.isAxesDisplayed;
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
    }
  }

}
