import React from 'react'
import { matchPath } from "react-router";
import { Route, Switch } from 'react-router-dom';
import cs from 'classnames'
import { Menu, Icon, Breadcrumb } from 'tezign-ui'
import convertTree2Map, { getTreeBranch } from 'commons.js/functions/convertTree2Map'
import each from 'lodash/each'
import './index.scss'

import BizLineListPage from '@/pages/biz-lines/list';
import ProductListPage from '@/pages/products/list';
import TrackConfigEventsPage from '@/pages/track-configs/events';
import TrackConfigLocationsPage from '@/pages/track-configs/locations';
import wpsReportPage from '@/pages/reports/website-performances/index';

const SubMenu = Menu.SubMenu;

const MENUS = [{
  title: '元数据',
  icon: 'personal',
  key: 'm1',
  children: [{
    key: '/bizLines/list',
    title: '业务线'
  }, {
    key: '/products/list',
    title: '产品线'
  }]
}, {
  title: '数据埋点',
  icon: 'manager',
  key: 'm2',
  children: [{
    key: '/track-configs/events',
    title: '埋点事件配置'
  }, {
    key: '/track-configs/locations',
    title: '访问路径配置'
  }]
}, {
  title: '数据报表',
  icon: 'trend',
  key: 'm3',
  children: [{
    key: '/reports/website-performances',
    title: '网站性能'
  }]
}]

const MENUS_MAP = convertTree2Map(MENUS)

function getCurrentMenuNode(pathname: string) {
  let node
  Object.keys(MENUS_MAP).some((key: string) => {
    if (matchPath(pathname, { path: key })) {
      node = MENUS_MAP[key]
      return true
    }
    return false
  })
  return node
}

function getOpenKeys(node: any, pathname: string) {
  let results: any[] = []
  if (!node) return results
  function addResult(node: any) {
    results.push(node.key)
  }
  recursive2TreeRoot(MENUS_MAP, node, addResult)
  return results
}

function recursive2TreeRoot(map: any, node: any, callback: any) {
  let parent = map[node.parentMapKey]
  if (!parent) return
  callback(parent)
  recursive2TreeRoot(map, parent, callback)
}

function createMenuTitle(menu: any) {
  return <div><Icon type={menu.icon} /><span>{menu.title}</span></div>
}

function renderMenus(menus: any) {
  return menus.map((menu: any) => {
    const { children } = menu
    if (children) {
      return (
        <SubMenu key={menu.key} title={createMenuTitle(menu)}>
          {renderMenus(children)}
        </SubMenu>
      )
    } else {
      return <Menu.Item key={menu.key}>{menu.title}</Menu.Item>
    }
  })
}

export default class BasicLayout extends React.Component<any, any> {

  state: any = { menuCollapsed: false, openKeys: [], selectedKeys: [] }

  componentDidMount() {
    this.setMenuKeys()
  }

  setMenuKeys() {
    const { pathname } = this.props.location;
    const { openKeys } = this.state;
    const node: any = getCurrentMenuNode(pathname)
    if (!node) return
    const _keys = getOpenKeys(node, pathname)
    _keys.forEach((key: any) => {
      if (openKeys.indexOf(key) > -1) return
      openKeys.push(key)
    })
    this.setState({
      openKeys,
      selectedKeys: [node.key]
    })
  }

  handleClick = ({ key }: any) => {
    const { history } = this.props
    history.push(key)
    this.setState({ selectedKeys: [key] })
  }

  handleOpenChange = (openKeys: string[]) => {
    this.setState({ openKeys })
  }

  toggleMenu = () => {
    let { menuCollapsed, openKeys } = this.state
    if (!menuCollapsed) openKeys = []
    this.setState({ 
      menuCollapsed: !menuCollapsed,
      openKeys
    })
  }

  renderNav() {
    const { pathname } = this.props.location;
    const node: any = getCurrentMenuNode(pathname)
    return (
      <div className="layout-nav">
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <Icon type="dashboard" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>{node && node.title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  renderHead() {
    return (
      <div className="layout-head">
        <Icon type="menu" className="fz-20" onClick={this.toggleMenu}/>        
      </div>
    )
  }

  render() {
    const { openKeys, selectedKeys, menuCollapsed } = this.state
    return (
      <div className={cs('basic-layout', { 'menu-collapsed': menuCollapsed })}>
        <div className="layout-side">
          <div className="side-head">
            <Icon type="about-tezign" className="logo"/>
            数据中台
          </div>
          <Menu
            onClick={this.handleClick}
            onOpenChange={this.handleOpenChange}
            style={{ width: '100%' }}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            theme="dark"
            mode="inline"
            inlineCollapsed={menuCollapsed}
          >
            {renderMenus(MENUS)}
          </Menu>
        </div>
        {this.renderHead()}
        <div className="layout-body">
          {this.renderNav()}
          <div className="layout-inner">
            <Switch>
              <Route path="/bizLines/list" component={BizLineListPage} />
              <Route path="/products/list" component={ProductListPage} />
              <Route path="/track-configs/events" component={TrackConfigEventsPage} />
              <Route path="/track-configs/locations" component={TrackConfigLocationsPage} />
              <Route path="/reports/website-performances" component={wpsReportPage} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}