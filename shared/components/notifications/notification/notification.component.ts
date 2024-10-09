import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  notifications$ = this.notificationService.notifications$;

  constructor(private notificationService: NotificationService) {}
  clearNotification() {
    this.notificationService.clearNotification();
  }
}
