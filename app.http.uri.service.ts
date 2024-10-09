import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, Observer } from 'rxjs';
import { HttpService } from './shared/services/http.service';
import { URIService } from './app.uri';
import { URIKey } from './shared/utils/uri-enums';

@Injectable(
    { providedIn: 'root' }
)
export class HttpURIService {

    constructor(private http: HttpService, private uriService: URIService) {
    }

    requestGET<T>(uriKey: URIKey | string, params?: HttpParams): Observable<T> {
        return new Observable((observer: Observer<any>) => {
            this.uriService.canSubscribe.pipe(filter(val => val)).subscribe(val => {
                let uri: string = this.uriService.getURIForRequest(uriKey as URIKey)
                this.http.requestGET<T>(uri, params).subscribe(t => {
                    observer.next(t),
                    observer.complete()
                },
                error => {   
                    console.error(error);                        
                    observer.next(error),
                    observer.complete()
                });
            });
        });
    }

    requestPOST<T>(uriKey: URIKey | string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return new Observable((observer: Observer<any>) => {
            this.uriService.canSubscribe.pipe(filter(val => val)).subscribe(val => {
                let uri: string = this.uriService.getURIForRequest(uriKey as URIKey)
                this.http.requestPOST<T>(uri, body, headers, params).subscribe(
                    t => {
                        observer.next(t),
                            observer.complete()
                    },
                    error => {
                        console.error(error);                        
                        observer.next(error),
                            observer.complete()
                    }
                );
            });
        });
    }

    requestPOSTMultipart<T>(uriKey: URIKey | string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return new Observable((observer: Observer<any>) => {
            this.uriService.canSubscribe.pipe(filter(val => val)).subscribe(val => {
                let uri: string = this.uriService.getURIForRequest(uriKey as URIKey)
                this.http.requestPOSTMultipart<T>(uri, body, headers, params).subscribe(
                    t => {
                        observer.next(t),
                            observer.complete()
                    },
                    error => {
                        console.error(error);                        
                        observer.next(error),
                            observer.complete()
                    }
                );
            });
        });
    }

    requestDELETE<T>(uriKey: URIKey | string, params: HttpParams): Observable<T> {
        return new Observable((observer: Observer<any>) => {
            this.uriService.canSubscribe.pipe(filter(val => val)).subscribe(val => {
                let uri: string = this.uriService.getURIForRequest(uriKey as URIKey)
                this.http.requestDELETE<T>(uri, params).subscribe(t => {
                    observer.next(t),
                        observer.complete()
                },
                    error => {
                        console.error(error);                        
                        observer.next(error),
                            observer.complete()
                    }
                );
            });
        });
    } 

    requestPATCH<T>(uriKey: URIKey | string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return new Observable((observer: Observer<any>) => {
            this.uriService.canSubscribe.pipe(filter(val => val)).subscribe(val => {
                let uri: string = this.uriService.getURIForRequest(uriKey as URIKey)
                this.http.requestPATCH<T>(uri, body, headers, params).subscribe(t => {
                    observer.next(t),
                        observer.complete()
                },
                    error => {
                        console.error(error);                        
                        observer.next(error),
                            observer.complete()
                    }
                );
            });
        }); 
    }
}

