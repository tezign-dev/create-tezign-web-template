import React from 'react';
import './commons.scss'
import { Table, Breadcrumb, Icon } from 'tezign-ui'
import pick from 'lodash/pick'
import Wsp from '@/services/wsp'
import Product from '@/services/product'
import WspTimeline, { TIME_KEYS } from '@/components/WspTimeline'


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

  back2= (e: any) => {
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
            <span>网站性能</span>
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
    const { loading, data } = this.state
    if (loading) return null
    const props = pick(data, TIME_KEYS)
    return (
      <div className="layout-card pv-detail">
        <WspTimeline {...props} max={props.operableTime} style={{ height: 40}} />
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

