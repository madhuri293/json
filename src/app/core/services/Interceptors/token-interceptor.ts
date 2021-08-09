
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../../../shared/common-services/common.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    userObj: any;

    constructor(private commonService: CommonService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const technologyId = localStorage.getItem('technology');
        if (localStorage.getItem('userObj')) {
            this.userObj = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj'))
            );
        } else {
            this.userObj = null
        }

        if (this.userObj !== null) {
            const userId = this.userObj.userId;

            if (this.userObj.token) {
                headersConfig['Authorization'] = `Token ${this.userObj.token}`;
                headersConfig['TechnologyId'] = `${technologyId}`;
                headersConfig['UserId'] = `${userId}`;
            }
        }


        const request = req.clone({ setHeaders: headersConfig });
        return next.handle(request);
    }
}
