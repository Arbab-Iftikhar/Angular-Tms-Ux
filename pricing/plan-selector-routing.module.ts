import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanSelectorComponent } from './plan-selector/plan-selector.component';

const routes: Routes = [
  {
    path: 'plan',
    component: PlanSelectorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanSelectorRoutingModule { }