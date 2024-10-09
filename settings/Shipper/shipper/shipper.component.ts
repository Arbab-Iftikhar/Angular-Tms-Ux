import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpURIService } from '../../../app.http.uri.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { URIKey } from '../../../shared/utils/uri-enums';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorMessages, SuccessMessages } from '../../../shared/utils/enums';
import { SharedFormService } from '../../../shared/services/shared-form.service';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrl: './shipper.component.scss'
})
export class ShipperComponent implements OnInit  {
  loadManagementForm: FormGroup | undefined;
  allShippers:any;
  shipperForm:FormGroup;
  editFunction:boolean | undefined;
  currentShipperId: number | null = null;
  shipperToDelete: number | null = null;
  showDeleteModal: boolean = false;
  contactFilter: string = '';
  constructor(public sharedFormService: SharedFormService,private httpURIService: HttpURIService,private notificationService: NotificationService, private translate: TranslateService) {
    this.shipperForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required),
      contactInfo: new FormControl('', Validators.required),
      pickUpLang:  new FormControl(0),
      pickUpLat :  new FormControl(0),
    });
    sharedFormService.activeDropdown='';
  }
   

  ngOnInit(): void {
    this.loadAllShippers();
   }
   loadAllShippers() {
    this.httpURIService.requestGET(URIKey.SHIPPER).subscribe((response) => {
      this.allShippers = response;
    });}
    onShipperSubmit() {
      if(this.editFunction!=true){
      this.httpURIService.requestPOST(URIKey.CREATE_SHIPPER, this.shipperForm.value).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
        this.ClearShipperForm();
        this.loadAllShippers();
        
        }else{
          this.notificationService.error(this.translate.instant(response.error.errorCode));
        }
      })
    }
    else{
      let payload = { ...this.shipperForm.value, shipperId: this.currentShipperId };
      this.httpURIService.requestPATCH(URIKey.UPDATE_SHIPPER, payload )
      .subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_UPDATED));
          this.ClearShipperForm();
          this.loadAllShippers();
        }else{
          this.notificationService.error(this.translate.instant(response.error.errorCode));
        }      
      });
      this.editFunction = false;
    }
    }
    ClearShipperForm() {
      this.shipperForm.reset();
    }

    deleteShipper(id: number) {
      const params = new HttpParams().set('id', id.toString());
       this.httpURIService.requestDELETE(URIKey.DELETE_SHIPPER, params).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_DELETED));
          this.loadAllShippers();
        } 

          else{
            this.notificationService.error(this.translate.instant(ErrorMessages.RECORD_NOT_DELETED));
          }
      }) 
     
    }

    editShipper(shipper:any,id: number){
      this.shipperForm.patchValue(shipper);
      this.editFunction=true;
      this.currentShipperId=id;
      return this.currentShipperId;
    
    }
    selectSuggestion(suggestion: any, form: FormGroup, controlName: string) {
      form.get(controlName)?.setValue(suggestion.displayName);
      this.sharedFormService.suggestions = [];
      this.sharedFormService.activeDropdown = '';
      this.sharedFormService.suggestions = [];
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
      if(controlName==='address'){
        this.shipperForm.get('city')?.setValue(suggestion.city);
        this.shipperForm.get('province')?.setValue(suggestion.state);
        // this.loadManagementForm.get('pickUpLat')?.setValue(lat);
        // this.loadManagementForm.get('pickUpLang')?.setValue(lon);
        this.shipperForm.get('pickUpLat')?.setValue(lat);
        this.shipperForm.get('pickUpLang')?.setValue(lon);

      }
    }
  
    onAddressInput(event: Event, fieldType: string): void {
      this.sharedFormService.onAddressInput(event,fieldType);
    }

    openDeleteModal(driverId: number) {
      this.shipperToDelete = driverId;
      this.showDeleteModal = true; // Show modal
    }
    
    // Close modal
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.shipperToDelete = null;
    }
    confirmDelete() {
      if (this.shipperToDelete !== null) {
        this.deleteShipper(this.shipperToDelete);
        this.closeDeleteModal(); 
      }
    }
}
