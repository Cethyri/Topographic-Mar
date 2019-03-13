import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MapCanvasComponent} from './components/map-canvas/map-canvas.component';
import { LoginComponent } from './components/login/login.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'canvas', component: MapCanvasComponent },
  { path: 'join', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'storage', component: UploadImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }