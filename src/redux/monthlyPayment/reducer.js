import MonthlyPaymentActions from "./actions";

const initialState = {
    list: [],
    detail: null,
    loading: false,
    error: null,
};

const monthlyPaymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case MonthlyPaymentActions.FETCH_MONTHLY_PAYMENTS_SUCCESS:
            return { ...state, loading: false, list: action.payload.data };
        default:
            return state;
    }
};

export default monthlyPaymentReducer;
