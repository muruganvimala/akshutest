import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'kpi', loadChildren: () => import('./kpi/kpi.module').then(m => m.KpiModule) },
  { path: 'performance', loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule) },
  { path: 'qms', loadChildren: () => import('./qms/qms.module').then(m => m.QmsModule) },
  { path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) },
  { path: 'line-area', loadChildren: () => import('./line-area/line-area.module').then(m => m.LineAreaModule) },
  { path: '', redirectTo:'kpi', pathMatch:'full' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
