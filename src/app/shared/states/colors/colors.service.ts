import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  exteriorColorInitialState,
  interiorColorInitialState,
} from 'app/shared/states/colors/colors.initial-state';
import {
  IColors,
  IRequestFecthList,
} from 'app/shared/states/colors/colors.interfaces';
import { environment } from 'environments/environment';

// when creating a service, you should use an abstract class to describe your methods
// this way you'll have the possibility to :
// - make sure you've got the same parameters and return types between the real service and the mock
// - search for references in Visual Studio Code and find your mock aswell on a method
@Injectable()
export abstract class ColorService {
  abstract fetchColorList(requestParam: IRequestFecthList): Observable<IColors>;
}
@Injectable()
export class ColorServiceImpl extends ColorService {
  constructor(private http: HttpClient) {
    super();
  }

  fetchColorList(requestParam: IRequestFecthList): Observable<IColors> {
    return this.http
      .post(`${environment.urlBackend}/getTrimColors`, requestParam)
      .pipe(
        map(response => {
          const data = response['data'];
          return {
            interior: data['interior_colors'].map(item =>
              interiorColorInitialState(item)
            ),
            exterior: data['exterior_colors'].map(item =>
              exteriorColorInitialState(item)
            ),
          };
        })
      );
  }
}
