import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverComponent } from './Driver/driver.component';
import { CompanyComponent } from './Company/company/company.component';
import { ShipperComponent } from './Shipper/shipper/shipper.component';
import { UserListingComponent } from './User_Listing/user-listing/user-listing.component';

const routes: Routes = [
  {
    path: 'driver',
    component: DriverComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'shipper',
    component: ShipperComponent
  },
  {
    path: 'userListing',
    component: UserListingComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }