import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadManagmentComponent } from './load-management/load-managment.component';
import { LoadBoardComponent } from './load-board/load-board.component';
import { LoadDetailsComponent } from './load-details/load-details.component';
import { ViewLoadComponent } from './view-load/view-load.component';
import { AssignLoadsComponent } from './assign-loads/assign-loads.component';

const routes: Routes = [
  {
    path: 'loadManagement',
    component: LoadManagmentComponent
  },
  {
    path: 'loadBoard',
    component: LoadBoardComponent
  },
  {
    path: 'loadDetails',
    component: LoadDetailsComponent
  },
  {
    path: 'enRouteLoads',
    component: ViewLoadComponent
  },
  {
    path: 'assignLoads',
    component: AssignLoadsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadRoutingModule { }