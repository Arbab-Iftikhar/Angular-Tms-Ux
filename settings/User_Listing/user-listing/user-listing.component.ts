import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpURIService } from '../../../app.http.uri.service';
import { URIKey } from '../../../shared/utils/uri-enums';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.scss'
})
export class UserListingComponent {
  allUsers: any;
  contactFilter: string = '';
  constructor(private httpURIService: HttpURIService, private translate: TranslateService){
  }
  ngOnInit(): void {
        this.loadAllUsers();
  }

  loadAllUsers() {
    this.httpURIService.requestGET(URIKey.GET_ALL_USERS).subscribe((response) => {
      const responseArray = response as any[];
        this.allUsers = [];
        responseArray.forEach((item: any) => {
        this.allUsers.push(...item); 
      });
    });
  }
  
}
