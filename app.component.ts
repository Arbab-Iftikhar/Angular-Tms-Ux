import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './shared/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TMSUX';
  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.OSM_MAP='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.languageService.OSM_SEARCH_ENGINE='https://nominatim.openstreetmap.org/search';
    this.languageService.OSM_GET_ADDRESS_FROM_COORDINATES='https://nominatim.openstreetmap.org/reverse';
    this.languageService.initializeLanguage();
    this.hideSideBarbyDefault();
  }

  hideSideBarbyDefault()
  {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 992) {
        const body = document.body;
        const isSidebarEnabled = body.classList.toggle('sidebar-enable');
      }
    }
  }
}
