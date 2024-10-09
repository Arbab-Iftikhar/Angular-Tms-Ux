import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpURIService } from '../../app.http.uri.service';
import { URIKey } from '../../shared/utils/uri-enums';
import { ErrorMessages, FormConstants, SuccessMessages } from '../../shared/utils/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../shared/services/notification.service';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword: boolean = false;
  languageControl = new FormControl();
  direction;
  constructor( private notificationService: NotificationService,private httpURIService: HttpURIService,private router: Router, private route: ActivatedRoute,private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object,private languageService: LanguageService) {
    const savedLanguage =this.languageService.getLanguage();
    this.languageControl.setValue(savedLanguage);
    this.translate.use(savedLanguage);
    this.direction = this.languageService.getDirection();
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]),
      rememberMe: new FormControl(false)
    });

  }
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const payload = {
        email: this.loginForm.get(FormConstants.EMAIL)?.value,
        password: this.loginForm.get(FormConstants.PASSWORD)?.value,
      };
      this.httpURIService.requestPOST(URIKey.SECURITY_USER_LOGIN, payload).subscribe((response:any) => {
        if(!(response instanceof HttpErrorResponse)){
        this.loginForm.reset();
        localStorage.setItem('token', response.token); 
        localStorage.setItem('name', response.name); 
        this.router.navigate(['home/broker/brokerDashboard']);
        this.notificationService.success(this.translate.instant(SuccessMessages.USER_LOGIN));
        }
        else{
        this.notificationService.error(this.translate.instant(ErrorMessages.USER_NOT_FOUND));
        }
      })
    }
  }

  onSignup(): void {
    // this.router.navigate(['signUp'], { relativeTo: this.route.parent });
    this.router.navigate(['/plan'], { relativeTo: this.route.parent });
  }

  onLangChange() {
    const selectedLang = this.languageControl.value;
    this.languageService.setLanguage(selectedLang);
    this.direction = this.languageService.getDirection();
    document.documentElement.setAttribute('dir', this.direction);
    
}
}
