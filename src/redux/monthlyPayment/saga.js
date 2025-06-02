import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import MonthlyPaymentActions from "./actions";
import MonthlyPaymentFactories from "./factories";

function* fetchMonthlyPayments() {
    yield takeEvery(MonthlyPaymentActions.FETCH_MONTHLY_PAYMENTS, function* (action) {
        try {
            const response = yield call(() => MonthlyPaymentFactories.fetchMonthlyPayments(action.payload));
            yield put({
                type: MonthlyPaymentActions.FETCH_MONTHLY_PAYMENTS_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            // handle error if needed
        }
    });
}

export default function* monthlyPaymentSaga() {
    yield all([
        fork(fetchMonthlyPayments),
    ]);
}