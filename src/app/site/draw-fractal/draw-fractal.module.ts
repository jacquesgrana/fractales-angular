import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawFractalComponent } from './draw-fractal.component';
import { MaterialModule } from 'src/app/material-module';
import { RouterModule } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    DrawFractalComponent,
    CanvasComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    CanvasComponent
  ]
})
export class DrawFractalModule { }
