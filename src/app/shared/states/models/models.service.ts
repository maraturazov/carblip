import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { modelInitialState } from 'app/shared/states/models/models.initial-state';
import {
  IModel,
  IRequestFecthList,
} from 'app/shared/states/models/models.interfaces';
import { environment } from 'environments/environment';

// when creating a service, you should use an abstract class to describe your methods
// this way you'll have the possibility to :
// - make sure you've got the same parameters and return types between the real service and the mock
// - search for references in Visual Studio Code and find your mock aswell on a method
@Injectable()
export abstract class ModelsService {
  abstract fetchModelList(
    requestParam: IRequestFecthList
  ): Observable<IModel[]>;
}
@Injectable()
export class ModelsServiceImpl extends ModelsService {
  constructor(private http: HttpClient) {
    super();
  }

  fetchModelList(requestParam: IRequestFecthList): Observable<IModel[]> {
    return this.http
      .post(`${environment.urlBackend}/getModels`, requestParam)
      .pipe(
        map(models => models['data'].map(model => modelInitialState(model)))
      );
  }
}
