import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';
import { LoadService } from '../../shared/services/loadData.service';
import { Status } from './load-details.metadata';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MapConstant } from '../../shared/utils/map.constant';
import { MapService } from '../../shared/services/map.service';
import { ErrorMessages, Statuses, SuccessMessages } from '../../shared/utils/enums';
import { NotificationService } from '../../shared/services/notification.service';
import { RealTimeTrackingService } from '../../shared/services/real-time-tracking.service';
interface UploadedDocument {
  id: number;
  name: string;
  size: string;
  previewIcon: string;
  downloadLink: string;
  uploadDate: string;
  fileData: string;
}
interface VerifiedDocument {
  id: number;
  type: string;
  name: string;
  previewIcon: string;
  downloadLink: string;
  fileData: string;
}

@Component({
  selector: 'app-load-details',
  templateUrl: './load-details.component.html',
  styleUrl: './load-details.component.scss'
})
export class LoadDetailsComponent implements OnInit {
  @ViewChild('lineChart') lineChart?: ElementRef<HTMLCanvasElement>;
  driverForm: FormGroup;
  drivers: any;
  selectedDriverId: string | null = null;
  selectedDriver: any;
  shipmentDocForm: FormGroup;
  DocumentsForm: FormGroup;
  selectedDocument = 'DO';
  originData: Array<{ label: string, value: string }> = [];
  destinationData: Array<{ label: string, value: string }> = [];
  loadData: Array<{ label: string, value: string }> = [];
  datesCostData: Array<{ label: string, value: string }> = [];
  showSuccessMessage = false;
  stars = Array(5).fill({ active: false });
  assignmentForm!: FormGroup;
  direction: string = 'ltr';
  selectedTab: string = 'assignments';
  documentCount: number = 0;
  documents: any[] = [];  // This will hold the actual document details
  showDetails: boolean = false;
  tabs = [
    { id: 'assignments', icon: 'bx bx-file-blank', label: 'Assignments', active: true },
    { id: 'verification', icon: 'mdi mdi-sticker-check-outline', label: 'Verification', active: false },
    { id: 'tracking', icon: 'dripicons-location', label: 'Tracking', active: false },
    { id: 'status', icon: 'fas fa-cog', label: 'Status', active: false },
    { id: 'comments', icon: 'fas fa-comments-dollar', label: 'Comments', active: false },
    { id: 'documents', icon: 'bx bx-file-blank', label: 'Documents', active: false },
    { id: 'routeHistory', icon: 'bx bx-history', label: 'Route History', active: false },
  ];
  instruction: string[] = [];
  uploadedDocuments: UploadedDocument[] = [];
  verifiedDocuments: VerifiedDocument[] = [];
  loads = [];
  pagination = {
    from: 1,
    to: 1,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    pages: [] as number[],
  };
  commentList: any[]
  statuses: Status[];
  comments: FormGroup;
  displayedItems: any[] = [];
  routeHistoryCoordinates: any[];
  itemsPerPage = 5;
  description: string = '';
  uploadedFile: File | null = null;
  selectedProofOption: string | null = null;
  proofOptions: { key: string; value: string }[] = [
    { key: 'proofOfPickup', value: 'Proof of Pickup' },
    { key: 'proofOfDelivery', value: 'Proof of Delivery' }
  ];
  countryCodes: { id: string, name: string }[] = [
    { id: '1', name: 'USA(+1)' },
    { id: '1', name: 'CAN(+1)' },
    { id: '967', name: 'DXB(+967)' },
    { id: '92', name: 'PAK(+92)' }
  ];
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapService: MapService, public loadService: LoadService,
    private httpURIService: HttpURIService, private mapConstant: MapConstant, private translate: TranslateService,
    private notificationService: NotificationService, private router: Router, public realTimeTracking: RealTimeTrackingService,
    private formBuilder: FormBuilder) {
    Chart.register(...registerables);
    this.assignmentForm = new FormGroup({
      driver: new FormControl('',),
      realTimeTracking: new FormControl(false)
    });
    this.statuses = [];
    this.driverForm = new FormGroup({
      driverName: new FormControl('', Validators.required),
      driverContactNumber: new FormControl('', Validators.required),
      driverEmail: new FormControl('', [Validators.required, Validators.email]),
      driverUsername: new FormControl('', Validators.required),
      driverLicenseNumber: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required)
    });
    this.comments = new FormGroup({
      commentDescription: new FormControl('', Validators.required),
    })
    this.commentList = [];
    realTimeTracking.isRealTimeTrackingEnabled = false;
    this.routeHistoryCoordinates = [];
    this.shipmentDocForm = this.formBuilder.group({
      documentType: ['', Validators.required],  // Simple validator for required field
      documentFile: [null]  // No validators needed for file input
    });
    this.DocumentsForm = this.formBuilder.group({
      proofDocumentType: ['', Validators.required],
      documentFile: [null],
      description: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    if (this.loadService.load) {
      this.initializeData(this.loadService.load);
    }
    this.httpURIService.requestGET<Status[]>(URIKey.GET_ALL_STATUSES).subscribe(response => {
      this.statuses = response;
    });

    this.loadAlldrivers();
  }

  loadAlldrivers() {
    this.httpURIService.requestGET(URIKey.GET_ALL_DRIVERS).subscribe((response) => {
      this.drivers = response;
      this.setAssignedDriverDetails();
    });

  }

  refreshLoadStatus() {
    const params = new HttpParams().set('shipmentId', this.loadService.load.shipmentId);
    this.httpURIService.requestGET<any>(URIKey.UPDATE_SHIPMENT, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.loadService.load = response[0];
      }
    })
  }

  setAssignedDriverDetails() {
    if (this.loadService.load.driverId != null) {
      this.selectedDriverId = this.loadService.load.driverId;
      this.selectedDriver = this.drivers.find((driver: any) => {
        return String(driver.driverId) === String(this.selectedDriverId);
      });
    }
  }

  onDriverSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDriverId = target.value;
    this.selectedDriver = this.drivers.find((driver: any) => {
      return String(driver.driverId) === String(this.selectedDriverId);
    });

  }


  setDriverId() {
    const payload = {
      driverId: parseInt(this.selectedDriverId!, 10),
      shipmentId: parseInt(this.loadService.load.shipmentId, 10)
    };

    //this.getAllVerifiedDocuments();

    if (this.selectedDriver != null) {
      this.httpURIService.requestPOST(URIKey.SET_DRIVER_ID, payload)
        .subscribe(response => {
          this.notificationService.success(this.translate.instant(SuccessMessages.LINK_SENT));
        });
    }
    else {
      this.notificationService.error(this.translate.instant(ErrorMessages.DRIVER_NOT_SELECTED));
    }

  }

  getAllVerifiedDocuments() {
    let shipmentId = this.loadService.load.shipmentId;
    const params = new HttpParams().set('shipmentId', shipmentId);
    this.httpURIService.requestGET<any>(URIKey.GET_ALL_VERIFIED_DOCUMENTS, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.documentCount = response.data.length;
        if (response.data.length == 0) {
          this.notificationService.error(this.translate.instant(ErrorMessages.VERFICATION_DOCUMENTS_REQUIRED));
        }
      }

    });
  }
  getAttachDocuments() {
    let shipmentId = this.loadService.load.shipmentId;
    const params = new HttpParams().set('shipmentId', shipmentId);

    this.httpURIService.requestGET<any>(URIKey.GET_ALL_VERIFIED_DOCUMENTS, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        const responseArray = response.data || [];
        this.verifiedDocuments = [];
        responseArray.forEach((item: any) => {
          this.verifiedDocuments.push({
            id: item.id,
            type: item.documentType,
            previewIcon: 'bx bx-show',
            downloadLink: `/path/to/download/${item.fileName}`,
            name: item.fileName,
            fileData: item.fileData
          });
        });
      }
    });
  }
  previewPDF(fileData: string) {
    const blob = this.b64toBlob(fileData, 'application/pdf');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  downloadfile(fileData: string) {
    const blob = this.b64toBlob(fileData, 'application/pdf');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  b64toBlob(b64Data: string, contentType: string = '', sliceSize: number = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }

  setStars(rating: number) {
    this.stars = this.stars.map((_, i) => ({
      active: i < rating,
    }));
  }

  selectTab(tabId: string) {
    this.selectedTab = tabId;
    this.realTimeTracking.tab = '';
    switch (tabId) {
      case 'comments':
        this.getAllcomments();
        break;
      case 'tracking':
        this.tracking();
        break;
      case 'routeHistory':
        this.routeHistory();
        break;
      case 'documents':
        this.getDocuments();
        break;
      case 'verification':
        this.verifyTruck();
        break;

    }
  }
  onSubmit() {
    if (this.assignmentForm.valid) {
      this.showSuccessMessage = true;
    }
  }
  dismissAlert() {
    this.showSuccessMessage = false;
  }

  initializeData(loads: any): void {
    this.destinationData = [
      { label: 'Consinee Name', value: loads.consigneeName || '' },
      { label: 'Address', value: loads.destinationAddress || '' },
      { label: 'City, State, Zip', value: `${loads.destinationCity || ''}, ${loads.destinationProvince || ''}` },
      { label: 'Scheduled Date/Time', value: loads.deliveryDate || '' }
    ];

    this.originData = [
      { label: 'Shipper Name', value: loads.name },
      { label: 'Address', value: loads.originAddress || '' },
      { label: 'City, State, Zip', value: `${loads.originCity || ''}, ${loads.originProvince || ''}` },
      { label: 'Scheduled Date/Time', value: loads.loadDate }
    ];


    this.loadData = [
      { label: 'Trailer Type', value: loads.trailerType || '' },
      { label: 'Posting Attribute', value: loads.postingAttribute || '' },
      { label: 'Load Weight', value: (loads.weight !== undefined ? loads.weight.toString() : '') },
      { label: 'Load Length', value: (loads.length !== undefined ? loads.length.toString() : '') },
      { label: 'Load Type', value: (loads.loadSize !== undefined ? loads.loadSize.toString() : '') }
    ];

    this.datesCostData = [
      { label: 'Company', value: loads.company },
      { label: 'Schedule Date', value: loads.scheduleDate },
      { label: 'Load Date', value: loads.loadDate },
      { label: 'Delivery Date', value: loads.deliveryDate },
      { label: 'Estimated Cost', value: loads.estimatedCost },
      { label: 'Estimated Miles', value: loads.estimatedMiles }
    ];
    this.instruction = [loads.specialInstruction]
  }

  get currentStatusIndex(): number {
    return this.statuses.findIndex(status => status.statusDescription === this.loadService.load.statusDescription);
  }

  onStatusClick(statusDescription: string) {
    const payload = {
      shipmentId: this.loadService.load.shipmentId,
      statusDescription: statusDescription
    };
    this.httpURIService.requestPATCH(URIKey.UPDATE_SHIPMENT_STATUS, payload).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.loadService.load.loadStatus = statusDescription;
      }
    })
  }
  onDriverSubmit() {
    let isVerified = false;
    let payload = {};
    payload = { ...this.driverForm.value, 
      isVerified };

    this.httpURIService.requestPOST(URIKey.CREATE_DRIVER, payload).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.driverForm.reset();
        this.drivers.push(response);
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
      }
    })
  }
  resetForm() {
    this.driverForm.reset();
  }

  resetShipmentDoc() {
    this.shipmentDocForm.reset();
  }

  onSubmitComments() {
    const payload = { ...this.comments.value, shipmentId: this.loadService.load.shipmentId };
    this.httpURIService.requestPOST(URIKey.CREATE_COMMENT, payload).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.commentList.push(response);
        this.comments.reset();
        this.notificationService.success(SuccessMessages.RECORD_ADDED);
      }
    })
  }
  getAllcomments() {
    this.httpURIService.requestGET(URIKey.GET_ALL_COMMENTS).subscribe(response => {
      this.commentList = response as any;
    })
  }

  tracking() {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        import('leaflet-routing-machine').then(() => {
          if (L) {
            this.realTimeTracking.tab = 'tracking';
            this.realTimeTracking.isRealTimeTrackingEnabled = false;
            this.realTimeTracking.stopAllTracking();
            this.realTimeTracking.enableMap();
            this.mapService.initializeMap("map", this.mapConstant.mapOptions, 13, L);
            this.realTimeTracking.setTruckAddress(this.loadService.load, true);
          }
        })
      })
    }
  }

  getFullRoute() {
    this.realTimeTracking.stopAllTracking();
    this.realTimeTracking.enableMap();
    this.realTimeTracking.getTruckFullRoute(this.loadService.load);
  }

  enableRealTimeTracking(event: Event) {
    this.realTimeTracking.enableMap();
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.realTimeTracking.showTracking();
      this.realTimeTracking.realTimetruckMovement();
    }
    else {
      this.realTimeTracking.hideTracking();
      this.realTimeTracking.stopAllTracking();
    }
  }

  currentLocation() {
    this.realTimeTracking.enableMap();
    this.realTimeTracking.hideTracking();
    this.realTimeTracking.currentLocation(this.loadService.load);
  }

  async routeHistory() {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        if (L) {
          this.realTimeTracking.stopAllTracking();
          this.mapService.initializeMap("map", this.mapConstant.mapOptions, 13, L);
          const params = new HttpParams().set('shipmentId', this.loadService.load.shipmentId);
          this.httpURIService.requestGET<any>(URIKey.GET_SHIPMENT_COORDINATES, params).subscribe(response => {
            if (!(response instanceof HttpErrorResponse)) {
              if (response && response.hasOwnProperty('data')) {
                this.routeHistoryCoordinates = [...response.data?.emptyMiles?.coordinates, ...response.data?.enroute?.coordinates];
                this.pagination.total = this.routeHistoryCoordinates.length;
                this.updatePagination();
                this.plotRoute(L);
              }
              else {
                this.notificationService.error(this.translate.instant(ErrorMessages.RECORD_NOT_FOUND));
              }
            }
          });
        }
      })
    }
  }

  updatePagination() {
    this.pagination.totalPages = Math.ceil(this.pagination.total / this.itemsPerPage);
    this.pagination.pages = Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
    this.updatePageRange();
  }

  updatePageRange() {
    const startIndex = (this.pagination.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.pagination.total);
    this.displayedItems = this.routeHistoryCoordinates.slice(startIndex, endIndex);
    this.pagination.from = startIndex + 1;
    this.pagination.to = endIndex;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.updatePageRange();
    }
  }

  previousPage() {
    if (this.pagination.currentPage > 1) {
      this.goToPage(this.pagination.currentPage - 1);
    }
  }

  nextPage() {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.goToPage(this.pagination.currentPage + 1);
    }
  }

  plotRoute(L: any) {
    const latLngs = this.routeHistoryCoordinates.map(coord => [coord.latitude, coord.longitude]);
    if (this.mapService.map) {
      L.polyline(latLngs, { color: 'blue', weight: 3 }).addTo(this.mapService.map);
      this.mapService.map.fitBounds(L.latLngBounds(latLngs));
    }
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    let file: File | null = element.files ? element.files[0] : null;
    if (file) {
      // Assuming 'documentFile' is the key for storing file in your FormGroup
      this.shipmentDocForm.patchValue({ documentFile: file });
    }
  }
  onShipmentDocSubmit() {
    let shipmentId = this.loadService.load.shipmentId;

    const formData = new FormData();
    formData.append('shipment', shipmentId);
    formData.append('DocumentType', this.shipmentDocForm.get('documentType')?.value);

    const file: File = this.shipmentDocForm.get('documentFile')?.value;
    if (file) {
      formData.append('Document', file, file.name);
    }

    this.httpURIService.requestPOSTMultipart(URIKey.SHIPMENT_DOCUMENTS, formData).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.shipmentDocForm.reset();
        this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
      }
    })

  }
  getDocuments() {
    this.uploadedDocuments = [];
    const deliveryParams = new HttpParams()
      .set('shipment', this.loadService.load.shipmentId)
      .set('proofDocumentType', 'proofOfDelivery');

    this.httpURIService.requestGET(URIKey.GET_PROOF_OF_DELIVERY, deliveryParams).subscribe(response => {
      const responseArray = response as any[];
      responseArray.forEach((item: any) => {
        const uploadDate = new Date(item.uploadDate);
        const formattedDate = uploadDate.toLocaleDateString() + ' ' + uploadDate.toLocaleTimeString();
        this.uploadedDocuments.push({
          id: item.id,
          name: item.loadDocumentType,
          size: 'N/A',
          previewIcon: 'bx bx-show',
          downloadLink: `/path/to/download/${item.fileName}`,
          uploadDate: formattedDate,
          fileData: item.fileData
        });
      });
    });

    const pickupParams = new HttpParams()
      .set('shipment', this.loadService.load.shipmentId)
      .set('proofDocumentType', 'proofOfPickup');

    this.httpURIService.requestGET(URIKey.GET_PROOF_OF_PICKUP, pickupParams).subscribe(response => {
      const responseArray = response as any[];
      responseArray.forEach((item: any) => {
        const uploadDate = new Date(item.uploadDate);
        const formattedDate = uploadDate.toLocaleDateString() + ' ' + uploadDate.toLocaleTimeString();
        this.uploadedDocuments.push({
          id: item.id,
          name: item.loadDocumentType,
          size: 'N/A',
          previewIcon: 'bx bx-show',
          downloadLink: `/path/to/download/${item.fileName}`,
          uploadDate: formattedDate,
          fileData: item.fileData
        });
      });
    });

  }

  onIconClick(fileId: number) {
    const document = this.uploadedDocuments.find(doc => doc.id === fileId);
    if (document && document.fileData) {
      this.displayImage(document.fileData);
    }
  }

  displayImage(base64Data: string) {
    const imgElement = document.getElementById('documentImage') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = `data:image/jpeg;base64,${base64Data}`;
    }
  }
  images: { [key: string]: string } = {}; verifyTruck() {
    const pickupParams = new HttpParams()
      .set('shipment', this.loadService.load.shipmentId)
      .set('proofDocumentType', 'verifyTruck');
    this.httpURIService.requestGET(URIKey.GET_PROOF_OF_VERIFY_TRUCK, pickupParams).subscribe(response => {
      const responseData = response as any;
      this.images = {};

      // Extract fileData and store in the images array
      responseData.Images.forEach((image: any) => {
        if (image.fileData) {
          this.images[image.loadDocumentType] = image.fileData;
        }
      });

    });
  }

  allotPickupNumber() {
    const params = new HttpParams().set('shipmentId', this.loadService.load.shipmentId);
    this.httpURIService.requestPATCH(URIKey.ALLOT_PICKUP_NUMBER, undefined, undefined, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.notificationService.success(this.translate.instant(SuccessMessages.PICKUP_NUMBER_ALLOTTED));
      }
    })
  }

  downloadFile(data: string, fileType: string, filename: string): void {
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadFileByType(type: string): void {
    let base64Data: string;
    let fileType: string;
    let filename: string;

    if (this.images[type]) {
      if (type === 'CabCard') {
        base64Data = `data:application/pdf;base64,${this.images[type]}`;
        fileType = 'application/pdf';
        filename = `${type}.pdf`;
      } else {
        base64Data = `data:image/jpeg;base64,${this.images[type]}`;
        fileType = 'image/jpeg';
        filename = `${type}.jpg`;
      }
      this.downloadFile(base64Data, fileType, filename);
    }
  }

  previewImage(imageBase64: string) {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const desiredWidth = 1200;
      const desiredHeight = 1200;
      const img = new Image();
      img.onload = () => {
        const originalRatio = img.width / img.height;
        if (desiredWidth / desiredHeight > originalRatio) {
          canvas.width = desiredWidth;
          canvas.height = desiredWidth / originalRatio;
        } else {
          canvas.width = desiredHeight * originalRatio;
          canvas.height = desiredHeight;
        }
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedImageBase64 = canvas.toDataURL('image/jpeg', 1);
        newWindow.document.write(`<img src="${resizedImageBase64}" alt="Image">`);
      };
      img.src = `data:image/jpeg;base64,${imageBase64}`;
    }
  }

  previewPdf(pdfString: string) {
    const byteCharacters = atob(pdfString);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const pdfBlob = new Blob([byteNumbers], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
  uploadProofDocuments() {
    if (this.DocumentsForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('shipment', this.loadService.load.shipmentId);
    formData.append('proofDocumentType', this.DocumentsForm.get('proofDocumentType')?.value);
    formData.append('driver', this.selectedDriver.driverId);
    formData.append('loadDocumentType', this.DocumentsForm.get('description')?.value);
    const currentDate = new Date().toISOString();
    formData.append('date', currentDate);

    if (this.uploadedFile) {
      formData.append('documents', this.uploadedFile, this.uploadedFile.name);
    }

    if (this.DocumentsForm.get('proofDocumentType')?.value === 'proofOfPickup') {
      this.httpURIService.requestPOSTMultipart(URIKey.PROOF_OF_PICKUP, formData).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.DocumentsForm.reset();
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
        }
      });
    }
    else if (this.DocumentsForm.get('proofDocumentType')?.value === 'proofOfDelivery') {
      this.httpURIService.requestPOSTMultipart(URIKey.PROOF_OF_DELIVERY, formData).subscribe(response => {
        if (!(response instanceof HttpErrorResponse)) {
          this.DocumentsForm.reset();
          this.notificationService.success(this.translate.instant(SuccessMessages.RECORD_ADDED));
        }
      });
    }
  }

  onProofOptionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.DocumentsForm.patchValue({ proofDocumentType: selectElement.value });
  }
  FileUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    this.uploadedFile = element.files ? element.files[0] : null;
    if (this.uploadedFile) {
      this.DocumentsForm.patchValue({ documentFile: this.uploadedFile });
    }
  }

}
