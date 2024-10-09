import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class MapConstant {
    readonly interval: number;
    readonly originIcon :string;
    readonly truckIcon :string;
    readonly locationIcon :string;
    readonly destinationIcon :string;
    readonly prefix : string;
    readonly length : number;
    mapOptions = {
        lat: 48.8566,
        lng: 2.3522
    };    
    constructor() {
        this.interval = 100;
        this.originIcon= 'assets/images/origin.png';
        this.truckIcon= 'assets/images/truck.png';
        this.destinationIcon= 'assets/images/destination.png';
        this.locationIcon= 'assets/images/location.png';
        this.prefix = 'T';
        this.length = 7;
    }
}