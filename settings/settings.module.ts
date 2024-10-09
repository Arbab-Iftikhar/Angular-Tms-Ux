import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DriverComponent } from './Driver/driver.component';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { CompanyComponent } from './Company/company/company.component';
import { ShipperComponent } from './Shipper/shipper/shipper.component';
import { UserListingComponent } from './User_Listing/user-listing/user-listing.component';
@NgModule({
  declarations: [DriverComponent,CompanyComponent,ShipperComponent,UserListingComponent],
  imports: [
    SettingsRoutingModule,
    SharedModule,
    TranslateModule
]
})
export class SettingsModule { }
