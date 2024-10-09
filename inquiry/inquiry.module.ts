import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { InquiryRoutingModule } from './inquiry-rouitng.module';
import { DetailInquiryComponent } from './detail-inquiry/detail-inquiry.component';

@NgModule({
    declarations: [DetailInquiryComponent],
    imports: [
      InquiryRoutingModule,
      SharedModule,
      TranslateModule
    ]
  })
  export class InquiryModule { }