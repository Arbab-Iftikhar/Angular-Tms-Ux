import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  public sidebarState$ = this.isSidebarOpen.asObservable();
  currentSubModule:string;
  constructor() {
    this.currentSubModule = '';
   }

  toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }
}
