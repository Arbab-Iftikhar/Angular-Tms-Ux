import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    AdminRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class AdminModule { }
