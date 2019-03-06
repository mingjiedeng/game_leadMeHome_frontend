import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import initialState from './initialState.json';

// const store = createStore(reducers, initialState, applyMiddleware(thunk));

const createThunkStore = state => {
  const initState = state || initialState;
  return createStore(reducers, initState, applyMiddleware(thunk));
};

export default createThunkStore;
