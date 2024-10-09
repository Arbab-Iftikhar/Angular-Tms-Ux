import * as L from 'leaflet';
import 'leaflet-routing-machine';
export class Truck {
    shipmentId: number;
    marker: L.Marker;
    routeIndex: number;
    origin: L.LatLng;
    destination: L.LatLng;
    traveledRoutingControl?:L.Routing.Control;
    remainingRoutingControl?: L.Routing.Control;
    routingControl?: L.Routing.Control;
    originAlertShown: boolean;
    destinationAlertShown: boolean;
    originRadius: number;
    destinationRadius: number;
    routeCoordinates: L.LatLng[]; 
    constructor() {
        this.shipmentId = 0;
        this.marker = L.marker([0, 0]);
        this.routeIndex = 0;
        this.origin = L.latLng(0, 0);
        this.destination = L.latLng(0, 0);
        this.originAlertShown = false;
        this.destinationAlertShown = false;
        this.traveledRoutingControl = undefined;
        this.remainingRoutingControl = undefined;
        this.routingControl = undefined;
        this.originAlertShown= false;
        this.destinationAlertShown= false;
        this.originRadius= 0;
        this.destinationRadius= 0;
        this.routeCoordinates = [];
    }
}