import { NgModule } from '@angular/core';
import { LoadManagmentComponent } from './load-management/load-managment.component';
import { SharedModule } from '../shared/shared.module';
import { LoadRoutingModule } from './load-routing.module';
import { LoadBoardComponent } from './load-board/load-board.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadDetailsComponent } from './load-details/load-details.component';
import { ViewLoadComponent } from './view-load/view-load.component';
import { AssignLoadsComponent } from './assign-loads/assign-loads.component';
import { SortLoadsPipe } from './sort-loads.pipe';
@NgModule({
  declarations: [LoadManagmentComponent,
    LoadBoardComponent,
    LoadDetailsComponent,
    ViewLoadComponent,
    AssignLoadsComponent,
    SortLoadsPipe],
  imports: [
    LoadRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class LoadModule { }
