import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QmsComponent } from './qms.component';

const routes: Routes = [{ path: '', component: QmsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QmsRoutingModule { }
