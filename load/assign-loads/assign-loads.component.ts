import { Component, OnInit } from '@angular/core';
import { Load } from '../load-management/load-management.metadata';
import { HttpParams } from '@angular/common/http';
import { URIKey } from '../../shared/utils/uri-enums';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpURIService } from '../../app.http.uri.service';
import { LoadService } from '../../shared/services/loadData.service';

@Component({
  selector: 'app-assign-loads',
  templateUrl: './assign-loads.component.html',
  styleUrl: './assign-loads.component.scss'
})
export class AssignLoadsComponent implements OnInit{
  isDropdownOpen = false;
  loads: Load[];
  direction: string = 'ltr';
  loadBoard: string;
  isLegendDropdownOpen = false;
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
  constructor(private httpURIService: HttpURIService, private router: Router, private route: ActivatedRoute, private loadService: LoadService) {
    this.loads = [];
    this.loadBoard = 'List';
  }
  ngOnInit(): void {
  this.getShipmentByStatus();
  }

  getShipmentByStatus()
  {
    const status: number = 1;
    const params = new HttpParams().set('status', status);
    this.httpURIService.requestGET<Load[]>(URIKey.GET_ALL_ACTIVE_LOADS, params).subscribe((response:Load[]) => {
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
}
