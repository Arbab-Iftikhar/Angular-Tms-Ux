import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormConstants, HiddenValues } from '../utils/enums';

@Injectable(
    { providedIn: 'root' }
)
export class HttpService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private setLoading(loading: boolean) {
        this.loadingSubject.next(loading);
    }
    
    constructor(private http: HttpClient) {

    }

    requestPOST<T>(url: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        this.setLoading(true);
        if (headers == undefined) {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        headers = headers.set(FormConstants.POR_ORGACODE, HiddenValues.POR_ORGACODE).set(FormConstants.CHANNEL_CODE, HiddenValues.CHANNEL_CODE)
        if (params == undefined) {
            return this.http.post<T>(url, body, { headers: headers })
        } else {
            url = this.substituePathVariables(url, params);
            return this.http.post<T>(url, body, { params: params, headers: headers });
        }
    }
    requestPOSTMultipart<T>(url: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        this.setLoading(true);
        if (headers == undefined) {
            headers = new HttpHeaders();
        }
        headers = headers.set(FormConstants.POR_ORGACODE, HiddenValues.POR_ORGACODE).set(FormConstants.CHANNEL_CODE, HiddenValues.CHANNEL_CODE)
        if (params == undefined) {
            return this.http.post<T>(url, body, { headers: headers })
        } else {
            url = this.substituePathVariables(url, params);
            return this.http.post<T>(url, body, { params: params, headers: headers });
        }
    }


    requestGET<T>(url: string, reqParams?: HttpParams): Observable<T> {
        this.setLoading(true);
        let httpHeaders: HttpHeaders = new HttpHeaders();
            httpHeaders = httpHeaders.set(FormConstants.POR_ORGACODE,HiddenValues.POR_ORGACODE).set(FormConstants.CHANNEL_CODE,HiddenValues.CHANNEL_CODE);
        if (reqParams == undefined) {
            return this.http.get<T>(url, { headers: httpHeaders })
        } else {
            url = this.substituePathVariables(url, reqParams);
            return this.http.get<T>(url, { params: reqParams, headers: httpHeaders });
        }

    }

    requestDELETE<T>(url: string, reqParams: HttpParams): Observable<T> {
        this.setLoading(true);
        url = this.substituePathVariables(url, reqParams);
        let httpHeaders: HttpHeaders = new HttpHeaders().set(FormConstants.POR_ORGACODE,HiddenValues.POR_ORGACODE).set(FormConstants.CHANNEL_CODE,HiddenValues.CHANNEL_CODE);
        if (reqParams.keys().length > 0) {
            return this.http.delete<T>(url, { params: reqParams, headers: httpHeaders });
        }
        else {
            return this.http.delete<T>(url, { headers: httpHeaders });
        }
    }

    requestPATCH<T>(url: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        this.setLoading(true);
        if (headers == undefined) {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        if (params != undefined) {
            url = this.substituePathVariables(url, params);
        }
        headers = headers.set(FormConstants.POR_ORGACODE,HiddenValues.POR_ORGACODE).set(FormConstants.CHANNEL_CODE, HiddenValues.CHANNEL_CODE);
        return this.http.patch<T>(url, body, { headers: headers, params: params });
    }

    private substituePathVariables(url: string, params: HttpParams): string {
        params.keys().forEach(param => {
            let pathVariable: string = `{${param}}`;
            let pathValue = params.get(param);
            if (url.includes(pathVariable) && pathValue != null) {
                url = url.replace(pathVariable, pathValue);
                params.delete(param);
            }
        });
        return url;
    }
}