import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from '../components/mainPage';
import GamePage from '../components/gamePage';
import TopLists from '../components/topLists';
import Login from '../components/login';
import Register from '../components/register';
import { NotFound404 } from '../components/showError';

const routes = (
  <BrowserRouter>
    <div>
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/game" component={GamePage} />
        <Route path="/game/:level" component={GamePage} />
        <Route exact path="/topLists" component={TopLists} />
        <Route path="/topLists/:level" component={TopLists} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound404} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default routes;
