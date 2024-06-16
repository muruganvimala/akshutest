import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'forex', loadChildren: () => import('../finance/forex/forex.module').then(m => m.ForexModule) },
  { path: 'customerData', loadChildren: () => import('../finance/customer-data/customer-data.module').then(m => m.CustomerDataModule) },
  { path: 'directCost', loadChildren: () => import('../finance/direct-cost/direct-cost.module').then(m => m.DirectCostModule) },
  { path: 'indirectLabourCost', loadChildren: () => import('../finance/indirect-labour-cost/indirect-labour-cost.module').then(m => m.IndirectLabourCostModule) },
  { path: 'otherCost', loadChildren: () => import('../finance/other-cost/other-cost.module').then(m => m.OtherCostModule) },
  { path: '', redirectTo: 'forex', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
