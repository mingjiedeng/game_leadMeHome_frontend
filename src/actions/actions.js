import axios from 'axios';
import { toast } from 'react-toastify';
import T from './actionTypes';
import { SERVER_HOST } from '../config';
import { formatError, assessStars } from '../utils';

export const getTopLists = () => dispatch => {
  axios
    .get(`${SERVER_HOST}/user/topList`)
    .then(res => {
      dispatch({
        type: T.UPDATE_TOPLISTS,
        payload: res.data
      });
    })
    .catch(err => {
      toast.error(formatError(err));
    });
};

export const getLevelsAmount = () => dispatch => {
  axios
    .get(`${SERVER_HOST}/gameData/levelsAmount`)
    .then(res => {
      dispatch({
        type: T.SET_LEVELS_AMOUNT,
        payload: res.data
      });
    })
    .catch(err => {
      toast.error(formatError(err));
    });
};

export const setScores = scores => ({
  type: T.SET_SCORES,
  payload: scores
});

export const updateScore = (user, level, saved, seconds) => dispatch => {
  const token = localStorage.getItem('jwtToken');
  if (user && user.name && token) {
    axios({
      method: 'patch',
      url: `${SERVER_HOST}/user/${user.name}/score`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { level, saved, seconds }
    })
      .then(res => {
        dispatch(setScores(res.data.scores));
        dispatch(getTopLists());
      })
      .catch(err => {
        toast.error(formatError(err));
      });
  } else {
    const star = assessStars(saved);
    dispatch({
      type: T.UPDATE_SCORE,
      payload: { level, saved, seconds, star }
    });
  }
};

export const setUser = user => ({
  type: T.CHANGE_USER,
  payload: {
    name: user.username
  }
});

const setUserState = data => dispatch => {
  const { user, token } = data;
  localStorage.setItem('jwtToken', token);
  dispatch(setUser(user));
  dispatch(setScores(user.scores));
};

export const login = (username, password) => dispatch =>
  new Promise((resolve, reject) => {
    axios
      .post(`${SERVER_HOST}/auth`, { username, password })
      .then(res => {
        setUserState(res.data)(dispatch);
        resolve();
      })
      .catch(err => reject(err));
  });

export const register = (username, password) => dispatch =>
  new Promise((resolve, reject) => {
    axios
      .post(`${SERVER_HOST}/auth/register`, { username, password })
      .then(res => {
        setUserState(res.data)(dispatch);
        resolve();
      })
      .catch(err => reject(err));
  });

export const signOut = () => dispatch => {
  localStorage.removeItem('jwtToken');
  dispatch(setUser({ name: '' }));
  dispatch(setScores([]));
};

export const updateRunningLevel = level => ({
  type: T.UPDATE_RUNNING_LEVEL,
  payload: level
});

export const updateSaved = saved => ({
  type: T.UPDATE_SAVED,
  payload: saved
});

export const updateRunningTime = seconds => ({
  type: T.TIME_RUNNING,
  payload: seconds
});

export const getUserInfo = name => dispatch => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    axios({
      method: 'get',
      url: `${SERVER_HOST}/user/${name}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const user = res.data;
        dispatch(setUser(user));
        dispatch(setScores(user.scores));
      })
      .catch(err => {
        toast.error(formatError(err));
      });
  }
};

export const getGameData = level => {
  return axios.get(`${SERVER_HOST}/gameData/${level}`);
};
