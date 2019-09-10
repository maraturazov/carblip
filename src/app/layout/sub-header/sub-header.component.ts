import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { STEPS_BLOCK_LIST } from 'app/core/constant';
import { IStore } from 'app/shared/interfaces/store.interface';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import { getSubHeaderTitle } from 'app/shared/states/ui/ui.selectors';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss'],
})
export class SubHeaderComponent implements OnInit, OnDestroy {
  public page$: Observable<string>;
  public subHeaderTitle$: Observable<string>;
  public showNextButton$: Observable<boolean>;
  public showPrevButton$: Observable<boolean>;
  public showCancelSearch$: Observable<boolean>;
  public showStepper$: Observable<boolean>;
  public showSearchBox$: Observable<boolean>;
  public searchString$: Observable<string>;
  public currentStep$: Observable<string>;
  public lastStep$: Observable<string>;
  public nextLabel$: Observable<string>;

  private onDestroy$ = new Subject<void>();
  public steps = STEPS_BLOCK_LIST ? STEPS_BLOCK_LIST : [];
  public subHeaderTitle = '';
  public currentStep = '';
  public showNextButton = false;
  public showPrevButton = false;
  public showStepper = false;
  public showSearchBox = false;
  public searchString = null;
  public showCancelSearch = false;
  public lastStep: string;
  public nextLabel: string;
  public keyDown = false;
  public timer: any;
  constructor(
    private store$: Store<IStore>,
    private authService: AuthServiceImpl,
    private router: Router
  ) {}

  ngOnInit() {
    this.subHeaderTitle$ = this.store$.select(getSubHeaderTitle);
    this.showNextButton$ = this.store$.pipe(
      select(state => state.ui.showNextButton)
    );
    this.showPrevButton$ = this.store$.pipe(
      select(state => state.ui.showPrevButton)
    );
    this.nextLabel$ = this.store$.pipe(
      select(state => state.ui.nextButtonLabel)
    );
    this.showStepper$ = this.store$.pipe(select(state => state.ui.showStepper));
    this.showSearchBox$ = this.store$.pipe(
      select(state => state.ui.showSearchBox)
    );
    this.currentStep$ = this.store$.pipe(select(state => state.ui.currentPage));
    this.lastStep$ = this.store$.pipe(select(state => state.ui.lastStep));
    this.searchString$ = this.store$.pipe(
      select(state => state.ui.searchString)
    );
    this.subHeaderTitle$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(subHeaderTitle => (this.subHeaderTitle = subHeaderTitle))
      )
      .subscribe();
    this.currentStep$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(currentStep => (this.currentStep = currentStep))
      )
      .subscribe();
    this.lastStep$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(lastStep => (this.lastStep = lastStep))
      )
      .subscribe();
    this.showCancelSearch$ = this.store$.pipe(
      select(state => state.ui.showCancelSearch)
    );
    this.showNextButton$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(showNextButton => (this.showNextButton = showNextButton))
      )
      .subscribe();
    this.showPrevButton$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(showPrevButton => (this.showPrevButton = showPrevButton))
      )
      .subscribe();
    this.showStepper$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(showStepper => (this.showStepper = showStepper))
      )
      .subscribe();
    this.showSearchBox$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(showSearchBox => (this.showSearchBox = showSearchBox))
      )
      .subscribe();
    this.searchString$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(searchString => (this.searchString = searchString))
      )
      .subscribe();
    this.showCancelSearch$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(showCancelSearch => (this.showCancelSearch = showCancelSearch))
      )
      .subscribe();
    this.nextLabel$
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(nextLabel => (this.nextLabel = nextLabel))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  isLoggedIn() {
    return this.authService.getToken();
  }

  onNextButtonClick() {
    this.store$.dispatch(
      new UiActions.NavigateButtonClick({
        type: 'next',
        click: true,
      })
    );
  }

  onPrevButtonClick() {
    this.store$.dispatch(
      new UiActions.NavigateButtonClick({
        type: 'previous',
        click: true,
      })
    );
  }

  completed(step: string, currentStep: string) {
    if (!currentStep) {
      return false;
    }
    const _currentStep = this.steps.find(_step => _step.step === currentStep);
    if (!_currentStep) {
      return false;
    }
    const currentStepId = _currentStep.id;
    const completedSteps = this.steps.filter(_step => _step.id < currentStepId);
    return completedSteps.find(_step => _step.step === step) ? true : false;
  }

  redirectTo(step) {
    if (!this.lastStep) {
      return false;
    }
    const currentStepId = this.steps.find(_step => _step.step === this.lastStep)
      .id;
    const completedSteps = this.steps.filter(
      _step => _step.id <= currentStepId
    );
    if (completedSteps.find(_step => _step.step === step)) {
      this.router.navigate(['find-my-car/' + step]);
    }
  }

  onKeyUp() {
    this.keyDown = false;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.search();
    }, 800);
  }

  search() {
    this.store$.dispatch(new UiActions.SetSearchString(this.searchString));
  }
}
