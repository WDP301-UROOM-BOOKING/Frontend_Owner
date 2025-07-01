import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api";

const DashboardFactories = {
  fetchDashboardMetrics: (params) => api.get(ApiConstants.DASHBOARD_METRICS, { params }),
};

export default DashboardFactories; 