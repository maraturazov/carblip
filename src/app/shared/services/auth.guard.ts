import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router/src/router_state';
import { Store } from '@ngrx/store';
import * as AuthActions from 'app/shared/states/auth/auth.actions';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { IStore } from '../interfaces/store.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  public userData$: Observable<boolean>;

  constructor(
    private authService: AuthServiceImpl,
    private router: Router,
    private store$: Store<IStore>
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getToken()) {
      this.store$.dispatch(new AuthActions.FetchUserData());

      if (state.url === '/register') {
        this.router.navigateByUrl('/find-my-car');
      }
      return true;
    } else if (state.url === '/register') {
      return true;
    } else {
      this.router.navigateByUrl('/register');
      return false;
    }
  }
}
