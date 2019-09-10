import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { NotificationService } from 'app/shared/services/notification.service';
import * as AuthActions from 'app/shared/states/auth/auth.actions';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-verify',
  templateUrl: './profile-verify.component.html',
  styleUrls: ['./profile-verify.component.scss'],
})
export class ProfileVerifyComponent implements OnInit, OnDestroy {
  @Input() userInfo;
  @Input() formValue;
  @Input() showModal;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @ViewChild('smsVerificationModal') smsVerificationModal;
  public optCodeResult$: Observable<any>;
  public smsVerificationModalRef: BsModalRef;
  private onDestroy$ = new Subject<void>();
  public otpForm: FormGroup;
  constructor(
    private store$: Store<IStore>,
    private modalService: BsModalService,
    private notificationService$: NotificationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
    });

    this.optCodeResult$ = this.store$.pipe(
      select(state => state.auth.optCodeResult)
    );
    setTimeout(() => {
      this.smsVerificationModalRef = this.modalService.show(
        this.smsVerificationModal
      );
    }, 10);
    this.optCodeResult$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(optCodeResult => {
          if (optCodeResult) {
            if (optCodeResult.success !== '0') {
              this.store$.dispatch(new AuthActions.SendUserData(this.userInfo));
              this.modalClose();
            } else {
              this.notificationService$.error(optCodeResult.message);
            }
          } else {
          }
        })
      )
      .subscribe();
  }

  modalClose() {
    this.smsVerificationModalRef.hide();
    this.closeModal.emit('close');
  }

  verifyPhone() {
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
        user_id: '297',
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
      this.verifyPhone();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
