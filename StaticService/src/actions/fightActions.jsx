export const NO_ACTION = "NO_ACTION";
export const IS_WAITING = "IS_WAITING";
export const IS_FIGHTING = "IS_FIGHTING";
export const UPDATE_FIGHT_REQUESTS = "UPDATE_FIGHT_REQUESTS";

export const isWaiting = () => ({
  type: IS_WAITING,
});

export const isFighting = () => ({
  type: IS_FIGHTING,
});

export const noAction = () => ({
  type: NO_ACTION,
});

export const updateFightRequests = (fightRequests) => ({
  type: UPDATE_FIGHT_REQUESTS,
  fightRequests,
});
