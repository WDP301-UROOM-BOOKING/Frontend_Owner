import {
  FETCH_DASHBOARD_METRICS,
  FETCH_DASHBOARD_METRICS_SUCCESS,
  FETCH_DASHBOARD_METRICS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  error: null,
  data: {
    totalRevenue: 0,
    revpar: 0,
    adr: 0,
    profit: 0,
    occupancyRate: 0,
    averageRating: 0,
    returnRate: 0,
    revenueData: [],
    customerSegmentData: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }]
    },
    recentBookings: []
  }
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_METRICS:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_DASHBOARD_METRICS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
    
    case FETCH_DASHBOARD_METRICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default dashboardReducer; 