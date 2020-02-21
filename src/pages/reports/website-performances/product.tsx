import './commons.scss'

import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import forEachRight from 'lodash/forEachRight'
import moment from 'moment'
import { DatePicker, Table, Icon, Breadcrumb } from 'tezign-ui'
import Wsp from '@/services/wsp'
import theme from '@/commons/g2/theme'

import WspTimeline from '@/components/WspTimeline'

const { RangePicker } = DatePicker

const NAMES = {
  avgBlankTime: '平均白屏时间',
  avgOperableTime: '平均可交互时间'
}

export default class ProductWprPage extends React.Component<any, any> {

  renderTimeline = (readyTime: any, record: any) => {
    const { maxTime } = this.state.tableData
    return <WspTimeline {...record} max={maxTime} />
  }

  renderLocation = (timezone: number) => timezone === -8 ? '中国' : '海外'

  renderCreateTime = (time: string) => <span className="fz-12">{time.substring(5)}</span>

  private columns: any[] = [{
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    width: 150
  }, {
    title: '地区',
    dataIndex: 'timezone',
    key: 'timezone',
    render: this.renderLocation,
    width: 80
  }, {
    title: '访问时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
    render: this.renderCreateTime
  }, {
    title: '白屏时间',
    dataIndex: 'blankTime',
    key: 'blankTime',
    render: parseFloatValue,
    align: 'right',
    width: 100
  }, {
    title: '可交互时间',
    dataIndex: 'operableTime',
    key: 'operableTime',
    render: parseFloatValue,
    align: 'right',
    width: 120
  }, {
    title: '时间轴',
    dataIndex: 'readyTime',
    key: 'times',
    render: this.renderTimeline
  }]

  state: any = { 
    query: { 
      dates: [moment().subtract(1, 'months'), moment()] 
    }, 
    chartData: [], 
    tableData: { list: [], count: 0 } 
  }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    const { pid } = this.props.match.params
    const { dates } = this.state.query
    Wsp.loadProductionIndexData({
      productLineId: pid, dates
    }).then((res: any) => {
      let data: any[] = []
      let title = ''
      forEachRight(res, (item: any) => {
        const { createTime, avgBlankTime, avgOperableTime, productLineName } = item
        title = productLineName
        data.push({
          time : formatCreateTime(createTime),
          value: avgOperableTime,
          title: NAMES.avgOperableTime
        })
        data.push({
          time : formatCreateTime(createTime),
          value: avgBlankTime,
          title: NAMES.avgBlankTime
        })
      })
      this.setState({ chartData: data, title })
    })
    Wsp.loadProductionPvData({
      productLineId: pid, dates
    }).then((res: any) => {
      const { list, count, pageNo, pageSize } = res
      this.setState({ tableData: { list, count, pageNo, pageSize, maxTime: getMaxTime(list)} })
    })
  }

  handleDateChange(dates: any[]) {
    const { query } = this.state
    query.dates = dates
    this.setState({ query })
    this.loadData()
  }

  toPV(visitId: string) {
    const { history } = this.props
    const { pid } = this.props.match.params
    history.push(`/reports/website-performances/${pid}/${visitId}`)
  }

  back = (e: any) => {
    e.preventDefault()
    const { history } = this.props
    history.push(`/reports/website-performances`)
  }

  render() {
    const { dates } = this.state.query
    return (
      <div className="wp-common-page with-nav">
        {this.renderNav()}
        <div className="layout-card">
          <div className="chart-head">
            <div className="head-title">网站加载性能趋势</div>
            <RangePicker value={dates} onChange={this.handleDateChange}/>  
          </div>
          {this.renderChart()}
          {this.renderTable()}
        </div>
      </div>
    );
  }

  renderNav() {
    const { title } = this.state
    if (!title) return null
    return (
      <div className="page-nav">
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={this.back}>
            <Icon type="dashboard" /> 
            <span>网站性能</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  renderChart() {
    const { chartData } = this.state
    return (
      <Chart 
        height={360} 
        data={chartData} 
        theme={{ colors: theme.colors_16 }}
        forceFit
      >
        <Axis name="time" />
        <Axis name="value" label={{ formatter: formatYLabel }}/>
        <Legend />
        <Tooltip />
        <Geom
          type="line"
          position="time*value"
          tooltip={['title*value', formatTooltip]}
          size={2}
          color={"title"}
          shape={"smooth"}
        />
      </Chart>
    )
  }

  renderTable() {
    const { list, count, pageNo, pageSize } = this.state.tableData
    return (
      <Table 
        onRow={(record: any) => {
          return {
            onClick: () => this.toPV(record.visitId)
          };
        }}
        pagination={{ current: pageNo, pageSize, total: count }}
        rowKey="visitId" 
        columns={this.columns} 
        dataSource={list} 
      />
    )
  }

}


function formatCreateTime(createTime: string) {
  return createTime.substring(5, 10)
}

function formatTooltip(label: string, value: any) {
  return {
    name: label,
    value: formatYLabel(value)
  }
}

function formatYLabel(text: any) {
  return `${text} ms`
}

function getMaxTime(data: any[]) {
  let value: number = 0
  data.forEach((item: any) => {
    const count = item.operableTime + item.readyTime
    if (count > value) value = count
  })
  return value
}

function parseFloatValue(value: number) {
  return value.toFixed(0)
}