import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItoverviewComponent } from './itoverview.component';

const routes: Routes = [{ path: '', component: ItoverviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItoverviewRoutingModule { }
