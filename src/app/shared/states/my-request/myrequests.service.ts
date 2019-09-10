import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { requestInitialState } from 'app/shared/states/my-request/myrequests.initial-state';
import { IRequest } from 'app/shared/states/my-request/myrequests.interfaces';
import { environment } from 'environments/environment';

@Injectable()
export abstract class ReqeustsService {
  abstract fetchRequestList(params: any): Observable<IRequest[]>;
}
@Injectable()
export class RequestsServiceImpl extends ReqeustsService {
  constructor(private http: HttpClient) {
    super();
  }

  fetchRequestList(params: any): Observable<IRequest[]> {
    return this.http
      .post(`${environment.urlBackend}/getVehicleRequests`, params)
      .pipe(
        map(requests =>
          requests['data'].map(request => requestInitialState(request))
        )
      );
  }
}
