import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { HttpService } from '../../core/services/http/http.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loading: any;
  constructor(private authenticationService: AuthenticationService, public httpService: HttpService) {

  }

  login(data: any) {
    return this.authenticationService.login(data).pipe(result =>
      result);
  }

  logout() {
    return this.authenticationService.logout();
  }
  awsLogin(datain) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create('https://www.microserviceone.com/', datain)
      .pipe(map(data => data));
  }

}
