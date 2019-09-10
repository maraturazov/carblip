import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { IStore } from 'app/shared/interfaces/store.interface';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class AppLoaderComponent implements OnInit, OnDestroy {
  isVisible = true;

  private onDestroy$ = new Subject<void>();
  public fetchingModel$: Observable<boolean>;
  public fetchingTrim$: Observable<boolean>;
  public fetchingColor$: Observable<boolean>;
  public fetchingOption$: Observable<boolean>;

  constructor(private store$: Store<IStore>) {}

  ngOnInit() {
    this.fetchingModel$ = this.store$.pipe(
      select(state => state.model.fetching)
    );
    this.fetchingTrim$ = this.store$.pipe(select(state => state.trim.fetching));
    this.fetchingColor$ = this.store$.pipe(
      select(state => state.color.fetching)
    );
    this.fetchingOption$ = this.store$.pipe(
      select(state => state.option.fetching)
    );

    // model loading
    this.fetchingModel$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(fetching => (this.isVisible = fetching))
      )
      .subscribe();

    // trim loading
    this.fetchingTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(fetching => (this.isVisible = fetching))
      )
      .subscribe();

    // color loading
    this.fetchingColor$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(fetching => (this.isVisible = fetching))
      )
      .subscribe();

    // option loading
    this.fetchingOption$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(fetching => (this.isVisible = fetching))
      )
      .subscribe();
  }

  show() {
    this.isVisible = true;
  }
  hide() {
    this.isVisible = false;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
