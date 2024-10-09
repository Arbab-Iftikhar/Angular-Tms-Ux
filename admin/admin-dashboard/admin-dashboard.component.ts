import { Component, ViewChild, ElementRef} from '@angular/core';
import {FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  cards = [
    { title: 'totalBrokers', count: '0', borderColor: 'lite-green', iconColor: 'lite-green', icon: 'bx bx-copy-alt font-size-24' },
    { title: 'totalDrivers', count: '0', borderColor: 'brown', iconColor: 'brown', icon: 'bx bx-copy-alt font-size-24' },
    { title: 'totalShipper', count: '0', borderColor: 'green', iconColor: 'green', icon: 'bx bx-copy-alt font-size-24' },
    { title: 'totalCarrier', count: '0', borderColor: 'lite-blue', iconColor: 'lite-blue', icon: 'bx bx-copy-alt font-size-24' },
    { title: 'subscriberStatus', count: '0', borderColor: 'red', iconColor: 'red', icon: 'bx bx-copy-alt font-size-24' },
  ];
}
