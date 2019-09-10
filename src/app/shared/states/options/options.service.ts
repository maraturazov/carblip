import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { optionInitialState } from 'app/shared/states/options/options.initial-state';
import {
  IOption,
  IRequestFecthList,
} from 'app/shared/states/options/options.interfaces';
import { environment } from 'environments/environment';

@Injectable()
export abstract class OptionService {
  abstract FetchOptionList(
    requestParam: IRequestFecthList
  ): Observable<Array<IOption>>;
}
@Injectable()
export class OptionServiceImpl extends OptionService {
  constructor(private http: HttpClient) {
    super();
  }

  FetchOptionList(requestParam: IRequestFecthList): Observable<Array<IOption>> {
    return this.http
      .post(`${environment.urlBackend}/getTrimsTitledOptions`, requestParam)
      .pipe(map(option => option['data'].map(obj => optionInitialState(obj))));
  }
}
