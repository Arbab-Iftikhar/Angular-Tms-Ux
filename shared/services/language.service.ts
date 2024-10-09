import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  OSM_MAP!:string;
  OSM_SEARCH_ENGINE !:string;
  OSM_GET_ADDRESS_FROM_COORDINATES!:string;
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.initializeLanguage(); 
  }

  private setDirection(language: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const direction = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('selectedLanguage', language);
      localStorage.setItem('direction', direction);
      document.documentElement.setAttribute('dir', direction); 
    }
  }

  setLanguage(language: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(language);
      this.setDirection(language);
    }
  }

  initializeLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      this.translate.setDefaultLang(savedLanguage);
      this.translate.use(savedLanguage); 
      this.setDirection(savedLanguage);
    }
  }

  getLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('selectedLanguage') || 'en';
    }
    return 'en'; 
  }

  getDirection(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('direction') || 'ltr';
    }
    return 'ltr'; 
  }
}
