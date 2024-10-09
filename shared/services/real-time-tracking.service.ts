import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MapService } from './map.service';
import { MapConstant } from '../utils/map.constant';
import { isPlatformBrowser } from '@angular/common';
import { Load } from '../../load/load-management/load-management.metadata';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { URIKey } from '../utils/uri-enums';
import { HttpURIService } from '../../app.http.uri.service';
import { NotificationService } from './notification.service';
import { ErrorMessages } from '../utils/enums';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoadService } from './loadData.service';
import { SharedFormService } from './shared-form.service';

@Injectable({
  providedIn: 'root'
})
export class RealTimeTrackingService {

  trucks: any[];
  mapOpacity: number;
  isRealTimeTrackingEnabled: boolean;
  tab: string;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapService: MapService, private mapConstant: MapConstant, private notificationService: NotificationService, private httpURIService: HttpURIService, private translate: TranslateService, private route: Router, private loadService: LoadService, private sharedFormService: SharedFormService) {
    this.trucks = [];
    this.mapOpacity = 1;
    this.isRealTimeTrackingEnabled = false;
    this.tab = '';
  }

  async setTruckAddress(load: Load, isTruckEmpty: boolean) {
    this.trucks = isTruckEmpty ? [] : this.trucks;
    let newTruck: any = {};
    newTruck.shipmentId = load.shipmentId;
    newTruck.origin = { lat: load.pickUpLat, lng: load.pickUpLang };
    newTruck.destination = { lat: load.dropOfLat, lng: load.dropOfLang };
    newTruck.originRadius = load.originRadius;
    newTruck.destinationRadius = load.destinationRadius;
    this.addOriginMarker(newTruck, load);
    this.addDestinationMarker(newTruck, load);
    this.trucks.push(newTruck);
  }

  async addOriginMarker(newTruck: any, load: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        const origin = newTruck?.origin;
        if (this.mapService.map && origin) {
          this.mapService.map.setView([origin.lat, origin.lng], 13);
          newTruck.originMarker = leaflet.marker([origin.lat, origin.lng], {
            icon: leaflet.icon({
              iconUrl: this.mapConstant.originIcon,
              iconSize: [80, 80],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41],
              className: 'rotated-icon'
            }),
            title: `origin-${newTruck.shipmentId}`
          }).bindPopup(`<span style="font-size: 15px; font-weight: bold;">Pick Up : </span> ${load.originAddress}`).addTo(this.mapService.map);
          const radiusInMeters = newTruck.originRadius * 1609.34;
          newTruck.originCircle = leaflet.circle([origin.lat, origin.lng], {
            color: 'red',
            fillColor: '#00FF00',
            fillOpacity: 0.1,
            radius: radiusInMeters
          }).addTo(this.mapService.map);
        }
      })
    }
  }

  async addDestinationMarker(newTruck: any, load: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        const destination = newTruck?.destination;
        if (this.mapService.map && destination) {
          this.mapService.map.setView([destination.lat, destination.lng], 13);
          newTruck.destinationMarker = leaflet.marker([destination.lat, destination.lng], {
            icon: leaflet.icon({
              iconUrl: this.mapConstant.destinationIcon,
              iconSize: [35, 35],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41]
            }),
            title: `destination-${newTruck.shipmentId}`
          }).bindPopup(`<span style="font-size: 15px; font-weight: bold;">Drop Off : </span>${load.destinationAddress}`).addTo(this.mapService.map);
          const radiusInMeters = newTruck.destinationRadius * 1609.34;
          newTruck.destinationCircle = leaflet.circle([destination.lat, destination.lng], {
            color: 'red',
            fillColor: '#00FF00',
            fillOpacity: 0.1,
            radius: radiusInMeters
          }).addTo(this.mapService.map);
        }
      })
    }
  }

  async getTruckFullRoute(load: Load) {
    this.clearTrucks();
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(async L => {
        const leaflet = L.default || L;
        const truck = this.trucks.find(t => t.shipmentId === load.shipmentId);
        if (truck && this.mapService.map) {
          const params = new HttpParams().set('shipmentId', load.shipmentId);
          await this.httpURIService.requestGET<any>(URIKey.GET_SHIPMENT_COORDINATES, params).subscribe(async (response: any) => {
            if (!(response instanceof HttpErrorResponse)) {
              if (response && response.hasOwnProperty('data')) {
                truck.emptyMilesCoordinates = response.data?.emptyMiles?.coordinates || [];
                truck.enrouteCoordinates = response.data?.enroute?.coordinates || [];
                if (this.mapService.map) {
                  const startLocationAddress = await this.sharedFormService.getAddressFromCoordinates(truck.emptyMilesCoordinates[0].latitude, truck.emptyMilesCoordinates[0].longitude);
                  truck.startLocationMarker = leaflet.marker([truck.emptyMilesCoordinates[0].latitude, truck.emptyMilesCoordinates[0].longitude], {
                    icon: leaflet.icon({
                      iconUrl: this.mapConstant.locationIcon,
                      iconSize: [50, 50],
                      iconAnchor: [12, 41],
                      popupAnchor: [0, -41],
                    }),
                    title: `origin-${truck.shipmentId}`
                  }).bindPopup(`<span style="font-size: 15px; font-weight: bold;">Start Location : </span> ${startLocationAddress}`).addTo(this.mapService.map!);
                 
                  truck.originMarker = leaflet.marker([truck.origin.lat, truck.origin.lng], {
                    icon: leaflet.icon({
                      iconUrl: this.mapConstant.originIcon,
                      iconSize: [80, 80],
                      iconAnchor: [12, 41],
                      popupAnchor: [0, -41],
                      className: 'rotated-icon'
                    }),
                    title: `origin-${truck.shipmentId}`
                  }).bindPopup(`<span style="font-size: 15px; font-weight: bold;">Pick Up : </span> ${load.originAddress}`).addTo(this.mapService.map);
        
                  truck.destinationMarker = leaflet.marker([truck.destination.lat, truck.destination.lng], {
                    icon: leaflet.icon({
                      iconUrl: this.mapConstant.destinationIcon,
                      iconSize: [35, 35],
                      iconAnchor: [12, 41],
                      popupAnchor: [0, -41]
                    }),
                    title: `destination-${truck.shipmentId}`
                  }).bindPopup(`<span style="font-size: 15px; font-weight: bold;">Drop Off : </span>${load.destinationAddress}`).addTo(this.mapService.map);
        
                  truck.startLocationMarker.setLatLng([truck.emptyMilesCoordinates[0].latitude, truck.emptyMilesCoordinates[0].longitude])
                  truck.originMarker.setLatLng([truck.origin.lat, truck.origin.lng]);
                  truck.destinationMarker.setLatLng([truck.destination.lat, truck.destination.lng]);

                  const emptyMilesLatLngs = truck.emptyMilesCoordinates.map((coord: any) => [parseFloat(coord.latitude), parseFloat(coord.longitude)]);
                  leaflet.polyline(emptyMilesLatLngs, { color: 'red' }).addTo(this.mapService.map);
                  const enrouteLatLngs = truck.enrouteCoordinates.map((coord: any) => [parseFloat(coord.latitude), parseFloat(coord.longitude)]);
                  leaflet.polyline(enrouteLatLngs, { color: 'green' }).addTo(this.mapService.map);
                  
                  this.mapService.map.fitBounds(truck.startLocationMarker.getLatLng().concat(truck.originMarker.getLatLng(), truck.destinationMarker.getLatLng()));
                }
              }
              else {
                this.notificationService.error(this.translate.instant(ErrorMessages.RECORD_NOT_FOUND));
              }
            }
          });
        }
      });
    }
  }

  showTracking() {
    this.isRealTimeTrackingEnabled = true;
  }

  hideTracking() {
    this.isRealTimeTrackingEnabled = false;
  }

  enableMap() {
    this.mapOpacity = 1;
  }

  disableMap() {
    this.mapOpacity = 0.5;
  }

  async realTimetruckMovement() {
    const truck = this.trucks.find(t => t.shipmentId === this.loadService.load.shipmentId);
    if (!truck) return;
    truck.currentIndex = truck.currentIndex || 0;
    truck.isMapCentered = truck.isMapCentered || false;
    if (this.tab === 'tracking') {
      this.createTruckPolyLine(truck);

      if (!truck.trackingMarker) {
        this.createTrackingTruckMarker(truck);
      }
      const fetchAndUpdate = async () => {
        const params = new HttpParams().set('shipmentId', this.loadService.load.shipmentId);
        await this.httpURIService.requestGET<any>(URIKey.GET_SHIPMENT_COORDINATES, params).subscribe((response: any) => {
          if (!(response instanceof HttpErrorResponse)) {
            if (response && response.hasOwnProperty('data')) {
              const emptyMilesCoordinates = response.data?.emptyMiles?.coordinates || [];
              const enrouteCoordinates = response.data?.enroute?.coordinates || [];

              truck.coordinates = [...emptyMilesCoordinates, ...enrouteCoordinates];
              if (truck.coordinates.length < 1) {
                this.notificationService.error(this.translate.instant(ErrorMessages.EMPTY_COORDINATES));
              }
              if (!truck.isMapCentered && truck.coordinates.length > 0) {
                this.initiateTruckJourney(truck);
              }
              else {
                this.animateTruckJourney(truck);
              }
            } else {
              this.notificationService.error(this.translate.instant(ErrorMessages.RECORD_NOT_FOUND));
            }
          }
        });
        truck.timeoutId = setTimeout(fetchAndUpdate, 60 * 1000);
      };
      fetchAndUpdate();
    }
  }

  createTruckPolyLine(truck: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        truck.polyline = leaflet.polyline([], {
          color: 'blue',
          weight: 5,
          opacity: 0.7,
          smoothFactor: 1
        }).addTo(this.mapService.map!);
      })
    }
  }

  async createTrackingTruckMarker(truck: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        truck.trackingMarker = leaflet.marker([0, 0], {
          icon: leaflet.icon({
            iconUrl: this.mapConstant.truckIcon,
            iconSize: [60, 60],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41],
          }),
          title: `origin-${truck.shipmentId}`
        }).addTo(this.mapService.map!);
      })
    }
  }

  async initiateTruckJourney(truck: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(async L => {
        const leaflet = L.default || L;
        truck.startLocation = {
          lat: truck.coordinates[0].latitude,
          lng: truck.coordinates[0].longitude
        };
        this.mapService.map?.setView([truck.startLocation.lat, truck.startLocation.lng], 13);
        truck.currentIndex = truck.coordinates.length - 1;
        const startLocationAddress = await this.sharedFormService.getAddressFromCoordinates(truck.startLocation.lat, truck.startLocation.lng);
        truck.startLocationMarker = leaflet.marker([truck.startLocation.lat, truck.startLocation.lng], {
          icon: leaflet.icon({
            iconUrl: this.mapConstant.locationIcon,
            iconSize: [50, 50],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41],
          }),
          title: `origin-${truck.shipmentId}`
        }).bindPopup(`<span style="font-size: 15px; font-weight: bold;">Start Location : </span> ${startLocationAddress}`).addTo(this.mapService.map!);

        truck.trackingMarker.setLatLng([truck.coordinates[truck.coordinates.length - 1].latitude, truck.coordinates[truck.coordinates.length - 1].longitude]);
        this.drawRoadPolyline(truck);
        truck.isMapCentered = true;
      });
    }
  }

  drawRoadPolyline(truck: any) {
    if (truck.coordinates.length > 0) {
      if (isPlatformBrowser(this.platformId)) {
        import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
          const leaflet = L.default || L;
          const latLngs = truck.coordinates.map((coord: any) => [coord.latitude, coord.longitude]);
          truck.polyline = leaflet.polyline(latLngs, {
            color: 'blue',
            weight: 5,
            opacity: 0.6
          });
          this.mapService.map?.addLayer(truck.polyline);
        });
      }
    }
  }

  updateTruckPositionAndPolyline(coordinates: any[], truck: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        const currentCoord = coordinates[truck.currentIndex];
        const nextCoord = coordinates[truck.currentIndex + 1];
        if (currentCoord) {
          truck.trackingMarker.setLatLng([currentCoord.latitude, currentCoord.longitude]);
          if (nextCoord) {
            const animateMarker = (startCoord: L.LatLng, endCoord: L.LatLng, duration: number) => {
              const startTime = Date.now();
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const lat = startCoord.lat + (endCoord.lat - startCoord.lat) * progress;
                const lng = startCoord.lng + (endCoord.lng - startCoord.lng) * progress;
                truck.trackingMarker.setLatLng([lat, lng]);
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  truck.polyline.addLatLng([endCoord.lat, endCoord.lng]);
                }
              };
              animate();
            };
            const duration = 2000;
            animateMarker(
              leaflet.latLng([currentCoord.latitude, currentCoord.longitude]),
              leaflet.latLng([nextCoord.latitude, nextCoord.longitude]),
              duration
            );
          }
        }
      });
    }
  }


  stopAllTracking() {
    this.trucks.forEach(truck => {
      if (truck.intervalId) {
        clearInterval(truck.intervalId);
        truck.intervalId = null;
      }
      if (truck.timeoutId) {
        clearTimeout(truck.timeoutId);
        truck.timeoutId = null;
      }
    });
  }

  async currentLocation(load: Load) {
    this.stopAllTracking();
    const truck = this.trucks.find(t => t.shipmentId === load.shipmentId);
    if (truck && isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(async L => {
        const leaflet = L.default || L;
        if (this.mapService.map) {
          const markerLatLng = truck.trackingMarker.getLatLng();
          const latitude = markerLatLng.lat;
          const longitude = markerLatLng.lng;
          const currentLocationAddress = await this.sharedFormService.getAddressFromCoordinates(latitude, longitude);
          const popupContent = `<span style="font-size: 15px; font-weight: bold;">Current Loaction : </span>${currentLocationAddress}`;
          const popupDuration = 5000;

          if (truck.trackingMarker) {
            truck.trackingMarker.bindPopup(popupContent).openPopup();
            setTimeout(() => {
              truck.trackingMarker.closePopup();
            }, popupDuration);

            if (!this.mapService.map.hasLayer(truck.trackingMarker)) {
              truck.trackingMarker.addTo(this.mapService.map);
            }
          } else {
            truck.trackingMarker = leaflet.marker([latitude, longitude])
              .addTo(this.mapService.map)
              .bindPopup(popupContent)
              .openPopup();
            setTimeout(() => {
              truck.trackingMarker.closePopup();
            }, popupDuration);
          }
        }
      })
    }
  }


  async simulateALLTruck() {
    let currentRoute = this.route.url;
    if (currentRoute === '/home/load/enRouteLoads') {
      if (isPlatformBrowser(this.platformId)) {
        import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(async L => {
          const leaflet = L.default || L;
          const allPromises = this.trucks.map(async (truck) => {
            this.createTruckPolyLine(truck);

            if (!truck.trackingMarker) {
              this.createTrackingTruckMarker(truck);
            }
            truck.currentIndex = 0;
            const params = new HttpParams().set('shipmentId', truck.shipmentId);
            truck.polyline = leaflet.polyline([], {
              color: 'blue',
              weight: 5,
              opacity: 0.5,
              smoothFactor: 1
            }).addTo(this.mapService.map!);

            const response = await this.httpURIService.requestGET<any>(URIKey.GET_SHIPMENT_COORDINATES, params).toPromise();
            if (response && response.hasOwnProperty('data')) {
              const emptyMilesCoordinates = response.data?.emptyMiles?.coordinates || [];
              const enrouteCoordinates = response.data?.enroute?.coordinates || [];

              truck.coordinates = [...emptyMilesCoordinates, ...enrouteCoordinates];
              if (truck.coordinates.length < 1) {
                this.notificationService.error(this.translate.instant(ErrorMessages.EMPTY_COORDINATES));
              }
              if (!truck.isMapCentered && truck.coordinates.length > 0) {
                this.initiateTruckJourney(truck);
              }
              else {
                this.animateTruckJourney(truck);
              }
            }
          });
          await Promise.all(allPromises);
          this.trucks.forEach((truck) => {
            if (truck.coordinates.length > 0) {
              this.animateTruckJourney(truck);
            }
          });
        })
      }
    } else {
      this.stopAllTracking();
    }
  }

  animateTruckJourney(truck: any) {
    truck.intervalId = setInterval(() => {
      if (truck.currentIndex < truck.coordinates.length && truck.intervalId) {
        this.updateTruckPositionAndPolyline(truck.coordinates, truck);
        truck.currentIndex++;
      } else {
        clearInterval(truck.intervalId);
        truck.intervalId = null;
      }
    }, this.mapConstant.interval);
  }

  clearTrucks() {
    if (this.mapService.map) {
      this.trucks.forEach(truck => {
        if (truck.trackingMarker) {
          this.mapService.map?.removeLayer(truck.trackingMarker);
        }
        if (truck.polyline) {
          this.mapService.map?.removeLayer(truck.polyline);
        }
        if (truck.originCircle) {
          this.mapService.map?.removeLayer(truck.originCircle);
        }
        if (truck.destinationCircle) {
          this.mapService.map?.removeLayer(truck.destinationCircle);
        }
        if (truck.destinationMarker) {
          this.mapService.map?.removeLayer(truck.destinationMarker);
        }
        if (truck.startLocationMarker) {
          this.mapService.map?.removeLayer(truck.startLocationMarker);
        }
        if (truck.originMarker) {
          this.mapService.map?.removeLayer(truck.originMarker);
        }
      });
    }
  }

  updateAllTruckPositionAndPolyline(coordinates: any[], truck: any) {
    if (isPlatformBrowser(this.platformId)) {
      import(/* webpackChunkName: "leaflet-chunk" */ 'leaflet').then(L => {
        const leaflet = L.default || L;
        const currentCoord = coordinates[truck.currentIndex];
        const nextCoord = coordinates[truck.currentIndex + 1];
        if (currentCoord) {
          if (nextCoord) {
            truck.trackingMarker.setLatLng([currentCoord.latitude, currentCoord.longitude]);
            truck.polyline.addLatLng([currentCoord.latitude, currentCoord.longitude]);
          }
        }
      });
    }
  }
}