import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiDashboardComponent } from './bi-dashboard.component';

const routes: Routes = [{ path: '', component: BiDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiDashboardRoutingModule { }
