import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawFractalComponent } from './draw-fractal.component';
import { MaterialModule } from 'src/app/material-module';
import { RouterModule } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  declarations: [
    DrawFractalComponent,
    CanvasComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    CanvasComponent
  ]
})
export class DrawFractalModule { }
