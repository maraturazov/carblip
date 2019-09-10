import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import * as AuthActions from 'app/shared/states/auth/auth.actions';
import { IAuthGroup, IProfile } from './auth.interfaces';

export const authAdapter: EntityAdapter<any> = createEntityAdapter<any>({});

const emptyObj: IProfile = {
  id: null,
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: null,
  email_address: '',
  password: null,
  facebook_id: null,
  device_token: '',
  device_type: '',
  access_token: null,
  otp: null,
  phone: '',
  phone_verified: false,
  status: null,
  zipcode: null,
  location: null,
  login_verify_code: '',
  lease_captured: false,
};

const authInitialState = {
  user: emptyObj,
  fetching: false,
  didFetch: false,
  profileResult: null,
  errors: [],
  emailCheckResult: null,
  registerPhoneResult: null,
  verifyPhoneResult: null,
  phonenoResult: null,
  optCodeResult: null,
};

export function authReducer(
  state: IAuthGroup = authInitialState,
  action: AuthActions.All
): IAuthGroup {
  switch (action.type) {
    case AuthActions.FETCH_USER_INFO:
    case AuthActions.REGISTER_PHONE:
    case AuthActions.VERIFY_PHONE:
    case AuthActions.RESEND_CODE:
    case AuthActions.FETCH_USER_DATA:
    case AuthActions.SEND_OTP_CODE:
    case AuthActions.SEND_USER_DATA:
    case AuthActions.SEND_PHONENO_FOR_OTP: {
      return {
        ...state,
        fetching: true,
        didFetch: false,
        errors: [],
      };
    }

    case AuthActions.FETCH_USER_INFO_SUCCESS: {
      return {
        ...state,
        emailCheckResult: action.payload.data,
        fetching: false,
        didFetch: true,
        errors: [],
      };
    }

    case AuthActions.REGISTER_PHONE_SUCCESS: {
      return {
        ...state,
        registerPhoneResult: action.payload.data,
        fetching: false,
        didFetch: true,
        errors: [],
      };
    }

    case AuthActions.VERIFY_PHONE_SUCCESS: {
      return {
        ...state,
        verifyPhoneResult: action.payload.data,
        fetching: false,
        didFetch: true,
        errors: [],
      };
    }

    case AuthActions.RESEND_CODE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [],
      };
    }

    case AuthActions.FETCH_USER_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [],
        user: action.payload.data,
      };
    }

    case AuthActions.SEND_USER_DATA_SUCCESS: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        profileResult: action.payload.data,
        errors: [],
      };
    }

    case AuthActions.SEND_PHONENO_FOR_OTP_SUCCESS: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        phonenoResult: action.payload.data,
        errors: [],
      };
    }

    case AuthActions.SEND_OTP_CODE_SUCCESS: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        optCodeResult: action.payload.data,
        errors: [],
      };
    }

    case AuthActions.SEND_OTP_CODE_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: false,
        optCodeResult: null,
        errors: [...state.errors, action.payload.error],
      };
    }
    case AuthActions.FETCH_USER_INFO_FAILED:
    case AuthActions.REGISTER_PHONE_FAILED:
    case AuthActions.VERIFY_PHONE_FAILED:
    case AuthActions.RESEND_CODE_FAILED:
    case AuthActions.FETCH_USER_DATA_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: false,
        errors: [...state.errors, action.payload.error],
      };
    }

    case AuthActions.SEND_USER_DATA_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        profileResult: null,
        errors: [...state.errors, action.payload.error],
      };
    }

    case AuthActions.SEND_PHONENO_FOR_OTP_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: false,
        phonenoResult: null,
        errors: [...state.errors, action.payload.error],
      };
    }

    case AuthActions.INITIALIZE_PROFILE_STATE: {
      return {
        ...state,
        profileResult: null,
        phonenoResult: null,
        optCodeResult: null,
      };
    }

    case AuthActions.CLEAR_USER_INFO: {
      return {
        ...authInitialState,
      };
    }

    default:
      return state;
  }
}
