// src/Router.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MatchPage from './components/MatchPage';
import ChatPage from './components/ChatPage';
import ProfilePage from './components/ProfilePage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/match" component={MatchPage} />
      <Route path="/chat/:userId" component={ChatPage} />
      <Route path="/profile/:userId" component={ProfilePage} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-in" component={SignIn} />
    </Switch>
  </Router>
);

export default AppRouter;
