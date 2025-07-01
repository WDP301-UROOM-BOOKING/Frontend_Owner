import RoomUnitActions from './action';

const initialState = {
  // Dữ liệu phòng
  rooms: [
    {
      id: 101,
      name: "101",
      capacity: 2,
      price: 85,
      type: "Single room",
      status: "available",
    },
    {
      id: 102,
      name: "102",
      capacity: 2,
      price: 85,
      type: "Single room",
      status: "available",
    },
    {
      id: 103,
      name: "103",
      type: "Double",
      capacity: 2,
      price: 85,
      type: "Single room",
      status: "available",
    },
    {
      id: 201,
      name: "201",
      type: "Double room",
      capacity: 4,
      price: 150,
      status: "available",
    },
    {
      id: 202,
      name: "202",
      type: "Double room",
      capacity: 4,
      price: 150,
      status: "available",
    },
    {
      id: 203,
      name: "203",
      type: "Double room",
      capacity: 4,
      price: 150,
      status: "available",
    },
    {
      id: 301,
      name: "301",
      type: "Family room",
      capacity: 8,
      price: 450,
      status: "available",
    },
    {
      id: 302,
      name: "302",
      type: "Family room",
      capacity: 8,
      price: 450,
      status: "available",
    },
  ],
  
  // Dữ liệu đặt phòng
  bookings: [],
  
  // Dịch vụ có sẵn
  availableServices: [
    { id: 1, name: "WiFi Cao cấp", price: 10 },
    { id: 2, name: "Bữa sáng", price: 15 },
    { id: 3, name: "Mini Bar", price: 25 },
    { id: 4, name: "Bãi đậu xe", price: 12 },
    { id: 5, name: "Dịch vụ Spa", price: 50 },
    { id: 6, name: "Sử dụng hồ bơi", price: 20 },
  ],
  
  // Bộ lọc và UI state
  filters: {
    roomType: "all", // all, available, single, double, suite
    dateRange: {
      currentDate: new Date(),
      viewDays: 14,
    },
  },
  
  // UI state
  loading: false,
  error: null,
  
  // Modal states
  selectedRoom: null,
  selectedBooking: null,
  checkInBooking: null,
  checkOutBooking: null,
  roomToEdit: null,
};

const RoomUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    // Room management
    case RoomUnitActions.FETCH_ROOMS:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case RoomUnitActions.FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: action.payload,
      };
      
    case RoomUnitActions.FETCH_ROOMS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case RoomUnitActions.ADD_ROOM_SUCCESS:
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
      
    case RoomUnitActions.UPDATE_ROOM_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.id ? action.payload : room
        ),
      };
      
    case RoomUnitActions.DELETE_ROOM_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
      };
      
    // Booking management
    case RoomUnitActions.FETCH_BOOKINGS:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case RoomUnitActions.FETCH_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: action.payload,
      };
      
    case RoomUnitActions.FETCH_BOOKINGS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case RoomUnitActions.ADD_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };
      
    case RoomUnitActions.UPDATE_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        ),
      };
      
    case RoomUnitActions.DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
      };
      
    // Check-in/Check-out
    case RoomUnitActions.CHECK_IN_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.bookingId
            ? {
                ...booking,
                checkedIn: true,
                paymentStatus: action.payload.depositAmount > 0 ? "partially paid" : "pending",
                depositAmount: action.payload.depositAmount,
              }
            : booking
        ),
      };
      
    case RoomUnitActions.CHECK_OUT_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.bookingId
            ? {
                ...booking,
                checkedOut: true,
                paymentStatus: "paid",
                services: action.payload.services,
              }
            : booking
        ),
      };
      
    // Filters
    case RoomUnitActions.SET_ROOM_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          roomType: action.payload,
        },
      };
      
    case RoomUnitActions.SET_DATE_RANGE:
      return {
        ...state,
        filters: {
          ...state.filters,
          dateRange: action.payload,
        },
      };
      
    // UI state
    case RoomUnitActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
      
    case RoomUnitActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
      
    case RoomUnitActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};

export default RoomUnitReducer;