import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { NotificationService } from 'app/shared/services/notification.service';
import * as AuthActions from 'app/shared/states/auth/auth.actions';
import { IProfile, UserInfo } from 'app/shared/states/auth/auth.interfaces';
import { getUserData } from 'app/shared/states/auth/auth.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import { INavigator } from 'app/shared/states/ui/ui.interface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ProfileVerifyComponent } from '../modals/profile-verify/profile-verify.component';

import { FormControlService } from 'app/shared/services/form-control.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  private pageTitle = 'Profile Settings';
  public countryCode = '+' + 1;

  public userDetails: IProfile;

  private onDestroy$ = new Subject<void>();
  public fetching$: Observable<boolean>;
  public didFetch$: Observable<boolean>;
  public profileResult$: Observable<any>;
  public phonenoResult$: Observable<any>;
  public userData$: Observable<IProfile>;
  public navButtonClick$: Observable<INavigator>;
  public smsVerificationModalRef: BsModalRef;

  showModal = false;
  @ViewChild('phoneVerify', { read: ViewContainerRef })
  container;
  @ViewChild('profileSettings') ngForm: NgForm;
  @ViewChild('smsVerificationModal') smsVerificationModal;
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    email: new FormControl(''),
    countryCode: new FormControl('+1'),
    phone: new FormControl(''),
  });

  constructor(
    private store$: Store<IStore>,
    private resolver: ComponentFactoryResolver,
    private notificationService$: NotificationService,
    public formControlService: FormControlService
  ) {}

  ngOnInit() {
    this.initSubHeader();
    this.fetching$ = this.store$.pipe(select(state => state.auth.fetching));
    this.didFetch$ = this.store$.pipe(select(state => state.auth.didFetch));
    this.store$.dispatch(new AuthActions.InitializeProfileState());
    this.profileResult$ = this.store$.pipe(
      select(state => state.auth.profileResult)
    );
    this.phonenoResult$ = this.store$.pipe(
      select(state => state.auth.phonenoResult)
    );
    this.userData$ = this.store$.pipe(select(getUserData));

    this.store$.dispatch(new AuthActions.FetchUserData());
    this.userData$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          if (data !== undefined) {
            this.userDetails = data;
            this.profileForm = new FormGroup({
              firstName: new FormControl(data.first_name),
              email: new FormControl(data.email_address),
              countryCode: new FormControl('+1'),
              phone: new FormControl(data.phone.substring(2)),
            });
          }
        })
      )
      .subscribe();

    this.navButtonClick$ = this.store$.pipe(
      select(state => state.ui.navigateButtonClick)
    );
    this.navButtonClick$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          this.onNavButtonClick(data);
        })
      )
      .subscribe();

    this.profileResult$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(profileResult => {
          if (profileResult) {
            this.store$.dispatch(new AuthActions.InitializeProfileState());
            if (profileResult.success !== '0') {
              this.store$.dispatch(new AuthActions.FetchUserData());
              this.notificationService$.success(
                'Profile has been updated successfully.'
              );
            } else {
              this.notificationService$.error(profileResult.message);
            }
          }
        })
      )
      .subscribe();

    this.phonenoResult$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(phonenoResult => {
          if (phonenoResult) {
            if (phonenoResult.success !== '0') {
              this.openModel(this.getRequest(this.ngForm.value));
            } else {
              this.notificationService$.error(phonenoResult.message);
            }
          }
        })
      )
      .subscribe();
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'next') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.store$.dispatch(new UiActions.SetShowNextLabel('Save'));

      if (this.profileForm.valid) {
        this.openVerifyModel(this.ngForm.value);
      } else {
        this.formControlService.validateAllFormFields(this.profileForm);
      }
    }
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetShowNextLabel('Save'));
  }

  openVerifyModel(data) {
    if (this.profileForm.dirty) {
      if (
        '+1' + this.profileForm.controls.phone.value !==
        this.userDetails['phone']
      ) {
        const json = {
          phone_number: '+1' + this.profileForm.controls.phone.value,
          user_id: this.userDetails['id'],
        };
        this.store$.dispatch(new AuthActions.SendPhoneForOtp(json));
      } else {
        const userInfo = this.getRequest(data);
        this.store$.dispatch(new AuthActions.SendUserData(userInfo));
      }
    }
  }

  getRequest(data) {
    const userInfo: UserInfo = new UserInfo();
    if (data.firstName !== this.userDetails.first_name) {
      userInfo.first_name = data.firstName;
    }
    if (data.email !== this.userDetails.email_address) {
      userInfo.email = data.email.toLowerCase();
    }
    if ('+1' + data.phone !== this.userDetails.phone) {
      userInfo.phone = '+1' + data.phone;
    }
    return userInfo;
  }

  openModel(data) {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(
      ProfileVerifyComponent
    );
    const componentRef = this.container.createComponent(factory);
    componentRef.instance.userInfo = data;
    componentRef.instance.formValue = this.ngForm.value;
    componentRef.instance.closeModal.subscribe(res => {
      componentRef.destroy();
    });
  }

  closeModal() {
    this.showModal = false;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
