import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import createThunkStore from './store';
import routes from './router';
import * as serviceWorker from './serviceWorker';

const store = createThunkStore();

// window.React = React;
// window.store = store;

ReactDOM.render(
  <Provider store={store}>{routes}</Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
