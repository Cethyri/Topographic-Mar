import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TestCanvasComponent} from './components/test-canvas/test-canvas.component';
import { TestDbUiComponent } from './components/test-db-ui/test-db-ui.component';

const routes: Routes = [
  { path: 'canvas', component: TestCanvasComponent },
  { path: 'dbui', component: TestDbUiComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
