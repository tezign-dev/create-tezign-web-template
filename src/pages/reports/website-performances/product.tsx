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
// import debounce from 'lodash/debounce'
import moment from 'moment'
import { DatePicker, Table, Select, Icon, Breadcrumb } from 'tezign-ui'
import Wsp from '@/services/wsp'
import theme from '@/commons/g2/theme'

import ChartHead from './ChartHead'

import WspTimeline from '@/components/WspTimeline'

const { RangePicker } = DatePicker

const NAMES = {
  avgBlankTime: '平均白屏时间',
  avgOperableTime: '平均可交互时间'
}

const SORTS = [{
  title: '访问时间',
  value: 'createTime'
}, {
  title: '持续时间',
  value: 'duration'
}, {
  title: '白屏时间',
  value: 'blankTime'
}, {
  title: '可交互时间',
  value: 'operableTime'
}]

const DIRECTIONS = [{
  title: '倒序',
  value: 'desc'
}, {
  title: '顺序',
  value: 'asc'
}]

export default class ProductWprPage extends React.Component<any, any> {

  renderTimeline = (readyTime: any, record: any) => {
    const { maxTime } = this.state.tableData
    return <WspTimeline {...record} max={maxTime} />
  }

  renderLocation = (timezone: number) => timezone === -8 ? '中国' : '海外'

  renderCreateTime = (time: string) => <span className="fz-12">{time.substring(5, time.length - 3)}</span>

  renderActions = (value: any, record: any) => (
    <span className="tz-action">详情</span>
  )

  private columns: any[] = [{
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    width: 160
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
    width: 120,
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
  }, {
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
    align: 'right',
    width: 70,
    render: this.renderActions
  }]

  state: any = { 
    query: { 
      dates: [moment().subtract(1, 'months'), moment()],
      rate: 0.1  
    }, 
    chartData: [], 
    tableData: { 
      list: [], 
      count: 0,
      dates: [moment().subtract(1, 'months'), moment()],
      sort: 'duration',
      direction: 'desc'
    } 
  }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    this.loadChartData()
    this.loadTableData()    
  }

  loadChartData() {
    const { pid } = this.props.match.params
    const { dates, rate } = this.state.query
    Wsp.loadProductionIndexData({
      productLineId: pid, dates, rate
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
  }

  loadTableData() {
    const { pid } = this.props.match.params
    const { dates, sort, direction } = this.state.tableData
    Wsp.loadProductionPvData({
      productLineId: pid, dates, sort, direction
    }).then((res: any) => {
      const { list, count, pageNo, pageSize } = res
      const { tableData } = this.state
      Object.assign(tableData, { list, count, pageNo, pageSize, maxTime: getMaxTime(list)})
      this.setState({ tableData })
    })
  }

  changeChartQuery(key: string, value: any) {
    const { query } = this.state
    query[key] = value
    this.setState({ query })
    this.loadChartData()
  }

  handleRateChange = (value: number) => {
    this.changeChartQuery('rate', value / 100)
  } 

  handleDatesChange = (dates: any[]) => {
    this.changeChartQuery('dates', dates)
  }

  changeTableQuery(key: string, value: any) {
    const { tableData } = this.state
    tableData[key] = value
    this.setState({ tableData })
    this.loadTableData()
  }

  handleTableDatesChange = (dates: any[]) => {
    this.changeTableQuery('dates', dates)
  }

  handleTableSortChange = (sort: string) => {
    this.changeTableQuery('sort', sort)
  }

  handleTableDirectionChange = (direction: string) => {
    this.changeTableQuery('direction', direction)
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
    return (
      <div className="wp-common-page with-nav">
        {this.renderNav()}
        {this.renderChart()}
        {this.renderTable()}
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
            <span>网站性能总览</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  renderChart() {
    const { chartData, query } = this.state
    const { dates, rate } = query
    return (
      <div className="layout-card mb-24">
        <ChartHead 
          title="网站加载性能趋势"
          dates={dates}
          rate={rate}
          onRateChange={this.handleRateChange}
          onDatesChange={this.handleDatesChange}
        />
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
      </div>
      
    )
  }

  renderTable() {
    const { tableData } = this.state
    const { list, count, pageNo, pageSize, dates, sort, direction } = tableData
    return (
      <div className="layout-card">
        <div className="chart-head">
          <div className="head-title">网站加载性能日志</div>
          <div className="head-gap" />
          <Select 
            style={{width: 120}} 
            value={sort} 
            onChange={(sort: string) => this.changeTableQuery('sort', sort)}
            options={SORTS} 
          />
          <Select 
            style={{width: 80, marginLeft: 16}} 
            value={direction} 
            onChange={(direction: string) => this.changeTableQuery('direction', direction)}
            options={DIRECTIONS} 
          />
          <RangePicker 
            className="ml-16" 
            value={dates} 
            onChange={this.handleTableDatesChange}
          />  
        </div>
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
      </div>
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
    const count = item.operableTime
    if (count > value) value = count
  })
  return value
}

function parseFloatValue(value: number) {
  return value.toFixed(0)
}