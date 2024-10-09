import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as L from 'leaflet';
import { LanguageService } from './language.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: L.Map | undefined;

  constructor(private languageService: LanguageService, @Inject(PLATFORM_ID) private platformId: Object,) { }

  initializeMap(mapId: string, mapOptions: { lat: number, lng: number }, zoom: number, L: any) {
    if (this.map) {
      this.map.remove();
    }
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        this.map = leaflet.map(mapId).setView([mapOptions.lat, mapOptions.lng], zoom);
        leaflet.tileLayer(this.languageService.OSM_MAP).addTo(this.map);
      })
    }  
    } 
}