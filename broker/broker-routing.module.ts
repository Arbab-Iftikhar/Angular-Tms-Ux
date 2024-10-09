import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';

const routes: Routes = [
  {
    path: 'brokerDashboard',
    component: BrokerDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerRoutingModule { }
