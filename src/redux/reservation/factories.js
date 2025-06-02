import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  fetchReservations: (params) => {
    // params: { filter, sort, page, limit }
    return api.get(ApiConstants.RESERVATIONS, { params });
  },
};

export default Factories;
