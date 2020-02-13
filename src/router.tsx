import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import history from '@/commons/history';
import LoginPage from './pages/login/';
import BasicLayout from './layouts/Basic'

export default (props: any) => {
  const { user } = props
  const routes = [
    <Route path="/login" component={LoginPage} />
  ]
  if (user) {
    routes.push(<Route path="/" component={BasicLayout} />)
  }
  return (
    <Router history={history}>
      <Switch>
        {routes}
      </Switch>
    </Router> 
  );
};
