import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVideoLogComponent } from './component/add-video-log/add-video-log.component';
import { PreviousLogComponent } from './component/previous-log/previous-log.component';
import { NotFoundComponent } from './component/not-found/not-found.component';


const routes: Routes = [
  { path: "", redirectTo: "addLog", pathMatch: "full"},
  { path: "addLog", component: AddVideoLogComponent },
  { path: "previousLog", component: PreviousLogComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
