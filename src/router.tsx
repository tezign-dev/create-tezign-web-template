import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import history from '@/commons/history';
import LoginPage from './pages/login/';
import HomePage from './pages/home/';

export default (props: any) => {
  const { user } = props
  const routes = [
    <Route path="/login" component={LoginPage} />
  ]
  // 可以根据用户权限初始化路由
  if (user) {
    routes.push(<Route path="/" component={HomePage} />)
  }
  return (
    <Router history={history}>
      <Switch>
        {routes}
      </Switch>
    </Router> 
  );
};
