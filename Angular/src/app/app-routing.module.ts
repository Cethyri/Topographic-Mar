import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TestCanvasComponent} from './components/test-canvas/test-canvas.component';
import { TestDbUiComponent } from './components/test-db-ui/test-db-ui.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';

const routes: Routes = [
  { path: 'canvas', component: TestCanvasComponent },
  { path: 'dbui', component: TestDbUiComponent },
  { path: 'upload', component: UploadImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }