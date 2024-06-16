import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectCostComponent } from './direct-cost.component';

const routes: Routes = [{ path: '', component: DirectCostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectCostRoutingModule { }
