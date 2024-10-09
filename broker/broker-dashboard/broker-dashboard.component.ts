import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { URIKey } from '../../shared/utils/uri-enums';
import { Load } from '../../load/load-management/load-management.metadata';
import { HttpURIService } from '../../app.http.uri.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadService } from '../../shared/services/loadData.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-broker-dashboard',
  templateUrl: './broker-dashboard.component.html',
  styleUrls: ['./broker-dashboard.component.scss']
})
export class BrokerDashboardComponent {
  activeTab: string = 'activeLoads';
  loads: number = 0;
  statuses: number = 0;
  activeLoads:Load[]=[];
  awaitingPickup:Load[]=[];
  isPinned:Load[]=[];
  cardsData = [
    { sparklineId: 'chart1', colorClass: 'green', imgSrc: 'assets/images/total-loads.png', value: '0', label: 'totalLoads' },
    { sparklineId: 'chart2', colorClass: 'lite-blue', imgSrc: 'assets/images/total-complaints.png', value: '0', label: 'onTime' },
    { sparklineId: 'chart3', colorClass: 'brown', imgSrc: 'assets/images/Pickup.png', value: '0', label: 'unassignedLoads' },
    { sparklineId: 'chart4', colorClass: 'blue', imgSrc: 'assets/images/reported.png', value: '0', label: 'runningLate' }
  ];
  data: number[]=[];
  labels= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpURIService: HttpURIService,
    private http: HttpClient,
    private loadService: LoadService,
    private router: Router, private route: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables); 
      this.initializeCharts(); 
    }
    this.fetchAllShipments();
    this.fetchUnassignedShipments();
    this.fetchActiveShipments();
  }

  initializeCharts(): void {
    this.cardsData.forEach(card => {
      const canvasElement = document.getElementById(card.sparklineId) as HTMLCanvasElement;
      if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        if (ctx) {
          this.createChart(ctx, card.sparklineId);
        } else {
          console.error(`Context not found for ${card.sparklineId}`);
        }
      } else {
        console.error(`Canvas element not found for ${card.sparklineId}`);
      }
    });
  }

 
  fetchAllShipments(): void {
    this.httpURIService.requestGET<Load[]>(URIKey.GET_ALL_SHIPMENTS).subscribe(response => {
      this.processMonthData(response);
      this.loads = response.length;
      const totalLoadsCard = this.cardsData.find(card => card.label === 'totalLoads');
      if (totalLoadsCard) {
        totalLoadsCard.value = this.loads.toString();
      }
      const LoadsChart = document.getElementById('chart1') as HTMLCanvasElement;
      if (LoadsChart) {
        const ctx = LoadsChart.getContext('2d');
        if (ctx) {
          this.createLineChart(ctx, this.labels, this.data, '#4CAF50', '#D1A1D6');
        }
      }

    });
  }

  fetchUnassignedShipments(): void {
    const status: number = 1;
    const params = new HttpParams().set('status', status.toString());
    this.httpURIService.requestGET<Load[]>(URIKey.GET_SHIPMENT_BY_STATUS, params).subscribe(response => {
      this.processMonthData(response);
      this.statuses = response.length;
      const unassignedShipmentsCard = this.cardsData.find(card => card.label === 'unassignedLoads');
      if (unassignedShipmentsCard) {
        unassignedShipmentsCard.value = this.statuses.toString();
      }
      const LoadsChart = document.getElementById('chart3') as HTMLCanvasElement;
      if (LoadsChart) {
        const ctx = LoadsChart.getContext('2d');
        if (ctx) {
          this.createMixedChart(ctx, this.labels, this.data, '#9a7fbe', '#66b2b2');
        }
      }
    });
  }
  processMonthData(response: Load[]): void {
    const monthData: { [key: string]: number } = {};
    response.forEach(item => {
      const monthLabel = item.loadMonth;
      if (monthLabel) {
        monthData[monthLabel] = (monthData[monthLabel] || 0) + 1;
      }
    });
    this.data = this.labels.map(month => monthData[month] || 0);
  }
  

  fetchActiveShipments(): void {
    const status: number = 6;
    const params = new HttpParams().set('status', status);
    this.httpURIService.requestGET<Load[]>(URIKey.GET_SHIPMENT_BY_STATUS, params).subscribe(response => {
      this.activeLoads = response;
    });
  }

  fetchAwaitingPickupShipments(): void {
    const status: number = 3;
    const params = new HttpParams().set('status', status);
    this.httpURIService.requestGET<Load[]>(URIKey.GET_SHIPMENT_BY_STATUS, params).subscribe(response => {
      this.awaitingPickup = response;
    });
  }

  fetchAllPinnedLoads(): void {
    this.httpURIService.requestGET<Load[]>(URIKey.GET_ALL_PINNED_LOADS).subscribe(response => {
      this.isPinned = response;
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    switch (tab) {
      case 'activeLoads':
        this.fetchActiveShipments();
        break;
      case 'awaitingPickups':
        this.fetchAwaitingPickupShipments();
        break;
      case 'pinnedLoads':
        this.fetchAllPinnedLoads();
        break;
      
    }
  }  

  createChart(ctx: CanvasRenderingContext2D, chartId: string): void {
    switch (chartId) {
      case 'chart1':
        break;
      case 'chart2':
        this.createBarChart(ctx, ['Jan', 'Feb', 'Mar', 'Apr', 'May'], [5, 10, 15, 20, 25], '#66b2b2');
        break;
      case 'chart3':
        break;
      case 'chart4':
        this.createLineChart(ctx, ['Jan', 'Feb', 'Mar', 'Apr', 'May'], [5, 15, 10, 25, 5], '#9a7fbe');
        break;
    }
  }

  createLineChart(ctx: CanvasRenderingContext2D, labels: string[], data: number[], borderColor: string, backgroundColor?: string): void {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Loads',
          data,
          borderColor,
          backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0)',
          fill: true
        }]
      },
      options: {
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  createBarChart(ctx: CanvasRenderingContext2D, labels: string[], data: number[], backgroundColor: string): void {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sample Data',
          data,
          backgroundColor
        }]
      },
      options: {
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  createMixedChart(ctx: CanvasRenderingContext2D, labels: string[], data: number[], barColor: string, lineColor: string): void {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Loads', data, backgroundColor: barColor },
          { label: 'Loads', data, type: 'line', borderColor: lineColor, fill: false }
        ]
      },
      options: {
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  viewLoadDetails(load: Load): void {
    this.loadService.load=load;
    this.router.navigate(['/home/load/loadDetails'], { relativeTo: this.route.parent });
  }
}
