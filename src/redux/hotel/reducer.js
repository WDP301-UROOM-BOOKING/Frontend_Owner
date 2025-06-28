import { Hotel } from "lucide-react";
import HotelActions from "./actions";

const initialState = {
  hotel: null,
  hotelDetail: null,
  error: null,
  top3Hotels: [],
  loading: false,
  data: null,
  error: null,
  createHotel: {
    hotelName: "",
    city: "",
    district: "",
    ward: "",
    specificAddress: "",
    address: "",
    facilities: [],
    checkInStart: "",
    checkInEnd: "",
    checkOutStart: "",
    checkOutEnd: "",
    phoneNumber: "",
    email: "",
    star: 1,
    description: "",
    images: [],
    businessDocuments: [],
    phoneNumber: "",
    email: "",
  },
  checkCreateHotel: false,
  createService: [],
  createRoom: [],
};

const favoriteHotelReducer = (state = initialState, action) => {
  switch (action.type) {
    case HotelActions.FETCH_FAVORITE_HOTELS_SUCCESS:
      return {
        ...state,
        hotels: action.payload,
      };
    case HotelActions.FETCH_OWNER_HOTEL_SUCCESS:
      return {
        ...state,
        hotel: action.payload.hotels[0],
        data: action.payload,
        loading: false,
      };
    case HotelActions.FETCH_All_HOTEL_SUCCESS:
      return {
        ...state,
        hotels: action.payload,
      };
    case HotelActions.FETCH_TOP3_HOTEL_SUCCESS:
      return {
        ...state,
        top3Hotels: action.payload,
      };
    case HotelActions.UPDATE_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          ...action.payload,
        },
      };
    case HotelActions.UPDATE_HOTEL_SERVICE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          services: state.data.services.map((service) =>
            service._id === action.payload._id
              ? { ...service, statusActive: action.payload.statusActive }
              : service
          ),
        },
      };
    case HotelActions.CREATE_HOTEL_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,

          services: [...(state.data?.services || []), action.payload],
        },
        error: null,
      };
    case HotelActions.SAVE_HOTEL_NAME_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          hotelName: action.payload.hotelName,
          phoneNumber: action.payload.phoneNumber,
          email: action.payload.email,
        },
      };
    case HotelActions.SAVE_HOTEL_ADDRESS_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          specificAddress: action.payload.specificAddress,
          address: action.payload.address,
          city: action.payload.city,
          district: action.payload.district,
          ward: action.payload.ward,
        },
      };
    case HotelActions.SAVE_HOTEL_CHECKTIME_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          checkInStart: action.payload.checkInStart,
          checkInEnd: action.payload.checkInEnd,
          checkOutStart: action.payload.checkOutStart,
          checkOutEnd: action.payload.checkOutEnd,
        },
      };
    case HotelActions.SAVE_HOTEL_FACILITIES_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          facilities: action.payload.facilities,
        },
      };
    case HotelActions.SAVE_HOTEL_DESCRIPTION_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          star: action.payload.star,
          description: action.payload.description,
          images: action.payload.images,
          checkCreateHotel: action.payload.checkCreateHotel,
        },
      };
    case HotelActions.EDIT_HOTEL_DESCRIPTION_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          checkCreateHotel: action.payload.checkCreateHotel,
        },
      };
    case HotelActions.CREATE_HOTEL_SUCCESS: {
      return {
        ...state,
        loading: true,
        error: null,
        hotel: action.payload.hotel,
      };
    }
    case HotelActions.CLEAR_HOTEL_CREATE:
      return {
        ...state,
        createHotel: {
          ...initialState.createHotel,
        },
      };
    case HotelActions.SAVE_HOTEL_DOCUMENTS_CREATE:
      return {
        ...state,
        createHotel: {
          ...state.createHotel,
          businessDocuments: action.payload.businessDocuments,
        },
      };
    case HotelActions.SAVE_SERVICE_CREATE:
      return {
        ...state,
        createService: [...state.createService, action.payload],
      };
    case HotelActions.EDIT_SERVICE_CREATE:
      return {
        ...state,
        createService: state.createService.map((service, index) =>
          index === action.payload.index ? { ...service, ...action.payload.serviceData } : service
        ),
      };
    case HotelActions.DELETE_SERVICE_CREATE:
      return {
        ...state,
        createService: state.createService.filter((_, index) => index !== action.payload.index),
      };
    case HotelActions.CLEAR_SERVICE_CREATE:
      return {
        ...state,
        createService: [],
      };
    default:
      return state;
  }
};

export default favoriteHotelReducer;
