export const SET_FLASK_ID = "SET_FLASK_ID";
export const CLEAR_FLASK_ID = "CLEAR_FLASK_ID";

export const setFlaskID = (flaskID) => ({
  type: SET_FLASK_ID,
  payload: flaskID,
});

export const clearFlaskID = () => ({
  type: CLEAR_FLASK_ID,
});
