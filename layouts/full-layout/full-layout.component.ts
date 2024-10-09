import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports:[SharedModule,RouterOutlet],
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.scss'
})
export class FullLayoutComponent {

  constructor(public sidebarService: SidebarService) {}

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
