import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import history from '@/commons/history';
import HomePage from './pages/home/';
import BizLineListPage from './pages/biz-lines/list';
import ProductListPage from './pages/products/list';
import TrackConfigEventsPage from './pages/track-configs/events';
import TrackConfigLocationsPage from './pages/track-configs/locations';
import wpsReportPage from './pages/reports/website-performances/index';
import LoginPage from './pages/login/';

export default () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/bizLines/list" component={BizLineListPage} />
        <Route path="/products/list" component={ProductListPage} />
        <Route path="/track-configs/events" component={TrackConfigEventsPage} />
        <Route path="/track-configs/locations" component={TrackConfigLocationsPage} />
        <Route path="/reports/website-performances" component={wpsReportPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router> 
  );
};
