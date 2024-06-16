import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherCostComponent } from './other-cost.component';

const routes: Routes = [{ path: '', component: OtherCostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherCostRoutingModule { }
