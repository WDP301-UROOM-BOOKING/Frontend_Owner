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
    images: [
      "https://i.pinimg.com/736x/fa/02/06/fa0206cb4a813d05f5b56dc1c4681a8b.jpg",
      "https://i.pinimg.com/736x/0e/97/13/0e971336348fabb5a30df2ca76b512dd.jpg",
      "https://i.pinimg.com/736x/ad/54/bf/ad54bf18bebd9d71103b68cee09fe6fb.jpg",
      "https://i.pinimg.com/736x/f3/3f/eb/f33feb864f7f72b753b48c8a9003d405.jpg",
      "https://i.pinimg.com/736x/1c/31/7c/1c317c4053b0835a3a54944ace8b66f0.jpg",
    ],
    phoneNumber: "",
    email: "",
  },
  checkCreateHotel: false,
  createRoom: [
    // {
    //   name: "",
    //   type: "",
    //   price: 0,
    //   capacity: 0,
    //   description: "",
    //   images: [],
    //   facilities: [],
    //   quantity: 0,
    //   hotel: "",
    //   bed: [
    //     {
    //       bed: "",
    //       quantity: 0,
    //     }
    //   ]
    // },
  ],
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
    case HotelActions.CREATE_HOTEL: {
      return {
        ...state,
        loading: true,
        error: null,
        hotel: action.payload.hotel,
      };
    }
    default:
      return state;
  }
};

export default favoriteHotelReducer;
