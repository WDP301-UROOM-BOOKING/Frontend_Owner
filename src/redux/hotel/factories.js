import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  fetch_favorite_hotel: (ids, paramsQuery) => {
    const params = {
      address: "",
      district: "",
      star: "0",
    };
    if (paramsQuery.selectedCity != "" && paramsQuery.selectedCity) {
      params.address = paramsQuery.selectedCity;
    }
    if (paramsQuery.selectedDistrict != "" && paramsQuery.selectedDistrict) {
      params.district = paramsQuery.selectedDistrict;
    }
    if (paramsQuery.selectedStar != "0") {
      params.star = paramsQuery.selectedStar;
    }
    return api.post(ApiConstants.FETCH_FAVORITE_HOTELS, { ids, params });
  },
  get_all_hotels: () => {
    return api.get(ApiConstants.FETCH_ALL_HOTEL);
  },
  get_top3_hotels: () => {
    return api.get(ApiConstants.FETCH_TOP3_HOTEL);
  },
  fetchOwnerHotel: () => {
    return api.get(ApiConstants.FETCH_OWNER_HOTEL);
  },
  updateHotel: (hotelId, updateData) => {
    return api.put(`${ApiConstants.UPDATE_HOTEL}/${hotelId}`, updateData);
  },
  updateHotelServiceStatus: (hotelId, statusActive, serviceId) => {
    const url = ApiConstants.UPDATE_HOTEL_SERVICE_STATUS.replace(":hotelId", hotelId);
    return api.put(url, {statusActive: statusActive.statusActive, serviceId} );
  },
  createHotelService: (serviceData) => {
    return api.post(ApiConstants.CREATE_HOTEL_SERVICE, serviceData);
  },
  changeStatusHotel: (hotelId, ownerStatus) => {
    return api.put(`${ApiConstants.CHANGE_STATUS_HOTEL}/${hotelId}`, {ownerStatus});
  },

  createHotel: (createHotel) => {
    return api.post(ApiConstants.CREATE_HOTEL, createHotel);
  },
};

export default Factories;
