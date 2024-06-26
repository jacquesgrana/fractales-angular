import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawFractalComponent } from './draw-fractal.component';
import { MaterialModule } from 'src/app/material-module';
import { RouterModule } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';


@NgModule({
  declarations: [
    DrawFractalComponent,
    CanvasComponent,
    HelpDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule,
    BrowserAnimationsModule
  ],
  exports: [
    CanvasComponent
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'fr'
   }]
})
export class DrawFractalModule { }
