import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthenticateRoutingModule } from './authenticate-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OtpPinComponent } from "./otp-pin/otp-pin.component";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [LoginComponent,SignUpComponent,OtpPinComponent],
  imports: [
    AuthenticateRoutingModule,
    SharedModule,
    TranslateModule
]
})
export class AuthenticateModule { }
