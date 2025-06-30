import RoomActions from "./actions";

const initialState = {
  rooms: [],
  roomDetail: null,
  loading: false,
  error: null,
  createRoom: {
    // Basic Info
    name: "",
    type: "Single Room",
    capacity: 1,
    quantity: 1,
    description: "",
    bed: [],
    facilities: [],
    images: [],
    price: 0,
  },
  editRoom: null,
  checkCreateRoom: false,
  // List of rooms being created for hotel creation process
  createRoomList: [],
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case RoomActions.FETCH_ROOM_SUCCESS:
      return {
        ...state,
        rooms: action.payload,
        error: null, 
      };  
    case RoomActions.FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        rooms: action.payload,
        loading: false,
        error: null,
      };

    case RoomActions.FETCH_ROOM_DETAIL_SUCCESS:
      return {
        ...state,
        roomDetail: action.payload,
        loading: false,
        error: null,
      };

    case RoomActions.CREATE_ROOM_SUCCESS:
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
        loading: false,
        error: null,
        createRoom: initialState.createRoom,
        checkCreateRoom: false,
      };

    case RoomActions.UPDATE_ROOM_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room
        ),
        roomDetail:
          state.roomDetail?._id === action.payload._id
            ? action.payload
            : state.roomDetail,
        loading: false,
        error: null,
      };

    case RoomActions.DELETE_ROOM_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.filter((room) => room._id !== action.payload),
        roomDetail:
          state.roomDetail?._id === action.payload ? null : state.roomDetail,
        loading: false,
        error: null,
      };

    case RoomActions.SAVE_ROOM_NAME_CREATE:
      return {
        ...state,
        createRoom: {
          ...state.createRoom,
          name: action.payload.name,
        },
      };

    case RoomActions.SAVE_ROOM_DETAILS_CREATE:
      return {
        ...state,
        createRoom: {
          ...state.createRoom,
          type: action.payload.type,
          capacity: action.payload.capacity,
          quantity: action.payload.quantity,
          description: action.payload.description,
          bed: action.payload.bed,
          facilities: action.payload.facilities,
        },
      };

    case RoomActions.SAVE_ROOM_IMAGES_CREATE:
      return {
        ...state,
        createRoom: {
          ...state.createRoom,
          images: action.payload.images,
        },
      };

    case RoomActions.SAVE_ROOM_PRICING_CREATE:
      return {
        ...state,
        createRoom: {
          ...state.createRoom,
          price: action.payload.price,
        },
        checkCreateRoom: true,
      };

    case RoomActions.CLEAR_ROOM_CREATE:
      return {
        ...state,
        createRoom: initialState.createRoom,
        checkCreateRoom: false,
      };

    case RoomActions.TOGGLE_ROOM_STATUS:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room._id === action.payload.roomId
            ? { ...room, isActive: !room.isActive }
            : room
        ),
      };

    case RoomActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case RoomActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case RoomActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // Edit Room Actions
    case "SET_EDIT_ROOM":
      return {
        ...state,
        editRoom: action.payload,
      };

    case "CLEAR_EDIT_ROOM":
      return {
        ...state,
        editRoom: null,
      };

    // Room Create List Management Actions
    case RoomActions.SAVE_ROOM_TO_CREATE_LIST:
      return {
        ...state,
        createRoomList: [...state.createRoomList, action.payload],
      };

    case RoomActions.EDIT_ROOM_IN_CREATE_LIST:
      return {
        ...state,
        createRoomList: state.createRoomList.map((room, index) =>
          index === action.payload.index 
            ? { ...room, ...action.payload.roomData } 
            : room
        ),
      };

    case RoomActions.DELETE_ROOM_FROM_CREATE_LIST:
      return {
        ...state,
        createRoomList: state.createRoomList.filter((_, index) => 
          index !== action.payload.index
        ),
      };

    case RoomActions.CLEAR_ROOM_CREATE_LIST:
      return {
        ...state,
        createRoomList: [],
      };

    default:
      return state;
  }
};

export default roomReducer;
