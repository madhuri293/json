import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { CacheService } from '../cache/cache.service';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../shared/common-services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router, public commonService: CommonService,
    private cacheService: CacheService) { }

  login(data: any) {
    return this.http.post<any>(`${environment.login_api_url}${environment.login}`, data, {
      headers: this.loginHeader(),
      observe: 'response'
    }).pipe(map(res => res));
  }


  private loginHeader(): any | undefined {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }


  logout() {
    const userObj = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.router.navigate(['/login']);
    return this.http.delete<any>(`${environment.login_api_url}${environment.logout}` + '?token=' + userObj.token.split(' ')[1]).pipe(map(res => res));


  }

  private logoutHeader(): any | undefined {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

}

