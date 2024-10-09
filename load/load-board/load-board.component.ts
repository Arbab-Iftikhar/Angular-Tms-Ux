import { Component, OnInit } from '@angular/core';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { Load } from '../load-management/load-management.metadata';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoadService } from '../../shared/services/loadData.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessages, SuccessMessages } from '../../shared/utils/enums';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-load-board',
  templateUrl: './load-board.component.html',
  styleUrl: './load-board.component.scss'
})
export class LoadBoardComponent implements OnInit {
  isDropdownOpen = false;
  loads: Load[];
  statusFilter: string = '';
  originAddressFilter: string = '';
  destinationAddressFilter: string = '';
  loadSizeFilter: string = '';
  trailerTypeFilter: string = '';
  direction: string = 'ltr';
  loadBoard: string;
  isLegendDropdownOpen = false;
  selectedShipmentId :number | null = null;
  showConformationModal = false;
  cancellationForm: FormGroup;
  legendGroups = [
    { code: 'T', description: 'Truckload' },
    { code: 'L', description: 'Less Than Truckload' },
    { code: 'B', description: 'Both' },
    { code: 'V', description: 'Van/Dry Box' },
    { code: 'K', description: 'Straight Truck' },
    { code: 'L', description: 'LowBoy/RGN' },
    { code: 'A', description: 'Air Ride' },
    { code: 'B', description: 'B-Train' },
    { code: 'W', description: 'Blanket Wrap' }
  ];
  constructor(  private formBuilder: FormBuilder, private httpURIService: HttpURIService, private router: Router, private route: ActivatedRoute, private loadService: LoadService, private translate: TranslateService,private notificationService: NotificationService) {
    this.loads = [];
    this.loadBoard = 'List';
    this.cancellationForm = this.formBuilder.group({
      reason: ['', Validators.required] 
    });
  }
  ngOnInit(): void {
    this.getShipmentByStatus();
  }

  getShipmentByStatus()
  {
    // const status: number = 1;
    // const params = new HttpParams().set('status', status.toString());
    this.httpURIService.requestGET<Load[]>(URIKey.GET_ALL_SHIPMENTS).subscribe(response => {
      this.loads = response;
    })
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isLegendDropdownOpen = false;
  }
  onDropdownItemClick(date: any): void {
    console.log(date)
  }
  viewLoadDetails(load: Load): void {
    this.loadService.load=load;
    this.router.navigate(['loadDetails'], { relativeTo: this.route.parent });
  }
  onSelect(type: string) {
    this.loadBoard = type;
  }
  toggleLegendDropdown() {
    this.isLegendDropdownOpen = !this.isLegendDropdownOpen;
    this.isDropdownOpen = false;
  }

  isPinned(shipmentId: number, event: Event) {
    const params = new HttpParams().set('shipmentId', shipmentId);
    const isPinnedValue = (event.target as HTMLInputElement).checked;
    let payload = { 'isPinnedValue': isPinnedValue }
    this.httpURIService.requestPATCH(URIKey.IS_PINNED, payload, undefined, params).subscribe({});
  }
  conformation(shipmentId: number) {
    this.selectedShipmentId = shipmentId; 
    const selectedShipment = this.loads.find(load => load.shipmentId === this.selectedShipmentId);
    if (selectedShipment && selectedShipment.status === 10) {
      this.notificationService.error(this.translate.instant(ErrorMessages.SHIPMENT_ALREADY_CANCELED));
    }else{
      this.showConformationModal = true; 
    }
  }
  closeDeleteModal() {
    this.showConformationModal = false;
    this.selectedShipmentId = null;
    this.cancellationForm.reset();
  }
  cancelShipment(){
      const payload = {
        reason: this.cancellationForm.get('reason')?.value,
        shipmentId: this.selectedShipmentId
      };
      this.httpURIService.requestPOST(URIKey.CANCEL_SHIPMENT, payload).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant(SuccessMessages.SHIPMENT_CANCELED));
        }
        });
      this.closeDeleteModal();
  }

}
