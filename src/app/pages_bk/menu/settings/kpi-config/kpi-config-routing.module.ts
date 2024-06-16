import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KpiConfigComponent } from './kpi-config.component';

const routes: Routes = [{ path: '', component: KpiConfigComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiConfigRoutingModule { }
