const ApiConstants = {
  //AUTH:
  LOGIN_OWNER: "/auth/login_owner",
  REGISTER_OWNER: "/auth/register_owner",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  CHANGE_PASSWORD: "/auth/changePassword_customer",
  UPDATE_PROFILE: "/auth/updateProfile_customer",
  UPDATE_AVATAR: "/auth/update_avatar",
  FORGOT_PASSWORD: "/auth/forgot_password",
  RESET_PASSWORD: "/auth/reset_password",
  VERIFY_FORGOT_PASSWORD: "/auth/verify_forgot_password",
  //FEEDBACK:
  FEEDBACK_HOTEL: "/feedback/get-feedback-hotel/:hotelId",
  FETCH_FEEDBACK_BY_ID: "/feedback/getFeedbackById/:feedbackId",
  ///REPORTFEEDBACK
  REPORT_FEEDBACK: "reportFeedback/create_report_feedback_owner",
  FETCH_REPORTS_BY_USERID: "reportFeedback/my-reports",
  DELETE_REPORTED_FEEDBACK: "reportFeedback/delete_report_feedback/:reportId",
  //HOTEL
  CREATE_HOTEL: "/hotel/create-hotel",
  FETCH_OWNER_HOTEL: "/hotel/owner-hotels",
  UPDATE_HOTEL: "/hotel/update-hotel",
  CREATE_HOTEL_SERVICE: "/hotel/add-service",
  UPDATE_HOTEL_SERVICE: "/hotelservices/update-service",
  UPDATE_HOTEL_SERVICE_STATUS: "/hotel/updateStatusService/:hotelId/status",
  CHANGE_STATUS_HOTEL: "/hotel/changeStatus-hotel",
  //RESERVATION
  RESERVATIONS: "/payment/reservations",
  //MONTHLYPAYMENT
  MONTHLY_PAYMENTS: "/monthly-payment/all",

  //chat
  FETCH_CHAT_MESSAGE: "/chat/chat-history/:receiverId",
  FETCH_CHAT_ALL_USERS: "/chat/chat-users",

  //Image_Hotel:
  UPLOAD_HOTEL_IMAGE: "/hotel/upload_images",
  DELETE_HOTEL_IMAGE: "/hotel/delete_images",

  //Room:
  FETCH_ROOM: "/room/rooms_information/:hotelId",
  ROOMS_BY_HOTEL_ID: (hotelId) => `/room/list_room/${hotelId}`,
  CREATE_BOOKING_OFFLINE: "/payment/create-booking-offline",
};

export default ApiConstants;
