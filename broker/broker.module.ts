import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { BrokerRoutingModule } from './broker-routing.module';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  declarations: [BrokerDashboardComponent],
  imports: [
    BrokerRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class BrokerModule { }
