import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { City, Load, Province } from './load-management.metadata';
import { SharedFormService } from '../../shared/services/shared-form.service';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorMessages, SuccessMessages } from '../../shared/utils/enums';
import { LanguageService } from '../../shared/services/language.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-load-managment',
  templateUrl: './load-managment.component.html',
  styleUrl: './load-managment.component.scss'
})
export class LoadManagmentComponent implements OnInit {
  loadManagementForm: FormGroup;
  shipperForm: FormGroup;
  companyForm: FormGroup;
  isEditMode = false;
  loadType: string;
  shippers: any;
  companies: any;
  provinces: Province[] = [
    { id: 1, name: 'Ontario' },
    { id: 2, name: 'Quebec' },
    { id: 3, name: 'British Columbia' }
  ];

  cities: City[] = [
    { id: 1, name: 'Toronto', provinceId: "Ontario" },
    { id: 2, name: 'Ottawa',provinceId: "Ontario" },
    { id: 3, name: 'Mississauga', provinceId: "Ontario" },
    { id: 4, name: 'Montreal', provinceId: "Quebec" },
    { id: 5, name: 'Quebec City', provinceId: "Quebec" },
    { id: 6, name: 'Laval', provinceId: "Quebec" },
    { id: 7, name: 'Vancouver', provinceId: "British Columbia" },
    { id: 8, name: 'Victoria', provinceId: "British Columbia" },
    { id: 9, name: 'Surrey', provinceId: "British Columbia" }
  ];
  availableCities: City[] = [];
  trailerTypes: { id: string, name: string }[] = [
    { id: 'FB', name: 'Flatbed' },
    { id: 'DV', name: 'Dry Van' },
    { id: 'REF', name: 'Refrigerated' },
    { id: 'TK', name: 'Tanker' },
    { id: 'LB', name: 'Lowboy' },
    { id: 'SD', name: 'Step Deck' }
  ];
  
  loadSizes: { id: string, name: string }[] = [
    { id: 'FTL', name: 'Full Truckload (FTL)' },
    { id: 'LTL', name: 'Less Than Truckload (LTL)' },
    { id: 'PL', name: 'Partial Load' },
    { id: 'OL', name: 'Oversize Load' },
    { id: 'SP', name: 'Small Parcel' }
  ];
  

  postingAttributes= [
    { id: 1, name: 'Air Ride'},
    { id: 2, name: 'Chains'},
    { id: 3, name: 'Tarps'},
    { id: 4, name: 'Inbond'},
    { id: 5, name: 'Frozen'},
    { id: 6, name: 'Heat'}
  ];

  radius= [
    { id: 1, name: 2 },
    { id: 2, name: 4},
    { id: 3, name: 6},
    { id: 4, name: 8},
  ];

  lengthUnits = [
    { id: 1, name: 'cm' },
    { id: 2, name: 'm' },
    { id: 3, name: 'in' },
    { id: 4, name: 'ft' }
  ];

  weightUnits = [
    { id: 1, name: 'kg' },
    { id: 2, name: 'g' },
    { id: 3, name: 'mg' },
    { id: 4, name: 'lb' },
    { id: 6, name: 'ton' },
    { id: 7, name: 'st' }
  ];

  costUnits = [
    { id: 1, name: 'USD' },
    { id: 2, name: 'EUR' },
  ];  
  
  status = [
    { status: 1, statusDescription: 'Get Started' },
    { status: 2, statusDescription: 'Dispatched' },
    { status: 3, statusDescription: 'Schedule For Pickup' },
  ];
  loads: any[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  fileName: string = '';
  direction: string = 'ltr';
  loadId:any='';
  constructor(private httpURIService: HttpURIService, public sharedFormService: SharedFormService,private translate: TranslateService,private notificationService:NotificationService) {
    this.loadType = '';
    this.loadManagementForm = new FormGroup({
      shipperId: new FormControl('', Validators.required),
     // shipmentName: new FormControl('', Validators.required),
      originAddress: new FormControl('', Validators.required),
      originCity: new FormControl('', Validators.required),
      originProvince: new FormControl('', Validators.required),
      consigneeName: new FormControl('', Validators.required),
      originRadius: new FormControl('', Validators.required),
      destinationAddress: new FormControl('', Validators.required),
      destinationCity: new FormControl('', Validators.required),
      destinationProvince: new FormControl('', Validators.required),
      destinationRadius: new FormControl('', Validators.required),
      cargoDescription: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      loadDate: new FormControl('', Validators.required),
      deliveryDate: new FormControl('', Validators.required),
      trailerType: new FormControl('', Validators.required),
      loadSize: new FormControl('', Validators.required),
      estimatedCost: new FormControl('', Validators.required),
      estimatedTime: new FormControl('', Validators.required),
      estimatedMiles: new FormControl('', Validators.required),
      postingAttribute: new FormControl('', Validators.required),
      commodityDescription: new FormControl('', Validators.required),
      specialInstruction: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      unitlength:new FormControl('', Validators.required),
      unitWeight:new FormControl('', Validators.required),
      unitCost:new FormControl('', Validators.required),
      acceptTerms: new FormControl(false, Validators.requiredTrue),
      termsAccepted: new FormControl(false, Validators.requiredTrue),
      pickUpLang:  new FormControl(0),
      pickUpLat :  new FormControl(0),
      dropOfLang: new FormControl(0),
      dropOfLat :  new FormControl(0),
    });

    this.companyForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      companyAddress: new FormControl('', Validators.required),
      companyCity: new FormControl('', Validators.required),
      companyProvince: new FormControl('', Validators.required),
      companyContactInfo: new FormControl('', Validators.required)
    });

    this.shipperForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required),
      contactInfo: new FormControl('', Validators.required),
      pickUpLang:  new FormControl(0),
      pickUpLat :  new FormControl(0),
    });


  }

  ngOnInit(): void {
    this.httpURIService.requestGET(URIKey.SHIPPER).subscribe((response) => {
      this.shippers = response;
    });

    this.httpURIService.requestGET(URIKey.COMPANY).subscribe((response) => {
      this.companies = response;
    });
   
  }

  ngAfterViewInit() {

    this.onSelect("manual");
    this.fetchAllShipments();

  }

  onSelect(type: string) {
    this.loads=[];
    this.loadType = type === 'manual' ? 'manual' : 'import';
    this.fetchAllShipments();
  }

  onShipperChange(event: Event): void {
    this.loads = [];
    //this.sharedFormService.edit = false;
    const selectedShipperId = (event.target as HTMLSelectElement).value;
    const selectedShipper = this.shippers.find((shipper: any) => shipper.shipperId.toString() === selectedShipperId);

    if (selectedShipper) {
      this.loadManagementForm.patchValue({
        shipperId: selectedShipper.shipperId,
        originAddress: selectedShipper.address,
        originProvince: selectedShipper.province,
        originCity: selectedShipper.city,
        pickUpLang:selectedShipper.pickUpLang,
        pickUpLat:selectedShipper.pickUpLat
      });
    }
  }

  onProvinceChange(): void {
    const provinceId = this.loadManagementForm.get('destinationProvince')?.value;
    this.availableCities = this.cities.filter(city => city.provinceId === provinceId);
    this.loadManagementForm.get('destinationCity')?.setValue('');
  }
  ClearShipperForm() {
    this.shipperForm.reset();
  }
  ClearCompanyForm() {
    this.companyForm.reset();
  }
  onSubmit(): void {
    if (this.loadManagementForm.invalid) {
      this.loadManagementForm.markAllAsTouched();
      this.notificationService.error(this.translate.instant(ErrorMessages.INVALID_INPUT));
      return;
    }
  
    const formValue = this.loadManagementForm.value;
    const { shipperId, ...loadManagement } = formValue;
    loadManagement.length = this.concatWithUnit(formValue.length, formValue.unitlength);
    loadManagement.weight = this.concatWithUnit(formValue.weight, formValue.unitWeight);
    loadManagement.estimatedCost = this.concatWithUnit(formValue.estimatedCost, formValue.unitCost);
  
    const payload = [{
      shipper: { shipperId },
      ...loadManagement
    }];
  
    if (!this.sharedFormService.edit) {
      this.httpURIService.requestPOST(URIKey.CREATE_SHIPMENT, payload).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.loadManagementForm.reset();
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
  
          // Fetch all shipments again after a successful POST
          this.fetchAllShipments();
        }else{
          this.notificationService.error(this.translate.instant(response.error.errorCode));
        }
      });
    } else {
      const payload = {
        shipper: { shipperId },
        ...loadManagement
      };
      const params = new HttpParams().set('shipmentId', this.loadId);
      this.httpURIService.requestPATCH(URIKey.UPDATE_SHIPMENT, payload, undefined, params).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_UPDATED));
          this.fetchAllShipments(); // Fetch all shipments again after a successful PATCH
          this.loadManagementForm.reset();
        }else{
          this.notificationService.error(this.translate.instant(response.error.errorCode));
        }
      });
    }
  }

  
  fetchAllShipments(): void {
    this.httpURIService.requestGET<Load[]>(URIKey.GET_ALL_SHIPMENTS_PUNUMBER).subscribe(response => {
      this.loads = response;
      
     });
    }
  editLoad(load: Load): void {
    this.loadManagementForm.patchValue(load);
    this.loadId=load.shipmentId;
    
    this.patchNumericAndUnitValues('length', 'unitlength', load.length);
    this.patchNumericAndUnitValues('weight', 'unitWeight', load.weight);
    this.patchNumericAndUnitValues('estimatedCost', 'unitCost', load.estimatedCost);
    this.loadManagementForm.get('shipperId')?.setValue(load.shipperId);
    const statusDescription = this.status.find(status => status.status === load.status)?.statusDescription;
  if (statusDescription) {
    this.loadManagementForm.get('statusDescription')?.setValue(statusDescription);
  }

  const statusControl = this.loadManagementForm.get('status');
  if (statusControl) {
    statusControl.setValue(load.status);   
    statusControl.disable();               
  }

    this.sharedFormService.edit = true;

    return this.loadId;
  }
  

  deleteLoad(load: Load) {
    const params = new HttpParams().set('shipmentId', load.shipmentId);
    this.httpURIService.requestDELETE(URIKey.UPDATE_SHIPMENT, params).subscribe((response) => {
      if (!(response instanceof HttpErrorResponse)) {
        this.loads = [];
        this.loadManagementForm.reset();
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_DELETED));
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));
      }
    })
  }

  onShipperSubmit() {
    this.httpURIService.requestPOST(URIKey.CREATE_SHIPPER, this.shipperForm.value).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
      this.shipperForm.reset();
      this.shippers.push(response);
      this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));
      }
    })
  }

  onCompanySubmit() {
    this.httpURIService.requestPOST(URIKey.CREATE_COMPANY, this.companyForm.value).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
      this.companyForm.reset();
      this.companies.push(response);
      this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));
      }
    })
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.processExcelData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  }
  processExcelData(data: any[]) {
    this.loads = data.slice(1).map(([
      shipmentId, puNumber, shipperId, realTimeTracking, originAddress, originCity, originProvince, originRadius,
      destinationAddress, destinationCity, destinationProvince, destinationRadius, isWithinDestinationRadius,
      deliveryDate, loadDate, trailerType, loadSize, company, isPuNoAlloted, shipmentName,
      estimatedCost, estimatedMiles, weight, cargoDescription, status, pickUpLang, pickUpLat, dropOfLang, dropOfLat,
      estimatedTime, commodityDescription, specialInstruction, consigneeName, length, postingAttribute,
      scheduleDate // Added field for scheduleDate
    ]) => ({
      shipmentId,
      puNumber,
      shipper: { shipperId }, // Assuming shipperId is the only data you have to identify the shipper
      realTimeTracking,
      originAddress,
      originCity,
      originProvince,
      originRadius,
      destinationAddress,
      destinationCity,
      destinationProvince,
      destinationRadius,
      isWithinDestinationRadius,
      deliveryDate,
      loadDate,
      trailerType,
      loadSize,
      company,
      isPuNoAlloted,
      shipmentName,
      estimatedCost,
      estimatedMiles,
      weight,
      cargoDescription,
      status,
      pickUpLang,
      pickUpLat,
      dropOfLang,
      dropOfLat,
      estimatedTime,
      commodityDescription,
      specialInstruction,
      consigneeName,
      length,
      postingAttribute,
      scheduleDate // Include scheduleDate in the resulting object
    }));
}



  onImportSubmit(){
    this.httpURIService.requestPOST(URIKey.CREATE_SHIPMENT, this.loads).subscribe((response) => {
      if (!(response instanceof HttpErrorResponse)) {
        this.loads=response as any;
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
        this.loads=[];
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));
      }
    })
  }
  private concatWithUnit(value: string | number, unit: string): string {
    return `${value}${unit}`;
  }  
  
  patchNumericAndUnitValues(formControlName: string, unitControlName: string, value: string): void {
    const match = value.match(/(\d+)(\D+)/);
    if (match) {
      this.loadManagementForm.get(formControlName)?.setValue(Number(match[1])); 
      this.loadManagementForm.get(unitControlName)?.setValue(match[2].trim());
    }
  }

  selectSuggestion(suggestion: any, form: FormGroup, controlName: string) {
    form.get(controlName)?.setValue(suggestion.displayName);
    this.sharedFormService.suggestions = [];
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    this.sharedFormService.activeDropdown = '';
    if(controlName==='address'){
      this.loadManagementForm.get('pickUpLat')?.setValue(lat);
      this.loadManagementForm.get('pickUpLang')?.setValue(lon);
      this.shipperForm.get('pickUpLat')?.setValue(lat);
      this.shipperForm.get('pickUpLang')?.setValue(lon);
      this.shipperForm.get('city')?.setValue(suggestion.city);
      this.shipperForm.get('province')?.setValue(suggestion.state)

    }
    if(controlName==='destinationAddress'){
      this.loadManagementForm.get('dropOfLat')?.setValue(lat);
      this.loadManagementForm.get('dropOfLang')?.setValue(lon);
      this.loadManagementForm.get('destinationCity')?.setValue(suggestion.city);
      this.loadManagementForm.get('destinationProvince')?.setValue(suggestion.state)
    }

    if(controlName==='companyAddress'){
      this.companyForm.get('companyCity')?.setValue(suggestion.city);
      this.companyForm.get('companyProvince')?.setValue(suggestion.state)
    }
  }

  onAddressInput(event: Event, fieldType: string): void {
    this.sharedFormService.onAddressInput(event,fieldType);
  }
  
}
