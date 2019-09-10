import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { IStore } from 'app/shared/interfaces/store.interface';
import { SearchResultService } from 'app/shared/services/search-result.service';
import * as AuthActions from 'app/shared/states/auth/auth.actions';
import { IBrand } from 'app/shared/states/brands/brands.interfaces';
import {
  getBackgroundImage,
  getSelectedExteriorColorList,
  getSelectedInteriorColorList,
} from 'app/shared/states/colors/colors.selectors';
import { IModel } from 'app/shared/states/models/models.interfaces';
import { getSelectedoptions } from 'app/shared/states/options/options.selectors';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import { selectCurrentTrimId } from 'app/shared/states/trim/trim.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import { INavigator } from 'app/shared/states/ui/ui.interface';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { FIND_STEP_SEARCH_RESULT } from 'app/core/constant';
import { selectCurrentBrand } from 'app/shared/states/brands/brands.selectors';
import {
  IColorExterior,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';
import {
  selectCurrentExteriorColors,
  selectCurrentInteriorColors,
} from 'app/shared/states/colors/colors.selectors';
import { selectCurrentModel } from 'app/shared/states/models/models.selectors';
import { IRequest } from 'app/shared/states/request/request.interface';
import { getState } from 'app/shared/states/request/request.selectors';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';

import { FormControlService } from 'app/shared/services/form-control.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('phoneInputModal') phoneInputModal;
  @ViewChild('smsVerificationModal') smsVerificationModal;

  private onDestroy$ = new Subject<void>();

  private pageTitle = 'Search Results';
  public prevFindStep = FIND_STEP_SEARCH_RESULT;
  public registerForm: FormGroup;
  public phoneInputForm: FormGroup;
  public otpForm: FormGroup;

  public backgroundImage$: Observable<string>;

  public emailCheckResult$: Observable<any>;
  public registerPhoneResult$: Observable<any>;
  public verifyPhoneResult$: Observable<any>;
  public navButtonClick$: Observable<INavigator>;
  public firstName: '';
  public email: '';
  public phone: '';
  public userID: -1;
  private phoneInputModalRef: BsModalRef;
  private smsVerificationModalRef: BsModalRef;

  public selectedTrimId$: Observable<number>;
  public _selectedInteriorColors$: Observable<Array<number>>;
  public _selectedExteriorColors$: Observable<Array<number>>;
  public selectedExteriorColors$: Observable<IColorExterior[]>;
  public selectedInteriorColors$: Observable<IColorInterior[]>;
  public selectedOptions$: Observable<Array<number>>;
  public selectedBrand$: Observable<IBrand>;
  public selectedModel$: Observable<IModel>;
  public selectedTrim$: Observable<ITrim>;
  public request$: Observable<IRequest>;
  public models$: Observable<IModel[]>;
  public brandFetch$: Observable<boolean>;
  public modelFetch$: Observable<boolean>;
  public trimFetch$: Observable<boolean>;
  public colorFetch$: Observable<boolean>;
  public optionFetch$: Observable<boolean>;

  public vehicle: Array<number> = new Array<number>();
  public _selectedInteriorColors: Array<number>;
  public _selectedExteriorColors: Array<number>;
  public selectedOptions: Array<number>;
  public selectedBrandName: string;
  public selectedModelInfo: any;
  public selectedTrim: any;
  public request: any;
  public selectedExteriorColors: IColorExterior[];
  public selectedInteriorColors: IColorInterior[];
  public brandFetch: boolean;
  public modelFetch: boolean;
  public trimFetch: boolean;
  public colorFetch: boolean;
  public optionFetch: boolean;
  public count: number;
  public loaded = false;

  constructor(
    private store$: Store<IStore>,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    public service: SearchResultService,
    public formControlService: FormControlService,
    public notificationService$: NotificationService
  ) {}

  ngOnInit() {
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new AuthActions.ClearUserInfo());
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.phoneInputForm = this.formBuilder.group({
      phone: ['', Validators.required],
    });

    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
    });
    this.getStoreFetchState();
    this.backgroundImage$ = this.store$.select(getBackgroundImage);
    this.selectedBrand$ = this.store$.select(selectCurrentBrand);
    this.selectedModel$ = this.store$.select(selectCurrentModel);
    this.selectedTrim$ = this.store$.select(selectCurrentTrim);
    this.request$ = this.store$.select(getState);
    this.selectedExteriorColors$ = this.store$.select(
      selectCurrentExteriorColors
    );
    this.selectedInteriorColors$ = this.store$.select(
      selectCurrentInteriorColors
    );
    this.navButtonClick$ = this.store$.pipe(
      select(state => state.ui.navigateButtonClick)
    );
    this.getData();
    this.getCount();
    this.emailCheckResult$ = this.store$.select(
      state => state.auth.emailCheckResult
    );

    this.registerPhoneResult$ = this.store$.select(
      state => state.auth.registerPhoneResult
    );

    this.verifyPhoneResult$ = this.store$.select(
      state => state.auth.verifyPhoneResult
    );

    this.emailCheckResult$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        if (result && result.success) {
          if (result.exists) {
            this.firstName = result.first_name;
            this.phone = result.phone;
            this.smsVerificationModalRef = this.modalService.show(
              this.smsVerificationModal
            );
          } else {
            this.phoneInputModalRef = this.modalService.show(
              this.phoneInputModal
            );
          }
        }
      });

    this.registerPhoneResult$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        if (result && result.success) {
          this.userID = result.result.user_id;
          this.onDismissPhoneInputDialog();
          this.smsVerificationModalRef = this.modalService.show(
            this.smsVerificationModal
          );
        }
      });

    this.verifyPhoneResult$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        if (result) {
          if (result.success !== '0') {
            this.userID = result.result.user_id;
            this.onDismissVerificationModal();
            if (this.storesCompleted()) {
              this.router.navigate(['/find-my-car/review-info']);
            } else {
              this.router.navigateByUrl('/find-my-car');
            }
          } else {
            this.notificationService$.error(result.message);
          }
        }
      });

    this.navButtonClick$ = this.store$.pipe(
      select(state => state.ui.navigateButtonClick)
    );
    this.navButtonClick$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => this.onCheckUserCredential(data))
      )
      .subscribe();
  }

  getStoreFetchState() {
    // store states
    this.brandFetch$ = this.store$.select(state => state.brand.didFetch);
    this.modelFetch$ = this.store$.select(state => state.model.didFetch);
    this.trimFetch$ = this.store$.select(state => state.trim.didFetch);
    this.colorFetch$ = this.store$.select(state => state.color.didFetch);
    this.optionFetch$ = this.store$.select(state => state.option.didFetch);
    this.brandFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => (this.brandFetch = data))
      )
      .subscribe();
    this.modelFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => (this.modelFetch = data))
      )
      .subscribe();
    this.trimFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => (this.trimFetch = data))
      )
      .subscribe();
    this.colorFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => (this.colorFetch = data))
      )
      .subscribe();
    this.optionFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => (this.optionFetch = data))
      )
      .subscribe();
  }

  getCount() {
    this.selectedTrimId$ = this.store$.select(selectCurrentTrimId);
    this._selectedInteriorColors$ = this.store$.select(
      getSelectedInteriorColorList
    );
    this._selectedExteriorColors$ = this.store$.select(
      getSelectedExteriorColorList
    );
    this.selectedOptions$ = this.store$.select(getSelectedoptions);

    this.selectedTrimId$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(modelId => this.vehicle.push(modelId))
      )
      .subscribe();

    this._selectedInteriorColors$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this._selectedInteriorColors = colors))
      )
      .subscribe();

    this._selectedExteriorColors$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this._selectedExteriorColors = colors))
      )
      .subscribe();

    this.selectedOptions$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(options => {
          this.selectedOptions = options;
        })
      )
      .subscribe();

    const requestObj = {
      vehicles: this.vehicle,
      interior_colors: this._selectedInteriorColors,
      exterior_colors: this._selectedExteriorColors,
      option_preferences: this.selectedOptions,
    };

    this.service
      .fetchSearchResult(requestObj)
      .subscribe(data => (this.count = data ? data.count : null));
  }

  onDismissPhoneInputDialog() {
    this.phoneInputModalRef.hide();
  }

  onDismissVerificationModal() {
    this.smsVerificationModalRef.hide();
  }

  onCheckUserCredential(data) {
    if (data.click && data.type === 'next') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      if (this.registerForm.valid) {
        this.firstName = this.registerForm.value.firstName;
        this.email = this.registerForm.value.email.toLowerCase();
        this.store$.dispatch(new AuthActions.FetchUserInfo(this.email));
      } else {
        // show messages
        this.formControlService.validateAllFormFields(this.registerForm);
      }
    }
    if (data.click && data.type === 'previous') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.router.navigate(['find-my-car/', this.prevFindStep]);
    }
  }

  onRegisterPhone() {
    if (this.phoneInputForm.valid) {
      this.phone = this.phoneInputForm.value.phone;

      const requestObj = {
        email_address: this.email,
        device_type: 'iOS',
        phone: `+1${this.phone}`,
        first_name: this.firstName,
        device_token: '',
        last_name: '',
      };

      this.store$.dispatch(new AuthActions.RegisterPhone(requestObj));
    } else {
      // show messages
      this.formControlService.validateAllFormFields(this.phoneInputForm);
    }
  }

  onVerifyPhone() {
    if (this.otpForm.valid) {
      const optFormValue = this.otpForm.value;

      const requestObj = {
        otp: [
          optFormValue.otp1,
          optFormValue.otp2,
          optFormValue.otp3,
          optFormValue.otp4,
          optFormValue.otp5,
        ].join(''),
        device_token: '',
        phone: this.phone,
        first_name: this.firstName,
      };

      this.store$.dispatch(new AuthActions.VerifyPhone(requestObj));
    } else {
      this.notificationService$.error('Please input all the numbers.');
    }
  }

  autoFocusInputField(event) {
    const charCode = event.which ? event.which : event.keyCode;
    const value = event.target.value;
    const prevElement = event.srcElement.previousElementSibling;
    const nextElement = event.srcElement.nextElementSibling;
    let element = null;
    event.target.value = null;
    switch (charCode) {
      case 8: // backsapce
        event.target.value = value;
        element = prevElement;
        if (element) {
          element.focus();
        }
        return;
      case 9: // tab
        break;
      case 37: // left arrow
        event.target.value = value;
        element = prevElement;
        break;
      case 39: // right arrow
        event.target.value = value;
        element = nextElement;
        if (element != null) {
          element.setSelectionRange(0, 0);
          element.focus();
        } else {
          event.target.setSelectionRange(0, 0);
          event.target.focus();
        }
        break;
      default:
        if (charCode >= 48 && charCode <= 57) {
          // in case of number
          event.target.value = charCode - 48;
          element = nextElement;
        }
    }
    if (element != null) {
      element.setSelectionRange(0, 0);
      element.focus();
    }
    if (this.otpForm.valid && charCode >= 48 && charCode <= 57) {
      this.onVerifyPhone();
    }
  }

  onResendCode() {
    const requestObj = {
      phone_number: this.phone,
      user_id: this.userID,
    };
    this.store$.dispatch(new AuthActions.ResendCode(requestObj));
  }

  getData() {
    this.selectedInteriorColors$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this.selectedInteriorColors = colors))
      )
      .subscribe();

    this.selectedExteriorColors$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this.selectedExteriorColors = colors))
      )
      .subscribe();

    this.request$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          req =>
            (this.request = req
              ? {
                  year: req.user_car_information.year,
                  make: req.user_car_information.brand_id,
                  model: req.user_car_information.model_id,
                  miles: req.user_car_information.miles,
                }
              : null)
        )
      )
      .subscribe();

    this.selectedBrand$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brand => {
          this.selectedBrandName = brand ? brand.name : null;
          if (this.storesCompleted()) {
            this.store$.dispatch(new UiActions.SetShowPrevButton(true));
          }
        })
      )
      .subscribe();

    this.selectedModel$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          model =>
            (this.selectedModelInfo = model
              ? {
                  name: model.name,
                  image: model.image_url,
                  minPrice: model.min_price,
                }
              : null)
        )
      )
      .subscribe();

    this.selectedTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          trim =>
            (this.selectedTrim = trim
              ? { name: trim.trim, year: trim.year }
              : null)
        )
      )
      .subscribe();
  }

  storesCompleted() {
    if (
      this.brandFetch &&
      this.modelFetch &&
      this.trimFetch &&
      this.colorFetch &&
      this.optionFetch
    ) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadImage(evt) {
    this.loaded = true;
  }
}
