import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../services/sidebar.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessages } from '../../utils/enums';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  isDropdownVisible: boolean;
  isNotificationsVisible: boolean;
  notifications = [
    {
      imgSrc: '',
      title: 'Salena Layfield',
      message: 'As a skeptical Cambridge friend of mine occidental.',
      timeAgo: '1 hour ago'
    },
  ];
  direction: string = 'ltr';
   fullName = localStorage.getItem('name');  
   firstName = this.fullName?.split(' ')[0];
  constructor(private router: Router, private route: ActivatedRoute,public sidebarService: SidebarService,private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object, private notificationService: NotificationService) {
    this.isDropdownVisible = false;
    this.isNotificationsVisible = false;
  }
  ngOnInit(): void {
    this.initializeVerticalMenuToggle();
    this.initializeFullscreenToggle();
    const body = document.body;
    const isCollapsed = body.classList.toggle('sidebar-enable'); 
    localStorage.setItem('sidebarState', isCollapsed ? 'expanded' : 'collapsed');
  }
  initializeVerticalMenuToggle(): void {
    if (isPlatformBrowser(this.platformId)) {
      const verticalMenuBtn = document.getElementById('vertical-menu-btn');
      if (window.innerWidth <= 992) {
      const body = document.body;
      body.classList.add('vertical-collpsed');
      }
      if (verticalMenuBtn) {
        verticalMenuBtn.addEventListener('click', this.toggleSidebar.bind(this));
      }
    }
  }
  initializeFullscreenToggle(): void {
    if (isPlatformBrowser(this.platformId)) {
      const fullscreenButton = document.querySelector<HTMLButtonElement>('[data-bs-toggle="fullscreen"]');
      if (fullscreenButton) {
        fullscreenButton.addEventListener("click", () => {
          if (!document.fullscreenElement) {
            this.toggleFullscreen(true);
          } else {
            this.toggleFullscreen(false);
          }
        });
      }
    }
  }

  toggleFullscreen(enter: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (enter) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      document.body.classList.toggle('fullscreen-enable', enter);
    }
  }

  toggleSidebar(): void {
    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;
      const isSidebarEnabled = body.classList.toggle('sidebar-enable');
      if (window.innerWidth >= 992) {
        const isCollapsed = body.classList.toggle('vertical-collpsed'); 
        localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
        if (isCollapsed) {
          const subMenus = document.querySelectorAll('.sub-menu');
          subMenus.forEach(menu => {
            (menu as HTMLElement).style.display = '';
            menu.setAttribute('aria-expanded', 'false');
          });
        } else {
          const subMenus = document.querySelectorAll('.sub-menu');
          subMenus.forEach(menu => {
            (menu as HTMLElement).style.display = 'none';
            menu.setAttribute('aria-expanded', 'false');
          });
        }
      } else {
         body.classList.remove('vertical-collpsed');
        localStorage.setItem('sidebarState', 'expanded');
          const subMenus = document.querySelectorAll('.sub-menu');
      subMenus.forEach(menu => {
        (menu as HTMLElement).style.display = 'none';
        menu.setAttribute('aria-expanded', 'false');
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

  // toggleSidebar() {
  //   this.sidebarService.toggleSidebar();
  // }
  logout() {
    this.notificationService.success(this.translate.instant(SuccessMessages.USER_LOGOUT));
    this.router.navigate(['/auth/login']);
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const isClickInsideDropdown = targetElement.closest('.dropdown');
    if (!isClickInsideDropdown) {
      this.isDropdownVisible = false;
    }
  }
}
