import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpURIService } from '../../../app.http.uri.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { URIKey } from '../../../shared/utils/uri-enums';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorMessages, SuccessMessages } from '../../../shared/utils/enums';
import { SharedFormService } from '../../../shared/services/shared-form.service';

interface CompanyData {
  companyId: number;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyProvince: string;
  companyContactInfo: string;

}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  allCompanies:any;
  companyForm: FormGroup;
  editFunction:boolean | undefined;
  currentComapnyId: number | null = null;
  companyToDelete: number | null = null;
  showDeleteModal: boolean = false;
  contactFilter: string = '';
  constructor(public sharedFormService: SharedFormService,private httpURIService: HttpURIService,private notificationService: NotificationService, private translate: TranslateService) {
    sharedFormService.activeDropdown='';
    this.companyForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      companyAddress: new FormControl('', Validators.required),
      companyCity: new FormControl('', Validators.required),
      companyProvince: new FormControl('', Validators.required),
      companyContactInfo: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
   this.loadAllCompanies();
  }
  loadAllCompanies() {
    this.httpURIService.requestGET(URIKey.GET_ALL_COMPANIES).subscribe((response) => {
      this.allCompanies = response;
    });}

  ClearCompanyForm() {
    this.companyForm.reset();
  }

  onCompanySubmit() {
    if(this.editFunction!=true){
    this.httpURIService.requestPOST(URIKey.CREATE_COMPANY, this.companyForm.value).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
      this.companyForm.reset()
      this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
      this. loadAllCompanies();
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));

      }
    })
  }
  else{
    let payload = { ...this.companyForm.value, companyId: this.currentComapnyId };
      this.httpURIService.requestPATCH(URIKey.UPDATE_COMPANY, payload )
      .subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_UPDATED));
          this. loadAllCompanies();
        }else{
          this.notificationService.error(this.translate.instant(response.error.errorCode));
  
        }
      
      });
      this.editFunction = false;
  }
  

  }


  deleteComapny(id: number) {
    const params = new HttpParams().set('id', id.toString());
     this.httpURIService.requestDELETE(URIKey.DELETE_COMPANY, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_DELETED));
        this. loadAllCompanies();
      }else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));

      } 
    }) 
}

editCompany(company:any,id: number){
  this.companyForm.patchValue(company);
  this.editFunction=true;
  this.currentComapnyId=id;
  return this.currentComapnyId;

}


selectSuggestion(suggestion: any, form: FormGroup, controlName: string) {
  form.get(controlName)?.setValue(suggestion.displayName);
  this.sharedFormService.suggestions = [];
  this.sharedFormService.activeDropdown = '';
  if(controlName==='companyAddress'){
    this.companyForm.get('companyCity')?.setValue(suggestion.city);
    this.companyForm.get('companyProvince')?.setValue(suggestion.state)
  }
}

onAddressInput(event: Event, fieldType: string): void {
  this.sharedFormService.onAddressInput(event,fieldType);
}

openDeleteModal(driverId: number) {
  this.companyToDelete = driverId;
  this.showDeleteModal = true; // Show modal
}

// Close modal
closeDeleteModal() {
  this.showDeleteModal = false;
  this.companyToDelete = null;
}
confirmDelete() {
  if (this.companyToDelete !== null) {
    this.deleteComapny(this.companyToDelete);
    this.closeDeleteModal(); 
  }
}
}
