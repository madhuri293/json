import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export abstract class EntityModel {
  name: string;
  id: string;
}
export abstract class AbstractRestService<T extends EntityModel> {
  model: T;
  constructor(public httpService: HttpService) { }

  getAll(url: string): Observable<any> {
    return this.httpService.get(url);
  }
  create(url: string, data: any) {
    return this.httpService.create(url, data);
  }

  update(url: string, data: any) {
    return this.httpService.update(url, data);
  }

  addOrUpdate(url: string, data: any) {
    if (data.pkey) {
      return this.httpService.update(url, data);
    } else {
      return this.httpService.create(url, data);
    }

  }

}
