import FeedbackActions from "./actions";

const initialState = {
  feedbacks: [],
  total: 0,
  page: 1,
  limit: 3,
  totalFeedback: 0,
  error: null,
  selectedFeedback: null,
  averageRating: 0,
  ratingBreakdown: {},
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case FeedbackActions.FETCH_USER_FEEDBACKS_SUCCESS:
      return {
        ...state,
        feedbacks: action.payload,
      };

    case FeedbackActions.UPDATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        feedbacks: state.feedbacks.map((fb) =>
          fb._id === action.payload._id ? action.payload : fb
        ),
      };

    case FeedbackActions.DELETE_FEEDBACK_SUCCESS:
      return {
        ...state,
        feedbacks: state.feedbacks.filter((fb) => fb._id !== action.payload),
      };
    case FeedbackActions.CREATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        feedbacks: [action.payload, ...state.feedbacks],
      };
    case FeedbackActions.FETCH_FEEDBACK_BY_ID_SUCCESS:
      return {
        ...state,
        selectedFeedback: action.payload,
      };

    case FeedbackActions.FETCH_FEEDBACK_BY_HOTELID_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        feedbacks: action.payload.listFeedback,
        total: action.payload.totalPages,
        totalFeedback: action.payload.totalFeedback,
        page: action.payload.currentPage,
        limit: action.payload.limit,
        averageRating: action.payload.averageRating,
        ratingBreakdown: action.payload.ratingBreakdown,
      };

    default:
      return state;
  }
};

export default feedbackReducer;
