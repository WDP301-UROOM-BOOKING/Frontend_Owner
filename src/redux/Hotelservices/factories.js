import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const HotelServiceFactories = {


  updateHotelService: (serviceId, updateData) => {
    return api.put(`${ApiConstants.UPDATE_HOTEL_SERVICE}/${serviceId}`, updateData);
  },

};

export default HotelServiceFactories;
