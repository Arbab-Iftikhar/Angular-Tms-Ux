import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MapService } from '../../shared/services/map.service';
import { HttpURIService } from '../../app.http.uri.service';
import { City, Load } from '../load-management/load-management.metadata';
import { URIKey } from '../../shared/utils/uri-enums';
import { MapConstant } from '../../shared/utils/map.constant';
import { isPlatformBrowser } from '@angular/common';
import { RealTimeTrackingService } from '../../shared/services/real-time-tracking.service';
import { ErrorMessages, Statuses } from '../../shared/utils/enums';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-load',
  templateUrl: './view-load.component.html',
  styleUrl: './view-load.component.scss'
})
export class ViewLoadComponent implements OnInit {
  loads: Load[];
  cities: any[];
  cityType: string;
  city:string
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapService: MapService, private httpURIService: HttpURIService, private mapConstant: MapConstant, public realTimeTracking: RealTimeTrackingService,private cdr:ChangeDetectorRef,private notificationService : NotificationService,private translate: TranslateService) {
    this.loads = [];
    this.cities = [
    ];
    this.cityType = '';
    this.city= '';
  }

  ngOnInit(): void {
    this.realTimeTracking.isRealTimeTrackingEnabled = false;
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        this.realTimeTracking.stopAllTracking();
        this.realTimeTracking.disableMap();
        this.realTimeTracking.clearTrucks();
        this.mapService.initializeMap("map", this.mapConstant.mapOptions, 13, L);
      })
    }
  }

  addTruck(): Promise<void> {
    return new Promise((resolve, reject) => {
      let filteredLoads = this.loads.filter(load => 
        load.status !== undefined && 
        (load.status >= Statuses.SCHEDULE_FOR_PICKUP && load.status < Statuses.DELIVERED)
      );
      if (filteredLoads.length === 0) {
        this.realTimeTracking.disableMap();
        this.notificationService.error(this.translate.instant(ErrorMessages.NO_LOADS_ENROUTE));
        resolve(); 
        return;
      }
    let promises = filteredLoads.map(load => {
        return new Promise<void>((resolveTruck) => {
          this.realTimeTracking.setTruckAddress(load, false);
          resolveTruck();
        });
      });
      Promise.all(promises).then(() => {
        resolve();
      }).catch(reject);
    });
  }

  onCityChange(event: Event) {
    this.realTimeTracking.clearTrucks();
      const target = event.target as HTMLSelectElement;
      this.city=target.value;
      const params = new HttpParams()
        .set('cityType', this.cityType)
        .set('cityValue', target.value);
      this.getCityLoads(params);
  }

  onCityTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const params = new HttpParams().set('cityType', target.value);

    this.httpURIService.requestGET<any>(URIKey.GET_ALL_CITIES, params).subscribe(response => {
      this.cities=response;
      this.city = '';
    })
  }

  getCityLoads(params:any){
    this.httpURIService.requestGET(URIKey.GET_CITY_LOADS, params).subscribe(response => {
      if (!(response instanceof HttpErrorResponse)) {
        this.realTimeTracking.stopAllTracking();
        this.realTimeTracking.trucks=[];
        this.cdr.detectChanges();
        this.loads = response as any;
        this.addTruck().then(() => {
          this.realTimeTracking.enableMap();
          this.realTimeTracking.simulateALLTruck();
        })
      }
    })
  }

  onRefresh(){
    this.realTimeTracking.clearTrucks();
    const params = new HttpParams()
    .set('cityType', this.cityType)
    .set('cityValue', this.city);
    this.getCityLoads(params);
  }
}

