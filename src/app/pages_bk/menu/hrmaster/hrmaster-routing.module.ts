import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmasterComponent } from './hrmaster.component';

const routes: Routes = [{ path: '', component: HrmasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmasterRoutingModule { }
