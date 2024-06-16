import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndirectLabourCostComponent } from './indirect-labour-cost.component';

const routes: Routes = [{ path: '', component: IndirectLabourCostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndirectLabourCostRoutingModule { }
