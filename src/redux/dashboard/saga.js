import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_DASHBOARD_METRICS,
  fetchDashboardMetricsSuccess,
  fetchDashboardMetricsFailure,
} from "./actions";
import DashboardFactories from "./factories";

function* fetchDashboardMetricsSaga(action) {
  try {
    const { period } = action.payload;
    const response = yield call(DashboardFactories.fetchDashboardMetrics, { period });
    
    if (response.data.error === false) {
      yield put(fetchDashboardMetricsSuccess(response.data.data));
    } else {
      yield put(fetchDashboardMetricsFailure(response.data.message));
    }
  } catch (error) {
    yield put(fetchDashboardMetricsFailure(error.message));
  }
}

export default function* dashboardSaga() {
  yield takeLatest(FETCH_DASHBOARD_METRICS, fetchDashboardMetricsSaga);
} 