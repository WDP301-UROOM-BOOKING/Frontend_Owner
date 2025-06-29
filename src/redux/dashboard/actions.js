export const FETCH_DASHBOARD_METRICS = "FETCH_DASHBOARD_METRICS";
export const FETCH_DASHBOARD_METRICS_SUCCESS = "FETCH_DASHBOARD_METRICS_SUCCESS";
export const FETCH_DASHBOARD_METRICS_FAILURE = "FETCH_DASHBOARD_METRICS_FAILURE";

export const fetchDashboardMetrics = (period = "month") => ({
  type: FETCH_DASHBOARD_METRICS,
  payload: { period }
});

export const fetchDashboardMetricsSuccess = (data) => ({
  type: FETCH_DASHBOARD_METRICS_SUCCESS,
  payload: data
});

export const fetchDashboardMetricsFailure = (error) => ({
  type: FETCH_DASHBOARD_METRICS_FAILURE,
  payload: error
}); 