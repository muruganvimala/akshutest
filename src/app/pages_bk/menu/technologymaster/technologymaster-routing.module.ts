import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnologymasterComponent } from './technologymaster.component';

const routes: Routes = [{ path: '', component: TechnologymasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnologymasterRoutingModule { }
