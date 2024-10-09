import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  isDropdownVisible = false;
  isNotificationsVisible = false;
  searchForm!: FormGroup;
  notifications = [
    {
      imgSrc: '',
      title: 'Salena Layfield',
      message: 'As a skeptical Cambridge friend of mine occidental.',
      timeAgo: '1 hour ago'
    },
  ];
  direction: string = 'ltr';
  constructor(private sidebarService: SidebarService, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    this.sidebarService.currentSubModule = localStorage.getItem('currentSubModule') ?? 'brokerDashboard';
    this.closeSidebarMenu();
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.required)
    });
  }
  closeSidebarMenu(): void {
    if (isPlatformBrowser(this.platformId)) {
      const subMenus = document.querySelectorAll('#sidebar-menu .sub-menu');
      subMenus.forEach(menu => {
        (menu as HTMLElement).style.display = 'none';
        menu.setAttribute('aria-expanded', 'false');
      });
    }
  }

  toggleMenu(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const submenu = target.nextElementSibling as HTMLElement;
  
    if (submenu && submenu.classList.contains('sub-menu')) {
      const isExpanded = submenu.getAttribute('aria-expanded') === 'true';
      submenu.style.display = isExpanded ? 'none' : 'block';
      submenu.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      localStorage.setItem('menuState' + submenu.id, isExpanded ? 'false' : 'true'); // Saving state per submenu

      if (window.innerWidth <= 992) {
        const links = submenu.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('click', () => {
            const body = document.body;
            body.classList.remove('sidebar-enable'); // Hide the sidebar
            localStorage.setItem('sidebarState', 'collapsed'); // Store collapsed state
          });
        });
      }
    }
  }
  
  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
    this.isNotificationsVisible = false;
  }
  toggleNotifications(): void {
    this.isNotificationsVisible = !this.isNotificationsVisible;
    this.isDropdownVisible = false;
  }
  handleMenuClick(event: Event) {
    const target = event.target as HTMLElement;
    const linkElement = target.closest('a[routerLink]');
    if (linkElement) {
      const routerLink = linkElement.getAttribute('routerLink');
      if (routerLink) {
        this.onModuleClick(routerLink);
      }
    }
  }
  
  onModuleClick(route: string) {
    const routeParts = route.split('/').filter(part => part.length > 0);
    const lastRoutePart = routeParts[routeParts.length - 1];
    this.sidebarService.currentSubModule = lastRoutePart;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentSubModule',lastRoutePart);
    }
  }
  
}
