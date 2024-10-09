import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { SharedFormService } from '../../shared/services/shared-form.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, switchMap } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SuccessMessages } from '../../shared/utils/enums';

@Component({
  selector: 'app-otp-pin',
  templateUrl: './otp-pin.component.html',
  styleUrl: './otp-pin.component.scss',
})
export class OtpPinComponent {
  otpForm!: FormGroup;
  countdown: number = 120;
  showResendOtp: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute,private httpURIService:HttpURIService,public sharedFormService:SharedFormService,
    private notificationService: NotificationService, private translate: TranslateService
  ){}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      username: new FormControl(this.sharedFormService.username),
      email: new FormControl(this.sharedFormService.email),
      obpPincode: new FormArray([
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
      ]),
    });
    this.startTimer();
  }

  get otpControls(): FormArray {
    return this.otpForm.get('obpPincode') as FormArray;
  }
  
  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    if (value && index < this.otpControls.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  
  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }
  sendOtpRequest() {
    (this.otpForm.get('obpPincode') as FormArray).reset();
    this.startTimer();
    let loginType = "01";
    let channelCode = "01";
    let porOrgacode = "001";
    let pinType = "REG";
    const { username, email, password, confirmPassword, countryCode, phone, isOtpRequired } = this.sharedFormService;
    let payload = {};
     payload = {
      username,
      email,
      password,           
      confirmPassword,    
      countryCode,
      phone,
      isOtpRequired,
      loginType,
      channelCode,
      porOrgacode,
      pinType}
    this.httpURIService.requestPOST(URIKey.SECURITY_USER_RESEND_OTP, payload).subscribe(
      (response) => {
        if (!(response instanceof HttpErrorResponse)) {
          this.notificationService.success(this.translate.instant('OTP Resend success'));
        } else {
          this.notificationService.error(this.translate.instant(response.error.errorCode));
        }
      }
    );
  }
  startTimer() {
    this.showResendOtp = false; 
    this.countdown = 120; 
    const timerInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(timerInterval);
        this.showResendOtp = true; 
      }
    }, 1000);
  }

  onSubmit(): void {
    const otpValue = this.otpControls.controls.map(control => control.value).join('');
    const formValue = {
      ...this.otpForm.value,
      obpPincode: otpValue
    };
    this.httpURIService.requestPOST(URIKey.SECURITY_USER_OTP_VERIFICATION, formValue).pipe(
      switchMap(response => {
        if (response instanceof HttpErrorResponse) {
          this.notificationService.error(this.translate.instant(response.error.errorCode));
          return of(null);
        } else {
          const requestBody = { email: this.otpForm.get('email')?.value };
          return this.httpURIService.requestPOST(URIKey.SECURITY_SIGNUP_STATUS_UPDATE, requestBody);
        }
      })
    ).subscribe((response) => {
      if (response && !(response instanceof HttpErrorResponse)) {
        this.notificationService.success(this.translate.instant(SuccessMessages.USER_REGISTERED_SUCCESSFULLY));
        this.router.navigate(['login'], { relativeTo: this.route.parent });
      }
    });
  }
  
  onLogin(): void {
    this.router.navigate(['login'], { relativeTo: this.route.parent });
  }
}
