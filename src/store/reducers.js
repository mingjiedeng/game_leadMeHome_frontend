import { combineReducers } from 'redux';
import T from '../actions/actionTypes';
import { isEmpty } from '../utils';

export const user = (state = null, action) =>
  action.type === T.CHANGE_USER ? action.payload : state;

export const topLists = (state = [], action) =>
  action.type === T.UPDATE_TOPLISTS ? action.payload : state;

export const scores = (state = [], action) => {
  let origin;
  let newScore;

  const isBetter = (newOne, originScore) =>
    newOne.saved === originScore.saved
      ? newOne.seconds < originScore.seconds
      : newOne.saved > originScore.saved;

  switch (action.type) {
    case T.UPDATE_SCORE:
      newScore = action.payload;
      origin = state.filter(score => score.level === newScore.level);
      if (isEmpty(origin)) {
        return [...state, newScore];
      }
      if (isBetter(newScore, origin[0])) {
        return state.map(score =>
          score.level === newScore.level ? newScore : score
        );
      }
      return state;
    case T.SET_SCORES:
      return action.payload;
    default:
      return state;
  }
};

export const levelsAmount = (state = 10, action) =>
  action.type === T.SET_LEVELS_AMOUNT ? action.payload : state;

export const level = (state = 1, action) =>
  action.type === T.UPDATE_RUNNING_LEVEL ? action.payload : state;

export const saved = (state = 10, action) =>
  action.type === T.UPDATE_SAVED ? action.payload : state;

export const seconds = (state = 0, action) =>
  action.type === T.TIME_RUNNING ? action.payload : state;

export default combineReducers({
  user,
  scores,
  topLists,
  levelsAmount,
  gameStats: combineReducers({
    level,
    saved,
    seconds
  })
});
