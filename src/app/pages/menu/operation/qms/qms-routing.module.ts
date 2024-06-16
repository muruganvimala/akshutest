import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QmsComponent } from './qms.component';

const routes: Routes = [
  { path: '', component: QmsComponent, children:[
    { path: 'data', loadChildren: () => import('./data/data.module').then(m => m.DataModule) }, 
    { path: 'feedback', loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule) },
    { path: '', redirectTo:'data', pathMatch:'full' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QmsRoutingModule { }
