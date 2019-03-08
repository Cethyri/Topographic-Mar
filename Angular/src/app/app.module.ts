import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';

import { NavComponent } from './components/nav/nav.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { SingleMapComponent } from './components/single-map/single-map.component';
import { MapCanvasComponent } from './components/map-canvas/map-canvas.component';
import { LoginComponent } from './components/login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component'

@NgModule({
  declarations: [AppComponent, NavComponent, GalleryComponent, SingleMapComponent, MapCanvasComponent, LoginComponent, UploadImageComponent, ImageViewerComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, AngularMaterialModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
