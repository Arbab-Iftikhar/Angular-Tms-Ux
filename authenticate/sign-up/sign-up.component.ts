import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { SharedFormService } from '../../shared/services/shared-form.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/services/notification.service';
import { SuccessMessages } from '../../shared/utils/enums';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signupForm!: FormGroup;
  direction: string = 'ltr';
  constructor(private notificationService:NotificationService,private router: Router, private route: ActivatedRoute,private httpURIService:HttpURIService,private sharedFormService:SharedFormService,private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object){
  
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', Validators.required),
        countryCode:new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
        ]),
        confirmPassword: new FormControl('', Validators.required),
        isOtpRequired: new FormControl(true),
      },
      { validators: this.passwordMatchValidator() }
    );
  }
  

passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && confirmPassword.value) {
      return password.value === confirmPassword.value ? null : { mismatch: true };
    }
    return null;
  };
}

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.sharedFormService.username = this.signupForm.get('username')?.value;
      this.sharedFormService.email = this.signupForm.get('email')?.value;
      this.sharedFormService.password = this.signupForm.get('password')?.value;
      this.sharedFormService.confirmPassword = this.signupForm.get('confirmPassword')?.value; 
      this.sharedFormService.countryCode = this.signupForm.get('countryCode')?.value;
      this.sharedFormService.phone = this.signupForm.get('phone')?.value; 
      this.sharedFormService.isOtpRequired = this.signupForm.get('isOtpRequired')?.value; 
      let loginType = "01";
      let payload = {};
      payload = {...this.signupForm.value ,loginType}
      this.httpURIService.requestPOST(URIKey.SECURITY_USER_SIGNUP,payload).subscribe((response)=>{
        if(!(response instanceof HttpErrorResponse)){
        this.router.navigate(['otp'], { relativeTo: this.route.parent });
        this.notificationService.success(this.translate.instant(SuccessMessages.SIGNUP_SUCCESS));
        }
        else{
        this.notificationService.error(this.translate.instant(response.error.errorCode));
        }
      })
    }
  }

  onLogin(): void {
    this.router.navigate(['login'], { relativeTo: this.route.parent });
  }

  countryCodes: { id: string, name: string }[] = [
    { id: '1', name: 'USA(+1)' },
    { id: '1', name: 'CAN(+1)' },
    { id: '967', name: 'DXB(+967)' },
    { id: '92', name: 'PAK(+92)' }
  ];
}
