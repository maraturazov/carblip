import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as AuthActions from 'app/shared/states/auth/auth.actions';
import * as BrandActions from 'app/shared/states/brands/brands.actions';
import * as ColorActions from 'app/shared/states/colors/colors.actions';
import * as LeaseActions from 'app/shared/states/lease/lease.actions';
import * as ModelActions from 'app/shared/states/models/models.actions';
import * as MyRequestActions from 'app/shared/states/my-request/myrequests.actions';
import * as OptionActions from 'app/shared/states/options/options.actions';
import * as RequestActions from 'app/shared/states/request/request.actions';
import * as TrimActions from 'app/shared/states/trim/trim.actions';
import * as UiActions from 'app/shared/states/ui/ui.actions';

import { IStore } from 'app/shared/interfaces/store.interface';
import { profileInitialState } from './auth.initial-state';
import { IProfile } from './auth.interfaces';

import { environment } from 'environments/environment';

@Injectable()
export class AuthServiceImpl {
  private token: string | null;
  private userID: number | null;

  constructor(private http: HttpClient, private store$: Store<IStore>) {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    if (!this.userID) {
      this.userID =
        JSON.parse(localStorage.getItem('auth')) &&
        JSON.parse(localStorage.getItem('auth')).user &&
        JSON.parse(localStorage.getItem('auth')).user.id;
    }
  }

  checkEmailExist(email: string): Observable<any> {
    return this.http
      .get(`${environment.urlBackend}/emailExists/${email}`)
      .pipe();
  }

  registerPhone(params: any): Observable<any> {
    return this.http
      .post(`${environment.urlBackend}/registerPhone`, params)
      .pipe(
        tap(data => {
          this.userID = (data.result && data.result.user_id) || null;
        })
      );
  }

  verifyPhone(params: any): Observable<any> {
    return this.http
      .post(`${environment.urlBackend}/verifyLoginOTP`, params)
      .pipe(
        map(res => res),
        tap(data => {
          this.setLoginData(data.result || {});
        })
      );
  }

  resendCode(params: any): Observable<any> {
    return this.http.post(`${environment.urlBackend}/sendSMS`, params).pipe();
  }

  fetchUserData(): Observable<IProfile> {
    return this.http
      .get(`${environment.urlBackend}/userProfile`, {
        headers: new HttpHeaders().set('token', this.token),
      })
      .pipe(map(userDetails => profileInitialState(userDetails['result'])));
  }

  sendUserData(userDetails): Observable<any> {
    return this.http
      .post(`${environment.urlBackend}/userProfile`, userDetails, {
        headers: new HttpHeaders().set('token', this.token),
      })
      .pipe(map(res => res));
  }

  sendOtpCode(code): Observable<any> {
    return this.http
      .post(`${environment.urlBackend}/verifyPhone`, code, {
        headers: new HttpHeaders().set('token', this.token),
      })
      .pipe(map(res => res));
  }

  sendPhonenoForOtp(code): Observable<any> {
    return this.http
      .post(`${environment.urlBackend}/sendSMS`, code, {
        headers: new HttpHeaders().set('token', this.token),
      })
      .pipe(map(res => res));
  }

  private setLoginData(tokenResponse: any) {
    this.token = tokenResponse.utoken;
    this.userID = tokenResponse.user_id;
    localStorage.setItem('token', this.token);
    this.setTokenExpiration();
  }

  initializeStore() {
    this.store$.dispatch(new AuthActions.ClearUserInfo());
    this.store$.dispatch(new BrandActions.ClearBrandList());
    this.store$.dispatch(new ColorActions.ClearColorList());
    this.store$.dispatch(new LeaseActions.ClearLeaseInfo());
    this.store$.dispatch(new ModelActions.ClearModelList());
    this.store$.dispatch(new MyRequestActions.ClearRequestList());
    this.store$.dispatch(new OptionActions.ClearOptionList());
    this.store$.dispatch(new RequestActions.ClearRequestData());
    this.store$.dispatch(new TrimActions.ClearTrimList());
    this.store$.dispatch(new UiActions.ClearUiInfo());
  }

  signOut() {
    this.http
      .post(`${environment.urlBackend}/logout`, {
        headers: new HttpHeaders().set('token', this.token),
      })
      .pipe(map(res => res));

    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');

    this.initializeStore();
  }

  setTokenExpiration() {
    const expiration = new Date().getTime() + 1000 * 60 * 60 * 3; // set 3 hours expiration token time.
    localStorage.setItem('token_expiration', expiration.toString());
  }

  refreshToken(): Observable<any> {
    // refresh token endpoint
    return;
  }

  isTokenExpired() {
    return +localStorage.getItem('token_expiration') < new Date().getTime();
  }

  verifyToken(): Observable<any> {
    // verify token endpoint
    return;
  }

  getToken(): string {
    return this.token || localStorage.getItem('token');
  }

  getUserID(): number {
    return this.userID;
  }

  getNecessaryTokenUrl(url) {
    url = url.replace(environment.urlBackend, '');
    const authenticatedUrls: string[] = [];
    if (authenticatedUrls.indexOf(url) > -1) {
      return true;
    } else {
      let authenticated = false;
      authenticatedUrls.forEach(item => {
        if (url.indexOf(item) > -1) {
          authenticated = true;
        }
      });
      return authenticated;
    }
  }
}
