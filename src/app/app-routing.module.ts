import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { LayoutComponent } from './layouts/layout.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './account/login/login.component';

// import { AuthGuard } from './core/guards/auth.guard';
// import { LoginComponent } from './account/login/login.component';

const routes: Routes = [   
  { path: 'app', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)  },
  { path: 'account', component: AuthlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'pages',component: AuthlayoutComponent, loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule)},
  // { path: '', redirectTo:'auth', pathMatch:'full' },
  { path: 'pages/menu/operation/performance', loadChildren: () => import('./pages/menu/operation/performance/performance.module').then(m => m.PerformanceModule) },
  { path: 'pages/menu/operation/qms', loadChildren: () => import('./pages/menu/operation/qms/qms.module').then(m => m.QmsModule) },
  { path: 'pages/menu/finance', loadChildren: () => import('./pages/menu/finance/finance.module').then(m => m.FinanceModule) },
  { path: 'pages/menu/hrmaster', loadChildren: () => import('./pages/menu/hrmaster/hrmaster.module').then(m => m.HrmasterModule) },
  { path: 'pages/menu/technologymaster', loadChildren: () => import('./pages/menu/technologymaster/technologymaster.module').then(m => m.TechnologymasterModule) },
  { path: 'pages/menu/itoverview', loadChildren: () => import('./pages/menu/itoverview/itoverview.module').then(m => m.ItoverviewModule) },
  { path: 'pages/menu/sales', loadChildren: () => import('./pages/menu/sales/sales.module').then(m => m.SalesModule) },
  { path: 'pages/menu/finance/indirectLabourCost', loadChildren: () => import('./pages/menu/finance/indirect-labour-cost/indirect-labour-cost.module').then(m => m.IndirectLabourCostModule) },
  { path: 'pages/menu/finance/otherCost', loadChildren: () => import('./pages/menu/finance/other-cost/other-cost.module').then(m => m.OtherCostModule) },
  { path: 'pages/menu/finance/customerData', loadChildren: () => import('./pages/menu/finance/customer-data/customer-data.module').then(m => m.CustomerDataModule) },
  { path: 'pages/menu/finance/otherCost', loadChildren: () => import('./pages/menu/finance/other-cost/other-cost.module').then(m => m.OtherCostModule) },
  { path: 'pages/menu/operation/crm', loadChildren: () => import('./pages/menu/operation/crm/crm.module').then(m => m.CrmModule) },
  { path: 'pages/menu/bi-dashboard/Operation', loadChildren: () => import('./pages/menu/bi-dashboard/operation/operation.module').then(m => m.operationModule) },
  { path: 'pages/menu/bi-dashboard/Finance', loadChildren: () => import('./pages/menu/bi-dashboard/finance/finance.module').then(m => m.FinanceModule) },
  { path: 'pages/menu/bi-dashboard/IT', loadChildren: () => import('./pages/menu/bi-dashboard/it/it.module').then(m => m.ITModule) },
  { path: 'pages/menu/bi-dashboard/Technology', loadChildren: () => import('./pages/menu/bi-dashboard/technology/technology.module').then(m => m.TechnologyModule) },
  { path: 'pages/menu/bi-dashboard/HR', loadChildren: () => import('./pages/menu/bi-dashboard/hr/hr.module').then(m => m.HRModule) },
  { path: 'pages/menu/bi-dashboard/Sales', loadChildren: () => import('./pages/menu/bi-dashboard/sales/sales.module').then(m => m.SalesModule) },
  { path: '', redirectTo:'account', pathMatch:'full' },
  { path: 'pages/menu/bi-dashboard/finance', loadChildren: () => import('./pages/menu/bi-dashboard/finance/finance.module').then(m => m.FinanceModule) },
  { path: 'pages/menu/bi-dashboard/finance', loadChildren: () => import('./pages/menu/bi-dashboard/finance/finance.module').then(m => m.FinanceModule) },
 
  //{ path: '', component: AuthlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  //{ path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
