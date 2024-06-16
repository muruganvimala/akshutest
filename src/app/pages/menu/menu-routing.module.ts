import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: 'bidashboard', loadChildren: () => import('./bi-dashboard/bi-dashboard.module').then(m => m.BiDashboardModule) },
  { path: 'bidashboardold', loadChildren: () => import('./bi-dashboard-old/bi-dashboard.module').then(m => m.BiDashboardModule) },
  { path: 'finance', loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule) },  
  { path: 'operation',loadChildren:() => import('./operation/operation.module').then(m=>m.OperationModule) },
  { path: 'technologymaster', loadChildren: () => import('./technologymaster/technologymaster.module').then(m => m.TechnologymasterModule) },
  { path: 'itoverview', loadChildren: () => import('./itoverview/itoverview.module').then(m => m.ItoverviewModule) },
  { path: 'hrmaster', loadChildren: () => import('./hrmaster/hrmaster.module').then(m => m.HrmasterModule) },
 { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule) },
  { path: 'settings',loadChildren:() => import('./settings/settings.module').then(m=>m.SettingsModule) },
  { path: '', redirectTo:'bidashboard/operation', pathMatch:'full' }  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
