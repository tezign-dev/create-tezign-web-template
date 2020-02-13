import React from 'react';
import { Table, Divider, Input, Icon, Button, Radio, message, Select } from 'tezign-ui';
import BasicLayout from '@/layouts/Basic'
import Product from '@/services/product'
import Track from '@/services/track'
import StatusTag from '@/components/StatusTag'
import FormModal, { validFields } from '@/components/FormModal'

function initFields(record: any, context: any) {
  const { id, eventName, status, productLineId } = record
  const { productOptions } = context
  return [{
    key: 'id',
    value: id,
    hidden: true
  }, {
    key: 'eventName',
    value: eventName,
    label: '埋点事件名称',
    component: <Input />,
    placeholder: '请输入埋点事件名称',
    rules: [{
      required: true, message: '请输入埋点事件名称'
    }, {
      min: 3, max: 50, message: '请输入 3 到 50 个字符'  
    }]      
  }, {
    key: 'productLineId',
    value: productLineId,
    label: '所属产品线',
    component: <Select block={true} options={productOptions}></Select>,
    rules: {
      required: true, message: '请选择所属产品线'
    }  
  }, {
    key: 'status',
    value: status,
    label: '状 态',
    component: (
      <Radio.Group>
        <Radio.Button value={1}>启用</Radio.Button>
        <Radio.Button value={0}>禁用</Radio.Button>
      </Radio.Group>
    ) ,
  }]
}

export default class TrackConfigEventsPage extends React.Component<any, any> {
  
  state: any = { 
    data: { rows: [] }, 
    query: {}, 
    fmFieldOptions: { inline: true, labelWidth: 100 } 
  }

  private columns = [{
    title: '埋点事件 ID',
    dataIndex: 'eventTypeId',
    key: 'eventTypeId',
    width: 320,
  }, {
    title: '埋点事件名称',
    dataIndex: 'eventName',
    key: 'eventName',
  }, {
    title: '所属产品线',
    key: 'productName',
    dataIndex: 'productName',
  }, {
    title: '状态',
    key: 'status',
    width: 80,
    dataIndex: 'status',
    render: (status: number) => <StatusTag status={status} />,
  }, {
    title: '操作',
    key: 'actions',
    width: 120,
    render: (text: any, record: any) => (
      <span>
        <span className="tz-action" onClick={() => this.toEdit(record)}>编辑</span>
        <Divider type="vertical" />
        <span className="tz-action type-danger" onClick={() => this.toDelete(record)}>删除</span>
      </span>
    ),
  }]

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    const { query } = this.state
    Promise.all([
      Product.getProducts(),
      Track.searchEvents(query)
    ]).then(([products, data]: any[]) => {
      const productOptions = products.map((item: any) => {
        return {
          key: item.productLineId,
          value: item.productLineId,
          title: item.productLineName
        }
      })
      data.rows.forEach((item: any) => {
        item.productName = Product.getProductName(item.productLineId)
      })
      this.setState({productOptions, data})    
    })
  }

  toAdd = () => {
    const { productOptions } = this.state
    let fmFields = initFields({ status: 1 }, { productOptions })
    this.setState({ fmTitle: '新增埋点事件', fmVisible: true, fmFields })
  }

  toEdit(record: any) { 
    const { productOptions } = this.state
    let fmFields = initFields(record, { productOptions })
    this.setState({ fmTitle: '编辑埋点事件', fmVisible: true, fmFields })
  }

  toDelete(record: any) {

  }

  handleFormModalOk = () => {
    const { fmFields } = this.state
    validFields(fmFields).then((data: any) => {
      if (data.id) {
        Track.updateEvent(data).then(() => {
          message.success('修改埋点事件成功')
          this.setState({ fmVisible: false })
          this.loadData()
        }, () => {
          message.error('修改埋点事件失败')
        })
      } else {
        Track.addEvent(data).then(() => {
          message.success('新增埋点事件成功')
          this.setState({ fmVisible: false })
          this.loadData()
        }, () => {
          message.error('新增埋点事件失败')
        })
      }
    })
  }
  
  handleFormModalCancel = () => {
    this.setState({ fmVisible: false })
  }

  handleSearch = (value: string) => {
    const { query } = this.state
    query.keyword = value    
    this.loadData()
  }

  handleProductChange = (value: string) => {
    const { query } = this.state
    query.productLineId = value  
    this.loadData()
  }

  handlePaginationChange = (pageNumber: number, pageSize: number) => {
    const { query } = this.state
    query.pageNumber = pageNumber
    query.pageSize = pageSize
    this.loadData()
  }
  
  render () {
    const { data, productOptions } = this.state
    return (
      <div>
        <div className="mb-16">
          <Select 
            options={productOptions} 
            placeholder="筛选产品线" 
            style={{ width: 200, marginRight: 8 }} 
            onChange={this.handleProductChange}
            allowClear
          />
          <Input.Search 
            allowClear
            placeholder="搜索埋点事件"
            onSearch={this.handleSearch}
            style={{width: 300}}
          />
          <Button className="float-right" onClick={this.toAdd}>
            <Icon className="mr-4" type="plus"/>
            添加
          </Button>  
        </div>
        <Table 
          rowKey="id" 
          columns={this.columns} 
          dataSource={data.rows} 
          pagination={{
            current: data.pageNumber,
            pageSize: data.pageSize,
            total: data.total,
            onChange: this.handlePaginationChange
          }} 
        />
        {this.renderFormModal()}
      </div>
    ) 
  }

  renderFormModal() {
    const { fmTitle, fmVisible, fmFields, fmFieldOptions } = this.state
    if (!fmVisible) return null
    return (
      <FormModal 
        width={500} 
        visible={fmVisible} 
        fields={fmFields} 
        fieldOptions={fmFieldOptions} 
        title={fmTitle}
        onOk={this.handleFormModalOk}
        onCancel={this.handleFormModalCancel}
      /> 
    )
  }
  
}