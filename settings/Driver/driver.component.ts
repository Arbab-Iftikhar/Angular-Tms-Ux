import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpURIService } from '../../app.http.uri.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { URIKey } from '../../shared/utils/uri-enums';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessages, SuccessMessages } from '../../shared/utils/enums';
import bootstrap from '../../../main.server';
import { SharedFormService } from '../../shared/services/shared-form.service';
interface driverData {
  driverId: number;
  driverName: string;
  driverEmail: string;
  driverContactNumber: string;
  driverUsername: string;
  driverLicenseNumber: string;
}
@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent implements OnInit {

  driverForm: FormGroup;
  drivers: any;
  allDrivers:any;
  currentDriverId: number | null = null;
  editFunction:boolean | undefined;
  driverToDelete: number | null = null;
  showDeleteModal: boolean = false;
  contactFilter: string = '';
  countryCodes: { id: string, name: string }[] = [
    { id: '1', name: 'USA(+1)' },
    { id: '1', name: 'CAN(+1)' },
    { id: '967', name: 'DXB(+967)' },
    { id: '92', name: 'PAK(+92)' }
  ];
 
  constructor(
   private formBuilder: FormBuilder,private httpURIService: HttpURIService,private notificationService: NotificationService, private translate: TranslateService,
   public sharedFormService: SharedFormService) {
  
  
  
  this.driverForm = new FormGroup({
    driverName: new FormControl('', Validators.required),
    driverContactNumber: new FormControl('', Validators.required),
    driverEmail: new FormControl('', [Validators.required, Validators.email]),
    driverUsername: new FormControl('', Validators.required),
    driverLicenseNumber: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required)
  });
  
  
}

ngOnInit(): void {
  this.loadAlldrivers();
}
  
  onDriverSubmit() {
    let isVerified = false;
    let payload = {};
    payload = { ...this.driverForm.value,
       isVerified };
     if(this.editFunction!=true){
    this.httpURIService.requestPOST(URIKey.CREATE_DRIVER, payload).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.driverForm.reset();
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
        this.loadAlldrivers();
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));

      }
    })
  }
  else{
   
    let payload = { ...this.driverForm.value,
      driverId: this.currentDriverId };
      this.httpURIService.requestPATCH(URIKey.UPDATE_DRIVER, payload )
      .subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_UPDATED));
          this.loadAlldrivers();
        }else{
           this.notificationService.error(this.translate.instant(response.error.errorCode));

        }
      
      });
      this.editFunction = false;

  }
  }

  loadAlldrivers() {
    this.httpURIService.requestGET(URIKey.GET_ALL_DRIVERS).subscribe((response) => {
      this.allDrivers = response;
    });}

 deleteDriver(id: number) {
 
    const params = new HttpParams().set('id', id.toString());
     this.httpURIService.requestDELETE(URIKey.DELETE_DRIVER, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_DELETED));
        this.loadAlldrivers(); 
      }
        else{
          this.notificationService.error(this.translate.instant(ErrorMessages.RECORD_NOT_DELETED));
        }
     
    }) 

}
openDeleteModal(driverId: number) {
  this.driverToDelete = driverId;
  this.showDeleteModal = true; // Show modal
}

// Close modal
closeDeleteModal() {
  this.showDeleteModal = false;
  this.driverToDelete = null;
}
confirmDelete() {
  if (this.driverToDelete !== null) {
    this.deleteDriver(this.driverToDelete);
    this.closeDeleteModal(); 
  }
}


  resetForm() {
    this.driverForm.reset();
    this.editFunction = false;
    this.currentDriverId = null;
  }
  
  editDriver(driver:any,id: number){
    this.driverForm.patchValue(driver);
    this.editFunction=true;
    this.currentDriverId=id;
    return this.currentDriverId;

  }

  onAddressInput(event: Event, fieldType: string): void {
    this.sharedFormService.onAddressInput(event,fieldType);
  }

  selectSuggestion(suggestion: any, form: FormGroup, controlName: string) {
    form.get(controlName)?.setValue(suggestion.displayName);
    this.sharedFormService.suggestions = [];
    this.sharedFormService.activeDropdown = '';
    this.sharedFormService.suggestions = [];
  const lat = parseFloat(suggestion.lat);
  const lon = parseFloat(suggestion.lon);
    if(controlName==='address'){
      this.driverForm.get('city')?.setValue(suggestion.city);
      this.driverForm.get('province')?.setValue(suggestion.state);
      // this.loadManagementForm.get('pickUpLat')?.setValue(lat);
      // this.loadManagementForm.get('pickUpLang')?.setValue(lon);
      this.driverForm.get('pickUpLat')?.setValue(lat);
      this.driverForm.get('pickUpLang')?.setValue(lon);

    }
  }

}
