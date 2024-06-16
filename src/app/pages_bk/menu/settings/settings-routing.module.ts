import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  { path: 'kpiConfig', loadChildren: () => import('./kpi-config/kpi-config.module').then(m => m.KpiConfigModule) },
  { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'publisher', loadChildren: () => import('./publisher/publisher.module').then(m => m.PublisherModule) },
  { path: '', redirectTo:'kpiConfig', pathMatch:'full' }
 
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
 