import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';

import { IStore } from 'app/shared/interfaces/store.interface';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: AuthServiceImpl;

  constructor(private injector: Injector, private store: Store<IStore>) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthServiceImpl);
    const token: string = this.authService.getToken();
    const is_necessary_token = this.authService.getNecessaryTokenUrl(
      request.url
    );
    if (is_necessary_token) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${token}`,
        },
      });
    }
    return next.handle(request).do(
      (event: HttpEvent<any>) => {},
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.store.pipe();
          }
        }
      }
    );
  }
}
