import { all, call, fork, put, takeEvery } from "@redux-saga/core/effects";
import ReservationActions from "./actions";
import Factories from "./factories";



function* fetchReservations() {
  yield takeEvery(ReservationActions.FETCH_RESERVATIONS, function* (action) {
    try {
      const response = yield call(() => Factories.fetchReservations(action.payload));
      yield put({
        type: ReservationActions.FETCH_RESERVATIONS_SUCCESS,
        payload: {
          reservations: response.data.reservations,
          total: response.data.total,
        },
      });
    } catch (error) {
      yield put({
        type: ReservationActions.FETCH_RESERVATIONS_FAILURE,
        payload: error.message || "Error fetching reservations",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchReservations),
  ]);
}
