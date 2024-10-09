import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInquiryComponent } from './detail-inquiry.component';

describe('DetailInquiryComponent', () => {
  let component: DetailInquiryComponent;
  let fixture: ComponentFixture<DetailInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInquiryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
