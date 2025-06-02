import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api";

const MonthlyPaymentFactories = {
  fetchMonthlyPayments: (params) => api.get(ApiConstants.MONTHLY_PAYMENTS, { params }),
};

export default MonthlyPaymentFactories;
