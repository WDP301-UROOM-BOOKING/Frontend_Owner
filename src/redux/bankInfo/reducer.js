import BankInfoActions from "./actions";

const initState = {
  bankInfo: null,
  hasBankInfo: false,
  showForm: true,
};

const Reducer = (state = initState, action) => {
  console.log('BankInfo Reducer - Action:', action.type, action.payload); // Debug log
  
  switch (action.type) {
    case BankInfoActions.SAVE_BANK_INFO:
      console.log('Saving bank info:', action.payload);
      return {
        ...state,
        bankInfo: action.payload,
        hasBankInfo: true,
        showForm: false,
      };

    case BankInfoActions.UPDATE_BANK_INFO:
      console.log('Updating bank info:', action.payload);
      return {
        ...state,
        bankInfo: { ...state.bankInfo, ...action.payload },
        showForm: false,
      };

    case BankInfoActions.DELETE_BANK_INFO:
      console.log('Deleting bank info');
      return {
        ...state,
        bankInfo: null,
        hasBankInfo: false,
        showForm: true,
      };

    case BankInfoActions.SET_SHOW_FORM:
      console.log('Setting show form:', action.payload);
      return {
        ...state,
        showForm: action.payload,
      };

    default:
      return state;
  }
};

export default Reducer;