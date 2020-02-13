import React from 'react';
import { Table, Divider, Input, Icon, Button, Radio, message, Select } from 'tezign-ui';
import BasicLayout from '@/layouts/Basic'
import BizLine from '@/services/bizLine'
import Product from '@/services/product'
import StatusTag from '@/components/StatusTag'
import FormModal from '@/components/FormModal'
import validFields from '@/commons/utils/validFields';

function initFields(product: any, context: any) {
  const { id, productLineName, status, bizLineId } = product
  const { bizLineOptions } = context
  return [{
    key: 'id',
    value: id,
    hidden: true
  }, {
    key: 'productLineName',
    value: productLineName,
    label: '产品线名称',
    component: <Input />,
    placeholder: '请输入产品线名称',
    rules: [{
      required: true, message: '请输入产品线名称'
    }, {
      min: 3, max: 20, message: '请输入 3 到 20 个字符'  
    }]      
  }, {
    key: 'bizLineId',
    value: bizLineId,
    label: '所属业务线',
    component: <Select block={true} options={bizLineOptions}></Select>,
    rules: {
      required: true, message: '请选择所属业务线'
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

export default class ProductListPage extends React.Component<any, any> {
  
  state: any = { data: [], fmFieldOptions: { inline: true, labelWidth: 100 } }

  private columns = [{
    title: '产品线 ID',
    dataIndex: 'productLineId',
    key: 'productLineId',
  }, {
    title: '产品线名称',
    dataIndex: 'productLineName',
    key: 'productLineName',
  }, {
    title: '所属业务线',
    dataIndex: 'bizLineName',
    key: 'bizLineName',
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <StatusTag status={status} />,
  }, {
    title: '操作',
    key: 'actions',
    render: (text: any, record: any) => (
      <span>
        <span className="tz-action" onClick={() => this.toEditProduct(record)}>编辑</span>
        <Divider type="vertical" />
        <span className="tz-action type-danger" onClick={() => this.toDeleteProduct(record)}>删除</span>
      </span>
    ),
  }]

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    Promise.all([
      BizLine.getBizLines(),
      Product.getProducts()
    ]).then((results: any[]) => {
      const [ bizLines, products ] = results
      products.forEach((item: any) => {
        item.bizLineName = BizLine.getBizLineName(item.bizLineId)
      })
      const bizLineOptions = bizLines.map((item: any) => {
        return {
          key: item.bizLineId,
          value: item.bizLineId,
          title: item.bizLineName
        }
      })
      this.setState({ data: products, bizLineOptions })
    })
  }

  toAddProduct = () => {
    const { bizLineOptions } = this.state
    let fmFields = initFields({ status: 1 }, { bizLineOptions })
    this.setState({ fmTitle: '新增产品线', fmVisible: true, fmFields })
  }

  toEditProduct(product: any) { 
    const { bizLineOptions } = this.state
    let fmFields = initFields(product, { bizLineOptions })
    this.setState({ fmTitle: '编辑产品线', fmVisible: true, fmFields })
  }

  toDeleteProduct(product: any) {

  }

  handleFormModalOk = () => {
    const { fmFields } = this.state
    validFields(fmFields).then((data: any) => {
      if (data.id) {
        Product.updateProduct(data).then(() => {
          message.success('修改产品线成功')
          this.setState({ fmVisible: false })
          this.loadData()
        }, () => {
          message.error('修改产品线失败')
        })
      } else {
        Product.addProduct(data).then(() => {
          message.success('新增产品线成功')
          this.setState({ fmVisible: false })
          this.loadData()
        }, () => {
          message.error('新增产品线失败')
        })
      }
    })
  }
  
  handleFormModalCancel = () => {
    this.setState({ fmVisible: false })
  }

  handleSearch = (value: string) => {

  }

  render () {
    const { data } = this.state
    return (
      <div >
        <div className="mb-16">
          <Input.Search 
            disabled
            allowClear
            placeholder="搜索产品线"
            onSearch={this.handleSearch}
            style={{width: 300}}
          />
          <Button className="float-right" onClick={this.toAddProduct}>
            <Icon className="mr-4" type="plus"/>
            添加
          </Button>  
        </div>
        <Table rowKey="id" columns={this.columns} dataSource={data} pagination={false}></Table> 
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