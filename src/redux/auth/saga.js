import { all, call, fork, put, takeEvery } from "@redux-saga/core/effects";
import AuthActions from "./actions";
import Factories from "./factories";
import { setToken } from "@utils/handleToken";

function* login() {
  yield takeEvery(AuthActions.LOGIN, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload;
    try {
      const response = yield call(() => Factories.login(data));
      if (response?.status === 200) {
        setToken(response.data.Data.token);
        yield put({
          type: AuthActions.LOGIN_SUCCESS,
          payload: { user: response.data.Data.user },
        });
        onSuccess && onSuccess(response.data.Data.user);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;
      console.log("status: ", status);
      console.log("msg: ", msg);
      // 👇 Phân biệt xử lý theo loại lỗi
      if (status >= 500) {
        onError && onError(error); // Lỗi server
      } else {
        onFailed && onFailed(msg); // Lỗi logic như 401, 403
      }
    }
  });
}

function* register() {
  yield takeEvery(AuthActions.REGISTER, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload;
    console.log("Data: ", data);
    try {
      const response = yield call(() => Factories.register_owner(data));
      if (response?.status === 200) {
        yield put({
          type: AuthActions.REGISTER_SUCCESS,
          payload: { user: response.data.Data.user },
        });
        onSuccess && onSuccess(response.data.Data.user);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(msg);
      }
    }
  });
}
function* verify_email() {
  yield takeEvery(AuthActions.VERIFY_EMAIL, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload;
    try {
      const response = yield call(() => Factories.verify_email(data));
      console.log(response?.status);

      if (response?.status === 200) {
        yield put({
          type: AuthActions.VERIFY_EMAIL_SUCCESS,
          payload: { user: response.data.Data.user },
        });
        onSuccess && onSuccess(response.data.Data.user);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(msg);
      }
    }
  });
}

function* resend_verification() {
  yield takeEvery(AuthActions.RESEND_VERIFICATION, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload;
    try {
      const response = yield call(() => Factories.resend_verification(data));

      if (response?.status === 200) {
        yield put({
          type: AuthActions.RESEND_VERIFICATION_SUCCESS,
          payload: { email: response.data.Data.email },
        });
        onSuccess && onSuccess(response.data.Data);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(msg);
      }
    }
  });
}
function* update_profile() {
  yield takeEvery(AuthActions.UPDATE_PROFILE, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload;

    try {
      const response = yield call(() => Factories.update_profile(data));

      console.log("status: ", response?.status);
      console.log("data: ", response?.data.Data);

      if (response?.status === 200) {
        const { user } = response.data.Data;

        // Cập nhật vào redux store
        yield put({
          type: AuthActions.UPDATE_PROFILE_SUCCESS,
          payload: { user },
        });

        onSuccess && onSuccess(user);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;

      console.log("status: ", status);
      console.log("msg: ", msg);

      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(msg);
      }
    }
  });
}
function* change_password() {
  yield takeEvery(AuthActions.CHANGE_PASSWORD, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload;

    try {
      const response = yield call(() => Factories.change_password(data));

      if (response?.status === 200) {
        yield put({
          type: AuthActions.CHANGE_PASSWORD_SUCCESS,
        });

        onSuccess && onSuccess();
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;

      console.log("status: ", status);
      console.log("msg: ", msg);

      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(msg);
      }
    }
  });
}
function* update_avatar() {
  yield takeEvery(AuthActions.UPDATE_AVATAR, function* (action) {
    const { formData, onSuccess, onFailed, onError } = action.payload;

    try {
      const response = yield call(() => Factories.update_avatar(formData));

      if (response?.status === 200) {
        console.log("image: ", response?.data?.Data.image);
        yield put({
          type: AuthActions.UPDATE_AVATAR_SUCCESS,
          payload: { image: response?.data?.Data.image },
        });

        onSuccess && onSuccess(response?.data?.Data.MsgYes);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.MsgNo;

      console.log("status: ", status);
      console.log("msg: ", msg);

      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(msg);
      }
    }
  });
}
export default function* userSaga() {
  yield all([
    fork(login),
    fork(register),
    fork(verify_email),
    fork(resend_verification),
    fork(update_avatar),
    fork(update_profile),
    fork(change_password),
  ]);
}
