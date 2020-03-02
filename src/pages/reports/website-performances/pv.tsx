import React from 'react';
import './commons.scss'
import { Table, Breadcrumb, Icon } from 'tezign-ui'
import pick from 'lodash/pick'
import Wsp from '@/services/wsp'
import Product from '@/services/product'
import WspTimeline, { TIME_KEYS } from '@/components/WspTimeline'
import Bowser from 'bowser'

const IMAGES = {
  'iOS': require('@/assets/images/systems/apple-ios.svg'),
  'iPad': require('@/assets/images/systems/ipad.svg'),
  'Mac OS': require('@/assets/images/systems/mac.svg'),
  'macOS': require('@/assets/images/systems/mac.svg'),
  'Windows': require('@/assets/images/systems/windows.png'),
  'Linux': require('@/assets/images/systems/linux.png'),
  'Ubuntu': require('@/assets/images/systems/ubuntu.png'),
  'Safari': require('@/assets/images/systems/safari.png'),
  'QQ Browser': require('@/assets/images/systems/qq-browser.png'),
  'Chrome': require('@/assets/images/systems/chrome.png'),
  'Firefox': require('@/assets/images/systems/firefox.svg'),
  'Internet Explorer': require('@/assets/images/systems/internet-explorer.png'),
  'Edge': require('@/assets/images/systems/edge.png'),
  'WeChat': require('@/assets/images/systems/wechat.png'),
  unknown: require('@/assets/images/systems/unknown.svg'),
}

function getImage(name: string) {
  return IMAGES[name] || IMAGES.unknown
}


export default class PvWprPage extends React.Component<any, any> {

  renderLocation = (timezone: number) => timezone === -8 ? '中国' : '海外'

  renderCreateTime = (time: string) => <span className="fz-12">{time.substring(5)}</span>

  renderTimeline = (readyTime: any, record: any) => {
    const { resourceMaxTime } = this.state
    return <WspTimeline {...record} type="resource" max={resourceMaxTime} />
  }

  private columns: any[] = [{
    title: 'url',
    dataIndex: 'url',
    ellipsis: true
  }, {
    title: '加载时间',
    dataIndex: 'duration',
    key: 'duration',
    render: parseFloatValue,
    align: 'right',
    width: 100
  }, {
    title: '时间轴',
    dataIndex: 'readyTime',
    key: 'times',
    width: 400,
    render: this.renderTimeline
  }]

  state: any = { loading: true, data: { resources: [] } }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    const { vid } = this.props.match.params
    if (!vid) return
    Wsp.loadPvData(vid).then((data: any) => {
      this.setState({ 
        loading: false,
        data, 
        ua: Bowser.parse(data.userAgent),
        resourceMaxTime: getMaxTime(data.resources) 
      })
    })
  }

  back = (e: any) => {
    e.preventDefault()
    const { history } = this.props
    const { pid } = this.props.match.params
    history.push(`/reports/website-performances/${pid}`)
  }

  back2 = (e: any) => {
    e.preventDefault()
    const { history } = this.props
    history.push(`/reports/website-performances`)
  }


  render() {
    const { loading, data } = this.state
    return (
      <div className="pv-page wp-common-page with-nav">
        {this.renderNav()}
        {this.renderMainTimeline()}
        {this.renderTable()}
      </div>
    )
  }

  renderNav() {
    const { pid } = this.props.match.params
    const name = Product.getProductName(pid)
    return (
      <div className="page-nav">
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={this.back2}>
            <Icon type="dashboard" /> 
            <span>网站性能总览</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#" onClick={this.back}>
            <Icon type="cube" /> 
            <span>{name}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>访问日志</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  renderMainTimeline() {
    const { loading, data, ua } = this.state
    if (loading || !ua) return null
    const props = pick(data, TIME_KEYS)
    return (
      <div className="layout-card pv-detail">
        <WspTimeline {...props} max={props.operableTime} style={{ height: 40}} />
        <div className="d-row mt-24">
          <div className="d-label">IP 地址</div>  
          <div className="d-value">{data.ip}</div>
        </div>
        <div className="d-row mt-12">
          <div className="d-label">页面地址</div>  
          <div className="d-value">{data.url}</div>
        </div>
        <div className="d-row mt-12">
          <div className="d-label">UserAgent</div>  
          <div className="d-value">{data.userAgent}</div>
        </div>
        <div className="d-row mt-16">
          <div className="d-row-item">
            <img src={getImage(ua.browser.name)} className="item-img"/>
            <div className="item-title">
              {ua.browser.name}
            </div>
            <div className="item-subtitle">
              {ua.browser.version}
            </div>
          </div>
          <div className="d-row-item">
            <img src={getImage(ua.engine.name)} className="item-img"/>
            <div className="item-title">
              {ua.engine.name}
            </div>
            <div className="item-subtitle">
              {ua.engine.version}
            </div>
          </div>
          <div className="d-row-item">
            <img src={getImage(ua.os.name)} className="item-img"/>
            <div className="item-title">
              {ua.os.name}
            </div>
            <div className="item-subtitle">
              {ua.os.version}
            </div>
          </div>
          <div className="d-row-item">
            <img src={getImage(ua.platform.type)} className="item-img"/>
            <div className="item-title">
              {ua.platform.type}
            </div>
            <div className="item-subtitle">
              
            </div>
          </div>
        </div>
      </div>
    )  
  }  

  renderTable() {
    const { resources } = this.state.data
    return (
      <div className="layout-card">
        <Table 
          columns={this.columns} 
          dataSource={resources} 
        />
      </div>
    )
  }

}

function parseFloatValue(value: number) {
  return value.toFixed(0)
}

function getMaxTime(data: any[]) {
  let value: number = 0
  data.forEach((item: any) => {
    const count = item.duration
    if (count > value) value = count
  })
  return value
}

