import { Component, HostListener, OnInit } from '@angular/core';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { Load, Shipper } from '../../load/load-management/load-management.metadata';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessages } from '../../shared/utils/enums';

 interface Driver {
  driverId: number;
  cabCard: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
  driverName: string;
  driverContactNumber: string;
  driverLicenseNumber: string;
  driverUsername: string;
  driverEmail: string;
}
 interface Company {
  companyId: number;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyProvince: string;
  companyContactInfo: string;
  createdAt: string;
  updatedAt: string | null;
}


@Component({
  selector: 'app-detail-inquiry',
  templateUrl: './detail-inquiry.component.html',
  styleUrl: './detail-inquiry.component.scss'
})

export class DetailInquiryComponent  implements OnInit {
  isDropdownOpen = false;
  selectedFilter: string = '';
  shippers:  Shipper[] = [];
  shipperKeys: string[] = [];
  displayedKeys: string[] = []; 
  dataType: string = '';
  loadKeys: string[] = []; 
  loads: Load[] = [];
  driverKeys: string[] =[];
  drivers: Driver[] = [];
  companyKeys: string[] = [];
  companies: Company[] = [];
  FilterSelect: string = '';
  filters = [
    { label: 'Total Shippers', icon: 'bx-group', value: 'totalShippers' },
    { label: 'Today Loads', icon: 'bx-calendar', value: 'todayLoads' },
    { label: 'Total Drivers', icon: 'bx-group', value: 'totalDrivers' },
    { label: 'Total Companies', icon: 'bx-buildings', value: 'totalCompanies' }
  ];
 

  constructor(private httpURIService: HttpURIService,private notificationService: NotificationService,private translate: TranslateService){
  }
  
ngOnInit(): void {
  this.todayShipments();
}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  onDropdownItemClick(date: any): void {
    console.log(date)
   }
   filterSelect(filterValue: string): void {
    this.FilterSelect = filterValue;
  }
  todayShipments(){
    this.httpURIService.requestGET(URIKey.GET_SHIPMENTS_BY_LOADDATE).subscribe(
      (response) => {
        const loadResponse = response as Load[];
        if (loadResponse && loadResponse.length > 0) {
          this.loadKeys = Object.keys(loadResponse[0]);
          this.displayedKeys = this.loadKeys; 
          this.loads = loadResponse;
          this.dataType = 'todayLoads';
        } else {
          this.notificationService.error('No Loads found.')          
        }
      },
      (error) => {
        console.error('Error fetching loads:', error);
      }
    );
   }
   selectFilter(type: string) {
    this.dataType = type;

    if (type === 'totalShippers') {
      this.httpURIService.requestGET(URIKey.SHIPPER).subscribe(
        (response) => {
          const shipperResponse = response as Shipper[];
          if (shipperResponse && shipperResponse.length > 0) {
            this.shipperKeys = Object.keys(shipperResponse[0]);
            this.displayedKeys = this.shipperKeys; 
            this.shippers = shipperResponse;
            this.dataType = 'totalShippers';
          } else {
            this.notificationService.error('No shippers found.');
          }
        },
        (error) => {
          console.error('Error fetching shippers:', error);
        }
      );
      this.isDropdownOpen = false;
    } 
    else if (type === 'todayLoads') {
      this.todayShipments();
      this.isDropdownOpen = false;
    }
    else if (type === 'totalDrivers') {
      this.httpURIService.requestGET(URIKey.GET_ALL_DRIVERS).subscribe(
        (response) => {
          const driverResponse = response as Driver[]; // Assuming you have a Driver interface
          if (driverResponse && driverResponse.length > 0) {
            this.driverKeys = Object.keys(driverResponse[0]);
            this.displayedKeys = this.driverKeys; 
            this.drivers = driverResponse;
          } else {
            this.notificationService.error('No drivers found.');
          }
        },
        (error) => {
          console.error('Error fetching drivers:', error);
        }
      );
      this.isDropdownOpen = false;
    }
    else if (type === 'totalCompanies') {
      this.httpURIService.requestGET(URIKey.COMPANY).subscribe(
        (response) => {
          const companyResponse = response as Company[];
          if (companyResponse && companyResponse.length > 0) {
            this.companyKeys = Object.keys(companyResponse[0]);
            this.displayedKeys = this.companyKeys;
            this.companies = companyResponse;
          } else {
            this.notificationService.error('No companies found.');
          }
        },
        (error) => {
          console.error('Error fetching companies:', error);
        }
      );
      this.isDropdownOpen = false;
    }
    
      }
  getLoadValue(load: Load, key: string): any {
    return key in load ? load[key as keyof Load] : '';
  }
  getShipperValue(shipper: Shipper, key: string): any {
    return key in shipper ? shipper[key as keyof Shipper] : '';
  }
  getDriverValue(driver: Driver, key: string): any {
    return key in driver ? driver[key as keyof Driver] : '';
  }
  getCompanyValue(comapny: Company, key: string): any {
    return key in comapny ? comapny[key as keyof Company] : '';
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const isClickInsideDropdown = targetElement.closest('.dropdown');
    if (!isClickInsideDropdown) {
      this.isDropdownOpen = false;
    }
  }
}
