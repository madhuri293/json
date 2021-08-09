import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpService } from '../../core/services/http/http.service';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  loading :boolean;
  constructor(private httpService: HttpService) { }


  getProjectListByProjectType(id: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.getProjectsByType}/${id}`)
      .pipe(map(data => data));
  }

  getProjectById(id: any) {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${id}`)
      .pipe(map(data => data));
  }

  update(project: any) {
    return this.httpService.update(`${environment.project_api_url}${environment.project}/${environment.updateProject}`, project)
      .pipe(map(data => data));
  }

  getCurrentPhase() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.currentPhasePriority}`)
      .pipe(
        map(data => data)
      );
  }

  getCurrentPhaseName() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.currentPhaseName}`)
      .pipe(
        map(data => data)
      );
  }

  getPPPriority() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.ppPriority}`)
      .pipe(
        map(data => data)
      );
  }

  getStatus() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.status}`)
      .pipe(
        map(data => data)
      );
  }

  getUopSegment() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.getUOPSegment}`)
      .pipe(
        data => data
      );
  }

  delete(id: any, sk: any) {
    return this.httpService.delete(`${environment.project_api_url}${environment.project}/${id}/${sk}`)
      .pipe(
        data => data
      );
  }

  find(data: any) {
    return this.httpService.create(`${environment.project_api_url}${environment.project}/${environment.find}`, data)
      .pipe(
        result => result
      );
  }

  save(project: any) {
    return this.httpService.create(`${environment.project_api_url}${environment.project}/${environment.addProject}`, project)
      .pipe(
        result => result
      );
  }

  getProjectType() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.projectType}`)
      .pipe(
        data => data
      );
  }

  getBussnessJustification() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.BusinessJustification}`)
      .pipe(
        data => data
      );
  }

  getBusinessObjective() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.businessObjective}`)
      .pipe(
        data => data
      );
  }


  getBusinessGroup() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.businessGroup}`)
      .pipe(
        data => data
      );
  }

  download(dataObj: any) {
    return this.httpService.downloadFile(`${environment.project_api_url}${environment.project}/${environment.getFile}?fileId=${dataObj.id}`)
      .subscribe(result => {
        if (result.size !== 0) {
          this.downloadFile(result, dataObj);
        }

      });
  }

  downloadFile(data: any, obj: any) {
    const blob = new Blob([data], { type: obj.contentType });
    saveAs(blob, `${obj.fileName.split('.')[0]}`);
  }


  getAllProjectFiles() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.getProjectFiles}`)
      .pipe(
        data => data
      );
  }

  getApplication() {
    return this.httpService.get(`${environment.project_api_url}${environment.project}/${environment.getProjectApplication}`)
      .pipe(
        data => data
      );
  }


}
