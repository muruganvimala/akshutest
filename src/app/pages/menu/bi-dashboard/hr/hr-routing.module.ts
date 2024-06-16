import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HRComponent } from './hr.component';

const routes: Routes = [{ path: '', component: HRComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRRoutingModule { }
