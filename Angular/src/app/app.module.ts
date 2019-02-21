import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GameScreenComponent } from "./components/game-screen/game-screen.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';

@NgModule({
  declarations: [AppComponent, GameScreenComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, AngularMaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
