import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawFractalComponent } from './site/draw-fractal/draw-fractal.component';
import { ErrorComponent } from './site/error/error.component';
import { StartComponent } from './site/start/start.component';

const routes: Routes = [
  {
    path: '',
    redirectTo:'\start',
    pathMatch:"full"
  },
  {
    path: 'start',
    component: StartComponent
  },
  {
    path: 'draw',
    component: DrawFractalComponent
  },
  {
    path: '**',
    component: ErrorComponent,
    data: {errorType: '404', errorComment: 'Cette page n\'existe pas !'}
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
