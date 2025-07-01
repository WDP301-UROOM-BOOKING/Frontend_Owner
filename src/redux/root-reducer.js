import { combineReducers } from 'redux';
import AuthReducer from './auth/reducer';
import HotelReducer from './hotel/reducer';
import HotelservicesReducer from './Hotelservices/reducer';
import ReportedFeedbackReducer from "./reportedFeedback/reducer";
import ReservationReducer from "./reservation/reducer";
import FeedbackReducer from "./feedback/reducer";
import MonthlyPaymentReducer from "./monthlyPayment/reducer";
import messageReducer from './message/reducer';
import RoomUnitReducer from './room_unit/reducer';
import SocketReducer from './socket/socketSlice';
import BankInfoReducer from './bankInfo/reducer'; // Thêm import

import DashboardReducer from './dashboard/reducer';
import { Room } from '@utils/Routes';
import roomReducer from './room/reducer';

const rootReducer = combineReducers({
    Auth: AuthReducer,
    Hotel: HotelReducer,
    Hotelservices: HotelservicesReducer,
    Room: roomReducer,
    Feedback: FeedbackReducer,
    ReportedFeedback: ReportedFeedbackReducer,
    Reservation: ReservationReducer,
    MonthlyPayment: MonthlyPaymentReducer,
    Message: messageReducer,
    Socket: SocketReducer,
    RoomUnit: RoomUnitReducer,
    BankInfo: BankInfoReducer, // Thêm vào đây
    Dashboard: DashboardReducer,
});

export default rootReducer;
