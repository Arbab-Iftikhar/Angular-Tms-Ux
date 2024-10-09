import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailInquiryComponent } from './detail-inquiry/detail-inquiry.component';

const routes: Routes = [
  {
    path: 'detailInquiry',
    component: DetailInquiryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryRoutingModule { }