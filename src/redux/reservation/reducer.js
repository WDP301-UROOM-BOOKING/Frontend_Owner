import AuthActions from "./actions";
import ReservationActions from "./actions";

const initState = {
  reservations: [],
  error: null,
};

const Reducer = (state = initState, action) => {
  switch (action.type) {
    case ReservationActions.FETCH_RESERVATIONS:
      return { ...state, loading: true, error: null };
    case ReservationActions.FETCH_RESERVATIONS_SUCCESS:
      return {
        ...state,
        reservations: action.payload.reservations,
      };
    case ReservationActions.FETCH_RESERVATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default Reducer;
