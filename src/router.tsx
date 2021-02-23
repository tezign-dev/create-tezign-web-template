import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/login/';
import HomePage from './pages/home/';

const AppRouter = (props: any) => {
  const { user } = props;
  const routes = [<Route key="login" path="/login" component={LoginPage} />];
  // 可以根据用户权限初始化路由
  if (user) {
    routes.push(<Route key="/" path="/" component={HomePage} />);
  }
  return (
    <BrowserRouter ref={setHistory}>
      <Switch>{routes}</Switch>
    </BrowserRouter>
  );
};

export default hot(AppRouter);

export function getHistory() {
  return histroy;
}

let histroy: any = {
  push() {
    console.error('the react router dom has not init');
  },
  replace() {
    console.error('the react router dom has not init');
  },
  back() {
    console.error('the react router dom has not init');
  },
};

function setHistory(ref: any) {
  if (!ref) return;
  histroy = ref.history;
}
