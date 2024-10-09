
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { URIKey } from './shared/utils/uri-enums';
@Injectable({
    providedIn: 'root',
})
export class URIService {
    canSubscribe: BehaviorSubject<boolean>;
    uriMap: Map<URIKey, string>;

    constructor(private http: HttpClient) {
        this.canSubscribe = new BehaviorSubject(<boolean>false);
        this.uriMap = new Map<URIKey, string>();
        this.loadURIs();
    }

    loadURIs(): void {
        this.http.get<URIInfo[]>('assets/data/app.uri.json')
            .subscribe(data => {
                for (const item of data) {
                    const baseURI = environment.moduleHost.get(item.Id) as string;
                    if (baseURI) {
                        for (const module of item.Modules) {
                            for (const page of module.Pages) {
                                const uri = `${baseURI}${module.URI}${page.URI}`;
                                const key = URIKey[page.UUID as keyof typeof URIKey];
                                if (key !== undefined) {
                                    this.uriMap.set(key, uri);
                                }
                            }
                        }
                    }
                }
                this.canSubscribe.next(true);
            });
    }
    

    getURI(key: URIKey): string | undefined {
        return this.uriMap.get(key);
    }

    getURIForRequest(key: URIKey): string {
        let uri = this.getURI(key as URIKey);

        if (uri != undefined) {
            return uri;
        }
        else {
            let arr = key.split("/");
            if (arr.length) {
                let db = arr[0];
                let baseurl = environment.moduleHost.get(db.toUpperCase() + "_DOMAIN_URI");
                if (baseurl != undefined) {
                    uri = (baseurl).concat("/").concat(key);
                    return uri;
                }
            }
        }
        return key;
    }
}


export interface URIInfo {
    Id: string;
    URI: string;
    Modules: URIModule[];
}

interface URIModule {
    Id: string;
    URI: string;
    Pages: URIPage[];
}

interface URIPage {
    Id: string;
    URI: string;
    UUID: string;
}