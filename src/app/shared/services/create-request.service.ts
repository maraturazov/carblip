import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

@Injectable()
export class CreateRequestService {
  constructor(private http: HttpClient) {}

  createRequestFromPreference(params: any): Observable<any> {
    return this.http
      .post(`${environment.urlBackend}/createRequestFromPreferences`, params)
      .pipe();
  }
}
