import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RunObjective } from './run-objective.model';
import { AbstractRestService } from '../../../core/services/abstract-rest/abstract-rest.service';
import { HttpService } from '../../../core/services/http/http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RunObjectiveService extends AbstractRestService<RunObjective> {
  configFlag1: boolean;
  confirmationFlag = new BehaviorSubject(false);
  configFlag = this.confirmationFlag as Observable<boolean>;
  constructor(public httpService: HttpService
   ) {
    super(httpService);
  }
  getAllRunObjective(): Observable<any> {
    return this.httpService.get(`${environment.runObjectives_api_url}${environment.runObjective}`)
      .pipe(map(data => data));
  }

  getRunActiveObjective():  Observable<any>{
    return this.httpService.get(`${environment.runObjectives_api_url}${environment.runObjectiveAscending}`)
      .pipe(map(data => data));
  }

  getAllProcess(): Observable<any> {
    return this.httpService.get(`${environment.runObjectives_api_url}${environment.process}`)
      .pipe(map(data => data));
  }
  update(data: any): Observable<any> {
    return this.httpService.update(`${environment.runObjectives_api_url}${environment.runObjective}`, data);
  }

  save(data: any): Observable<any> {
    return this.httpService.create(`${environment.runObjectives_api_url}${environment.runObjective}`, data);
  }

  getById(id: number): Observable<any> {
    return this.httpService.get(`${environment.runObjectives_api_url}${environment.runObjective}/${id}`);
  }

  findRunObjective(technology: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.create(`${environment.runObjectives_api_url}${environment.runObjective}/${environment.find}`, technology);
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.runObjectives_api_url}${environment.runObjective}/${id}/${sk}`)
      .pipe(map(data => data));
  }


  sendConfirmationFlag(flag: boolean) {
    this.confirmationFlag.next(flag);
  }
}
