import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'finance',loadChildren:()=>import('./finance/finance.module').then(m=>m.FinanceModule)},
  { path: 'hr', loadChildren: () => import('./hr/hr.module').then(m => m.HRModule) },
  { path: 'it', loadChildren: () => import('./it/it.module').then(m => m.ITModule) },
  { path: 'operation', loadChildren: () => import('./operation/operation.module').then(m => m.operationModule) },
  { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule) },
  { path: 'technology', loadChildren: () => import('./technology/technology.module').then(m => m.TechnologyModule) },
  { path: '', redirectTo:'operation', pathMatch:'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiDashboardRoutingModule { }
