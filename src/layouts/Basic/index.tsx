import React from 'react'
import { Menu, Icon, Breadcrumb } from 'tezign-ui'
import convertTree2Map, { getTreeBranch } from 'commons.js/functions/convertTree2Map'
import './index.scss'

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

function getOpenKeys(key: string) {
  let results: any[] = []
  const node = MENUS_MAP[key]
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

  private static _prevState: any = { openKeys: [], selectedKeys: [] }

  state: any = BasicLayout._prevState

  componentDidMount() {
    this.setMenuKeys()
  }

  componentDidUpdate(prevProps: any) {
    const { path: _path } = prevProps.match
    const { path } = this.props.match;
    if (path !== _path) {
      this.setMenuKeys()
    }
  }

  componentWillUnmount() {
    BasicLayout._prevState = this.state
  }

  setMenuKeys() {
    const { path } = this.props.match;
    const { openKeys } = this.state;
    const _keys = getOpenKeys(path)
    _keys.forEach((key: any) => {
      if (openKeys.indexOf(key) > -1) return
      openKeys.push(key)
    })
    this.setState({
      openKeys,
      selectedKeys: [path]
    })
  }

  handleClick = ({ key }: any) => {
    const { history } = this.props
    history.push(key)
  }

  handleOpenChange = (openKeys: string[]) => {
    this.setState({ openKeys })
  }

  renderNav() {
    const { path } = this.props.match;
    const node = MENUS_MAP[path]
    if (!node) return null
    return (
      <div className="layout-nav">
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <Icon type="dashboard" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>{node.title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  render() {
    const { children } = this.props
    const { openKeys, selectedKeys } = this.state
    return (
      <div className="basic-layout">
        <div className="layout-side">
          <Menu
            onClick={this.handleClick}
            onOpenChange={this.handleOpenChange}
            style={{ width: 250, height: '100%' }}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            mode="inline"
          >
            {renderMenus(MENUS)}
          </Menu>
        </div>
        <div className="layout-body">
          {this.renderNav()}
          <div className="layout-inner">
            {children}
          </div>
        </div>
      </div>
    )
  }
}