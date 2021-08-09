import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  /**
   * to get the data from server
   * @param url server url to get the data
   */
  get(url: string): Observable<any> {
    return this.http.get(url, {
      headers: this.jwt()
    }).pipe(map(response => {
      return response;
    })
    );
  }



  /**
   * post is used to save data into database
   * @param url url to save the data to database
   * @param data data to be stored in database
   */


  create(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data, {
      headers: this.jwt(),
      observe: 'response'
    }).pipe(map(response => response));
  }

  /**
   * PUT method is used to update
   * @param url url to update the data in database
   * @param data data to be updated in the database
   */

  update(url: string, data: any): Observable<any> {
    return this.http.put<any>(url, data, {
      headers: this.jwt(),
      observe: 'response'
    }).pipe(map(response => response));
  }


  delete(url: any) {
    return this.http.delete<any>(url, {
      headers: this.jwt(),
      observe: 'response'
    })
      .pipe(map((response) => response),
        // retry(1),
      );
  }
  /**
   *
   * @param url url to download the file
   * @param data file details to be downloaded
   */
  downloadFile(url: any): Observable<Blob> {
    return this.http.get(url, {
      headers: this.jwt(),
      responseType: 'blob'
    });
  }

  /**
   * to get the jwt token from localstorage and set it to header
   */
  private jwt(): any | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
    }
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.error.message}`;
    }
    return throwError(errorMessage);
  }
}
