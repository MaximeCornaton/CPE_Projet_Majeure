import {
  NO_ACTION,
  IS_WAITING,
  IS_FIGHTING,
  UPDATE_FIGHT_REQUESTS,
} from "../actions/fightActions.jsx";

const initialState = {
  status: NO_ACTION,
  fightRequests: [],
};

const fightReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_WAITING:
      return {
        ...state,
        status: IS_WAITING,
      };
    case IS_FIGHTING:
      return {
        ...state,
        status: IS_FIGHTING,
      };
    case NO_ACTION:
      return {
        ...state,
        status: NO_ACTION,
      };
    case UPDATE_FIGHT_REQUESTS:
      return {
        ...state,
        fightRequests: action.fightRequests,
      };
    default:
      return state;
  }
};

export default fightReducer;
