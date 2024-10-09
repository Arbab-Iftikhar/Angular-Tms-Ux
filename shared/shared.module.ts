import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPipe } from './filter.pipe';
@NgModule({
  declarations: [ 
    LoaderComponent,
    NotificationComponent,
    SideNavComponent,
    NavBarComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,FormsModule,
    TranslateModule
  ],
  exports:[
    LoaderComponent,
    NotificationComponent,
    CommonModule,
    ReactiveFormsModule,
    SideNavComponent,
    RouterModule,
    NavBarComponent,
    FormsModule,
    FilterPipe
  ]
})
export class SharedModule { }
