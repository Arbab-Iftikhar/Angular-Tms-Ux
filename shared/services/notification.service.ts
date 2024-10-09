import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<{ type: string, message: string } | null>(null);
  notifications$ = this.notificationSubject.asObservable();

  success(message: string) {
    this.notify('success', 'Success: ' + message);
  }

  error(message: string) {
    this.notify('error', 'Error: ' + message);
  }

  warning(message: string) {
    this.notify('warning', 'Warning: ' + message);
  }

  private notify(type: string, message: string) {
    this.notificationSubject.next({ type, message });

    // Automatically clear notification after 3 seconds using RxJS timer
    this.notifications$.pipe(
      startWith(null),
      switchMap(() => timer(5000))
    ).subscribe(() => this.notificationSubject.next(null));
  }
  clearNotification() {
    this.notificationSubject.next(null);
  }
}
