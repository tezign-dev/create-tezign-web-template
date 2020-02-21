import './commons.scss'
import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
} from "bizcharts";
import find from 'lodash/find'
import moment from 'moment'
import DataSet from "@antv/data-set";
import { DatePicker, Icon } from 'tezign-ui'
import Wsp from '@/services/wsp'
import Products from '@/services/product'
import theme from '@/commons/g2/theme'

const { RangePicker } = DatePicker

const NAMES = {
  avgBlankTime: '平均白屏时间',
  avgOperableTime: '平均可交互时间'
}

export default class WprPage extends React.Component<any, any> {

  state: any = { 
    query: { 
      dates: [moment().subtract(1, 'months'), moment()] 
    }, 
    data: [], 
    products: [] 
  }

  componentDidMount() {
    this.loadData()
  }

  handleDateChange = (dates: any[]) => {
    const { query } = this.state
    query.dates = dates
    this.setState({ query })
    this.loadChartData()
  }

  handleProductClick(product: any) {
    const { history } = this.props
    history.push('/reports/website-performances/' + product.productLineId)
  }

  loadData() {
    this.loadProducts()
    this.loadChartData()
  }

  loadChartData() {
    const { query } = this.state
    Wsp.loadProductionsIndexData(query).then((data) => {
      this.setState({ data })
    })
  }

  loadProducts() {
    Products.getProducts().then((products: any[]) => {
      this.setState({ products })
    })
  }

  render() {
    const { dates } = this.state.query
    return (
      <div className="wpr-page wp-common-page">
        <div className="layout-card">
          <div className="chart-head">
            <div className="head-title">网站加载性能总览</div>
            <RangePicker value={dates} onChange={this.handleDateChange}/>  
          </div>
          {this.renderChart()}
          {this.renderList()}
        </div>
      </div>
    )
  }

  renderChart() {
    const { data } = this.state
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'rename',
      map: {
        productLineName: 'label' // row.xxx 会被替换成 row.yyy
      }
    }).transform({
      type: "fold",
      fields: ["avgOperableTime", "avgBlankTime"],
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });
    return (
      <div>
        <Chart 
          padding="auto"
          height={80 * data.length} 
          data={dv} 
          theme={{ colors: theme.colors_16 }}
          forceFit
        >
          <Legend itemFormatter={val => NAMES[val]} />
          <Coord transpose scale={[1, -1]} />
          <Axis name="label" />
          <Axis name="value" label={{ formatter: formatYLabel }} position={"right"} />
          <Tooltip />
          <Geom
            type="interval"
            position="label*value"
            tooltip={['type*value', formatTooltip]}
            color={"type"}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 20
              }
            ]}
          />
        </Chart>
      </div>
    );
  }

  renderList() {
    const { products } = this.state
    return (
      <div className="product-list">
        {
          products.map((item: any) => (
            <div 
              onClick={() => this.handleProductClick(item)}
              key={item.productLineId} 
              className="list-item-wrap"
            >
              <div className="list-item">
                {/* <img src="" className="item-img"/> */}
                <Icon type="planet" className="item-icon"/>
                <div className="item-title">{item.productLineName}</div>  
                {this.renderListItemValue(item.productLineId)}
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  renderListItemValue(productLineId: any) {
    const { data } = this.state
    let value = find(data, v => v.productLineId === productLineId)
    let v1 = 0, v2 = 0
    if (value) {
      v1 = value.avgOperableTime
      v2 = value.avgBlankTime
    }
    return (
      <div>
        <span className="item-value">{v1} / </span> 
        <span className="item-sub-value">{v2}</span> 
        ms
      </div>
    )
  }

}

function formatTooltip(label: string, value: any) {
  return {
    name: NAMES[label],
    value: formatYLabel(value)
  }
}

function formatYLabel(text: any) {
  return `${text} ms`
}