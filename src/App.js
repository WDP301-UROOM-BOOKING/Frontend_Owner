import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as Routers from "@utils/Routes";

import LoginHotelPage from "@pages/hotel_host/login_register/LoginHotelPage";
import RegisterHotelPage from "@pages/hotel_host/login_register/RegisterHotelPage";
import ForgetPasswordHotelPage from "@pages/hotel_host/login_register/ForgetPasswordHotelPage";
import VerifyCodeHotelPage from "@pages/hotel_host/login_register/VerifyCodeHotelPage";
import ResetPasswordHotelPage from "@pages/hotel_host/login_register/ResetPasswordHotelPage";
import MyAccountHotelPage from "@pages/hotel_host/information/MyAccountHotelPage";
import ListFeedbackHotelPage from "@pages/hotel_host/Feedback/ListFeedbackHotelPage";
import ReportedFeedbackHotel from "@pages/hotel_host/Feedback/ReportedFeedbackHotel";
import WaitPendingPage from "@pages/WaitPendingPage";
import HomeHotel from "@pages/hotel_host/create_hotel/HomeHotel";
import BookingRegistration from "@pages/hotel_host/create_hotel/BookingRegistration";
import BookingPropertyName from "@pages/hotel_host/create_hotel/BookingPropertyName";
import BookingPropertyLocation from "@pages/hotel_host/create_hotel/BookingPropertyLocation";
import BookingPropertyFacility from "@pages/hotel_host/create_hotel/BookingPropertyFacility";
import BookingPropertyCheckInOut from "@pages/hotel_host/create_hotel/BookingPropertyCheckInOut";
import BookingPropertyDescription from "@pages/hotel_host/create_hotel/BookingPropertyDescription";
import BookingPropertyChecklist from "@pages/hotel_host/create_hotel/BookingPropertyChecklist";
import ErrorPage from "@pages/ErrorPage";
import BannedPage from "@pages/BannedPage";
import DocumentUpload from "@pages/hotel_host/login_register/DocumentUpload";
import Transaction from "@pages/hotel_host/Transaction";
import RoomAvailabilityCalendar from "@pages/hotel_host/RoomAvailabilityCalendar";
import TransactionDetail from "@pages/hotel_host/TransactionDetail";
import CreateRoom from "@pages/hotel_host/create_hotel/CreateRoom";
import RoomNamingForm from "@pages/hotel_host/create_hotel/RoomNameForm";
import PricingSetupForm from "@pages/hotel_host/create_hotel/PricingSetupForm";
import RoomImageForm from "@pages/hotel_host/create_hotel/RoomImageForm";
import RoomListingPage from "@pages/hotel_host/create_hotel/RoomListingPage";
import AdditionalServicesPage from "@pages/hotel_host/service/AdditionalServicesPage";
import DataAnalysisAI from "@pages/hotel_host/AI/DataAnalysisAI";
import HotelManagement from "@pages/hotel_host/hotel/HotelManagement";
import Room from "@pages/room/Room";
import ViewInformation from "@pages/hotel_host/information/components/ViewInformationHotel";
import VerifyCodeRegisterPage from "@pages/hotel_host/login_register/VerifyCodeRegisterPage";
import { useEffect } from "react";
import { useAppSelector } from "@redux/store";
import { useDispatch } from "react-redux";
import { initializeSocket } from "@redux/socket/socketSlice";

function App() {
  useEffect(() => {
    document.title = "Uroom Owner";
  }, []);

  const dispatch = useDispatch();
  const Socket = useAppSelector((state) => state.Socket.socket);
  const Auth = useAppSelector((state) => state.Auth.Auth);

  useEffect(() => {
    if(Auth?._id === -1) return;
    dispatch(initializeSocket());
  }, [Auth?._id]);

  useEffect(() => {
    if (!Socket) return;
    if(Auth?._id === -1) return;

    console.log("Socket initialized:", Socket.id);
    Socket.emit("register", Auth._id);

    const handleForceJoinRoom = ({ roomId, partnerId }) => {
      Socket.emit("join-room", {
        userId: Auth._id,
        partnerId,
      });
    };

    Socket.on("force-join-room", handleForceJoinRoom);

    return () => {
      Socket.off("force-join-room", handleForceJoinRoom);
    };
  }, [Socket, Auth?._id]);
  
  return (
    <Router>
      <Routes>
        <Route path={Routers.BannedPage} element={<BannedPage />} />
        <Route path={Routers.ErrorPage} element={<ErrorPage />} />
        <Route path={Routers.WaitPendingPage} element={<WaitPendingPage />} />

        {/*|Hotel Host */}
        <Route path={Routers.Transaction} element={<Transaction />} />
        <Route
          path={Routers.BookingSchedule}
          element={<RoomAvailabilityCalendar />}
        />
        <Route
          path={Routers.TransactionDetail}
          element={<TransactionDetail />}
        />
        <Route
          path={Routers.BookingRegistration}
          element={<BookingRegistration />}
        />
        <Route
          path={Routers.BookingPropertyName}
          element={<BookingPropertyName />}
        />
        <Route
          path={Routers.BookingPropertyLocation}
          element={<BookingPropertyLocation />}
        />
        <Route
          path={Routers.BookingPropertyFacility}
          element={<BookingPropertyFacility />}
        />
        <Route
          path={Routers.BookingPropertyCheckInOut}
          element={<BookingPropertyCheckInOut />}
        />
        <Route
          path={Routers.BookingPropertyDescription}
          element={<BookingPropertyDescription />}
        />
        <Route
          path={Routers.BookingPropertyChecklist}
          element={<BookingPropertyChecklist />}
        />
        <Route path={Routers.CreateRoom} element={<CreateRoom />} />
        <Route path={Routers.RoomNamingForm} element={<RoomNamingForm />} />
        <Route path={Routers.PricingSetupForm} element={<PricingSetupForm />} />
        <Route path={Routers.RoomImageForm} element={<RoomImageForm />} />
        <Route path={Routers.RoomListingPage} element={<RoomListingPage />} />
        <Route
          path={Routers.AdditionalServicesPage}
          element={<AdditionalServicesPage />}
        />

        {/*|Hotel Host */}
        <Route path={Routers.HotelManagement} element={<HotelManagement />} />
        <Route path={Routers.HomeHotel} element={<HomeHotel />} />
        <Route path={Routers.LoginHotelPage} element={<LoginHotelPage />} />
        <Route
          path={Routers.RegisterHotelPage}
          element={<RegisterHotelPage />}
        />
        <Route
          path={Routers.VerifyCodeRegisterPage}
          element={<VerifyCodeRegisterPage />}
        />
        <Route
          path={Routers.ForgetPasswordHotelPage}
          element={<ForgetPasswordHotelPage />}
        />
        <Route
          path={Routers.VerifyCodeHotelPage}
          element={<VerifyCodeHotelPage />}
        />
        <Route
          path={Routers.ResetPasswordHotelPage}
          element={<ResetPasswordHotelPage />}
        />
        <Route
          path={Routers.MyAccountHotelPage}
          element={<MyAccountHotelPage />}
        />
        <Route
          path={Routers.ListFeedbackHotelPage}
          element={<ListFeedbackHotelPage />}
        />
        <Route
          path={Routers.ReportedFeedbackHotel}
          element={<ReportedFeedbackHotel />}
        />
        <Route path={Routers.DocumentUpload} element={<DocumentUpload />} />
        <Route path={Routers.DataAnalysisAI} element={<DataAnalysisAI />} />
        <Route path={Routers.Room} element={<Room />} />

        <Route
          path={Routers.MyAccountHotelPage}
          element={<MyAccountHotelPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
