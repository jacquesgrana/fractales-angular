import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { GraphicLibrary } from 'src/app/libraries/graphic-library';
import { CanvasService } from 'src/app/services/canvas.service';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { registerLocaleData } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
//import { NgTemplateOutlet } from '@angular/common';

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@Component({
  selector: 'app-draw-fractal',
  templateUrl: './draw-fractal.component.html',
  styleUrls: ['./draw-fractal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawFractalComponent implements OnInit {

  public canvasWidth!: number;
  public canvasHeight!: number;
  public puceChar: string = "&#x2022;";
  public spaceChar: string = "&nbsp;";

  @ViewChild('canvasStart', {static: false}) public canvasStart!: ElementRef;
  @ViewChild('canvasEnd', {static: false}) public canvasEnd!: ElementRef;
  @ViewChild('canvasResult', {static: false}) public canvasResult!: ElementRef;


  constructor(
    public canvasService: CanvasService,
    //private cd: ChangeDetectorRef,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    //this.canvasService.cd = this.cd;
    //const progressBar = document.getElementById('progress-bar-calc');
  }

  /**
   * ouvre la modale d'aide
   */
  openHelpDialog(): void {
    const dialogRef = this.dialog.open(HelpDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Réinitialisation de la currensScene: Scene
   */
  resetSceneValues(): void {
    this.canvasService.resetSceneValues();
    this.canvasService.updateDisplay();
  }

  /**
   * Réinitialisation de la fractale: JuliaFractale
   */
  resetFractal(): void {
    this.canvasService.resetFractal();
    this.canvasService.updateDisplay();
  }

  /**
   * Affiche/masque la fractale
   */
  toggleFractalDisplay(): void {
    this.canvasService.isFractalDisplayed = !this.canvasService.isFractalDisplayed;
    this.canvasService.updateDisplay();
  }

  /**
   * Affiche/masque les axes
   */
  toggleAxesDisplay(): void {
    this.canvasService.isAxesDisplayed = !this.canvasService.isAxesDisplayed;
    this.canvasService.updateDisplay();
  }

  /**
   * Affiche/masque les réglages de la fractales
   */
  toggleSettingsDisplay(): void {
    this.canvasService.isSettingsDisplayed = !this.canvasService.isSettingsDisplayed;
    const button = document.getElementById('button-settings');
    if(this.canvasService.isSettingsDisplayed) {
      this.updateGradients();
      button?.classList.add('button-selected');
    }
    else {
      button?.classList.remove('button-selected');
    }
  }

  /**
   * Met à jour les trois dégradés des réglages de la fractale (canvas)
   */
  updateGradients(): void {
    this.updateStartGradient();
    this.updateEndGradient();
    this.updateResultGradient();
  }

  /**
   * Met à jour le canvas du résultat des choix des couleurs
   */
  updateResultGradient(): void {
    this.drawGradientInCanvas(this.canvasResult, this.canvasService.gradientStart, this.canvasService.gradientEnd - this.canvasService.gradientStart);
  }

  /**
   * Met à jour le canvas du choix du début du dégradé
   */
  updateStartGradient(): void {
   this.drawGradientInCanvas(this.canvasStart, 0, this.canvasService.gradientEnd - 1);
  }

  /**
   * Met à jour le canvas du choix de la fin du dégradé
   */
  updateEndGradient(): void {
    this.drawGradientInCanvas(this.canvasEnd, this.canvasService.gradientStart + 1, 5 - this.canvasService.gradientStart);
  }

  /**
   * Dessine un dégradé dans le canvas depuis start sur range
   *
   * @param canvas
   * @param start
   * @param range
   */
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

  /**
   * Listener du clavier
   *
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    let Tx: number = 0;
    let Ty: number = 0;
    switch (event.key) {

      case 'ArrowLeft':
        //console.log('touche gauche');
        Tx = this.canvasService.currentScene.getTrans().getX() - 0.1 * this.canvasService.currentScene.getRangeX() * this.canvasService.currentScene.getZoom();

        this.canvasService.calculateTrans(- 0.1 * this.canvasService.currentScene.getRangeX() * this.canvasService.currentScene.getZoom(), 0);
        //this.canvasService.currentScene.getTrans().setX(Tx);
        //this.canvasService.currentScene.updateMatrix();
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'ArrowRight':
        //console.log('touche droit');
        Tx = this.canvasService.currentScene.getTrans().getX() + 0.1 * this.canvasService.currentScene.getRangeX() * this.canvasService.currentScene.getZoom();
        this.canvasService.calculateTrans(0.1 * this.canvasService.currentScene.getRangeX() * this.canvasService.currentScene.getZoom(), 0);
        //this.canvasService.currentScene.getTrans().setX(Tx);
        //this.canvasService.currentScene.updateMatrix();
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'ArrowUp':
        //console.log('touche haut');
        Ty = this.canvasService.currentScene.getTrans().getY() - 0.1 * this.canvasService.currentScene.getRangeY() * this.canvasService.currentScene.getZoom();
        this.canvasService.calculateTrans(0, - 0.1 * this.canvasService.currentScene.getRangeY() * this.canvasService.currentScene.getZoom());
        //this.canvasService.currentScene.getTrans().setY(Ty);
        //this.canvasService.currentScene.updateMatrix();
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'ArrowDown':
        //console.log('touche bas');
        Ty = this.canvasService.currentScene.getTrans().getY() + 0.1 * this.canvasService.currentScene.getRangeY() * this.canvasService.currentScene.getZoom();
        this.canvasService.calculateTrans(0, 0.1 * this.canvasService.currentScene.getRangeY() * this.canvasService.currentScene.getZoom());
        //this.canvasService.currentScene.getTrans().setY(Ty);
        //this.canvasService.currentScene.updateMatrix();
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'a':
        //console.log('touche a');
        this.canvasService.currentScene.setAngle((this.canvasService.currentScene.getAngle() - 5.0) % 360);
        this.canvasService.currentScene.updateMatrix();
        this.canvasService.angle = this.canvasService.currentScene.getAngle();
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'z':
        //console.log('touche z');
        this.canvasService.currentScene.setAngle((this.canvasService.currentScene.getAngle() + 5.0) % 360);
        this.canvasService.currentScene.updateMatrix();
        this.canvasService.angle = this.canvasService.currentScene.getAngle();
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 'q':
        //console.log('touche q');
        this.canvasService.currentScene.setZoom(this.canvasService.currentScene.getZoom() * 1.05);
        this.canvasService.currentScene.updateMatrix();
        this.canvasService.zoom = this.canvasService.currentScene.getZoom();
        this.canvasService.zoomProgressObs$.next(this.canvasService.calculateZoomPercent(this.canvasService.zoom));
        this.canvasService.updateDisplay();
        //this.cd.detectChanges();
        break;
      case 's':
        //console.log('touche s');
        this.canvasService.currentScene.setZoom(this.canvasService.currentScene.getZoom() * 0.95);
        this.canvasService.currentScene.updateMatrix();
        this.canvasService.zoom = this.canvasService.currentScene.getZoom();
        this.canvasService.zoomProgressObs$.next(this.canvasService.calculateZoomPercent(this.canvasService.zoom));
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
