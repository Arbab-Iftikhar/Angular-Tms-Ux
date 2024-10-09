import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class SharedFormService {
  edit: boolean;
  activeModal: string;
  username: string;
  email: string;
  password: string; 
  confirmPassword: string; 
  countryCode: string; 
  phone: string;
  isOtpRequired: boolean;
  activeDropdown: string;
  suggestions: any[];
  searchTimeout: any;
  debounceTime = 500;
  constructor(private http: HttpClient, private languageService: LanguageService) {
    this.edit = false;
    this.activeModal = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.countryCode = '';
    this.phone = '';
    this.isOtpRequired = false;
    this.activeDropdown = '';
    this.suggestions = [];
    this.searchTimeout = null;
  }

  onAddressInput(event: Event, fieldType: string): void {
    const input = (event.target as HTMLInputElement).value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.onAddressSearch(input, fieldType);
    }, this.debounceTime);
  }

  onAddressSearch(input: string, fieldName: string) {
    this.activeDropdown = fieldName;
    if (input.length > 2) {
      this.searchAddress(input).subscribe((results) => {
        this.suggestions = results;
      });
    } else {
      this.suggestions = [];
    }
  }

  searchAddress(query: string) {
    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      countrycodes: 'ca,us'
    };

    return this.http.get<any[]>(this.languageService.OSM_SEARCH_ENGINE, { params }).pipe(
      map((results) => {
        return results.map((result) => {
          return {
            displayName: result.display_name,
            lat: result.lat,
            lon: result.lon,
            city: result.address.city || result.address.independent_city || result.address.county,
            state: result.address.state
          };
        });
      })
    );
  }

  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
    const url = `${this.languageService.OSM_GET_ADDRESS_FROM_COORDINATES}?lat=${latitude}&lon=${longitude}&format=json`;
    
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data.display_name;
    }
    return null;
}

}
