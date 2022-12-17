import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { MaterialModule } from 'src/app/material-module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ]
})
export class ErrorModule { }
