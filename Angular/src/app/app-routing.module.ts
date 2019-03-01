import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MapCanvasComponent} from './components/map-canvas/map-canvas.component';
import { LoginComponent } from './components/login/login.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';

const routes: Routes = [
  { path: 'canvas', component: MapCanvasComponent },
  { path: 'dbui', component: LoginComponent },
  { path: 'upload', component: UploadImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }