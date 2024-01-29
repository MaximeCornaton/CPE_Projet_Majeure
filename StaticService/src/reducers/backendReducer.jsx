import { SET_FLASK_ID, CLEAR_FLASK_ID } from "../actions/backendActions";

const initialState = {
  flaskID: null,
};

const backendReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FLASK_ID:
      return {
        ...state,
        flaskID: action.payload,
      };

    case CLEAR_FLASK_ID:
      return {
        ...state,
        flaskID: null,
      };

    default:
      return state;
  }
};

export default backendReducer;
