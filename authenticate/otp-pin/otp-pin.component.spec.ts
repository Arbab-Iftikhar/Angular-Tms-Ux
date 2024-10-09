import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPinComponent } from './otp-pin.component';

describe('OtpPinComponent', () => {
  let component: OtpPinComponent;
  let fixture: ComponentFixture<OtpPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpPinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
