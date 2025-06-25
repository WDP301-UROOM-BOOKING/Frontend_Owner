import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import HotelServiceActions from "./actions";
import Factories from "./factories"; 

function* updateHotelService() {
  yield takeEvery(HotelServiceActions.UPDATE_HOTEL_SERVICE, function* (action) {
    const { serviceId, updateData, onSuccess, onFailed, onError } = action.payload || {};

    if (!serviceId) {
      onFailed?.("Service ID không được để trống");
      return;
    }

    try {
      const response = yield call(() =>
        Factories.updateHotelService(serviceId, updateData)
      );

      if (response?.status === 200) {
        onSuccess?.(response.data);
        yield put({
          type: HotelServiceActions.UPDATE_HOTEL_SERVICE_SUCCESS,
          payload: response.data,
        });
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật dịch vụ";

      if (status >= 500) {
        onError?.(error);
      } else {
        onFailed?.(msg);
      }
    }
  });
}

export default function* hotelServiceSaga() {
  yield all([
    fork(updateHotelService),
    
  ]);
}
