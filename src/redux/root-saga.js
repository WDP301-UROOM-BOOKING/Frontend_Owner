import 'regenerator-runtime/runtime';
import {all} from 'redux-saga/effects';
import AuthSaga from './auth/saga'; 
import HotelSaga from './hotel/saga'; 
import HotelservicesSaga from './Hotelservices/saga'; 
import ReportFeedbackSaga from "./reportedFeedback/saga";
import ReservationSaga from "./reservation/saga";
import FeedbackSaga from "./feedback/saga";
import MonthlyPaymentSaga from "./monthlyPayment/saga";
import MessageSaga from "./message/saga";
import DashboardSaga from "./dashboard/saga";
import RoomSaga from "./room/saga";

export default function* rootSaga() {
  yield all([
    AuthSaga(),
    FeedbackSaga(),
    HotelSaga(),
    HotelservicesSaga(),
    ReportFeedbackSaga(),
    ReservationSaga(),
    MonthlyPaymentSaga(),
    MessageSaga(),
    DashboardSaga(),
    RoomSaga(),
  ]);
}
