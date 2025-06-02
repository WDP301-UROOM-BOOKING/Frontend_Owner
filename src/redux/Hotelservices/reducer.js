import HotelServiceActions from "./actions";

const initialState = {
  loading: false,
  data: null,
};

const hotelServiceReducer = (state = initialState, action) => {
  switch (action.type) {

    case HotelServiceActions.UPDATE_HOTEL_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map(service =>
          service._id === action.payload._id ? action.payload : service
        ),
      };

    default:
      return state;
  }
};

export default hotelServiceReducer;
