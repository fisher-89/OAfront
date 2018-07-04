import React, { PureComponent } from 'react';
import {
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import OATable from '../../../../components/OATable';
import OAForm from '../../../../components/OAForm';

const { EdiTableCell } = OATable;
const {
  OAModal,
} = OAForm;
const FormItem = OAForm.Item;
@connect(({ brand, point, loading }) => ({
  brand: brand.brand,
  position: point.position,
  basePoint: point.base_position,
  brandLoading: loading.effects['brand/fetchBrand'],
  pLoading: loading.effects['point/fetchPosition'],
  bLoading: loading.effects['point/fetchBase'],
  editLoading: loading.effects['point/editBase'],
}))
@OAForm.Config
@OAForm.create()
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      error: [],
      visible: false,
    };
  }

  componentDidMount() {
    const { form, bindForm, dispatch } = this.props;
    bindForm(form);
    dispatch({
      type: 'brand/fetchBrand',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.position !== this.props.position) {
      this.setState({ dataSource: [...nextProps.position] });
    } else if (nextProps.basePoint !== this.props.basePoint) {
      const dataSource = this.makeFilterDataSource(nextProps.basePoint);
      this.setState({ dataSource: [...dataSource] });
    }
  }

  fetchDataSource = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchPosition',
      callBack: () => {
        dispatch({
          type: 'point/fetchBase',
          payload: { name: 'position' },
        });
      },
    });
  }


  fetchEditBasePoint = () => {
    const { dataSource } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'point/editBase',
      payload: {
        data: dataSource,
        name: 'position',
      },
      onError: this.handleError,
      onSuccess: () => {
        this.setState({ error: [] });
      },
    });
  }

  makeFilterDataSource = (data) => {
    const { dataSource } = this.state;
    const basePointId = data.map(item => item.id);
    const newData = dataSource.map((item) => {
      const bseIndex = basePointId.indexOf(item.id);
      const brandId = item.brands.map(brand => brand.id);
      if (bseIndex !== -1) {
        return {
          ...item,
          ...data[bseIndex],
          brand_id: brandId,
          point: data[bseIndex].point.toString(),
        };
      }
      const temp = {
        ...item,
        brand_id: brandId,
        point: '0',
      };
      return temp;
    });
    return newData;
  }

  handleTableOnChange = (id, dataIndex) => {
    return (value) => {
      const { dataSource } = this.state;
      const newDataSource = [...dataSource];
      const target = newDataSource.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource: [...newDataSource] }, () => {
          this.fetchEditBasePoint();
        });
      }
    };
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleSubmit = (params) => {
    if (this.rowId && this.rowId.length) {
      const { dataSource } = this.state;
      const newDataSource = [...dataSource];
      newDataSource.forEach((item, index) => {
        if (this.rowId.indexOf(item.id) !== -1) {
          newDataSource[index].point = params.point;
        }
      });
      this.setState({ dataSource: [...newDataSource] }, () => {
        this.fetchEditBasePoint();
        this.handleModalVisible(false);
      });
    }
  }


  handleError = (error) => {
    const { basePoint } = this.props;
    const dataSource = this.makeFilterDataSource(basePoint);
    this.setState({ dataSource: [...dataSource] });

    const columns = this.makeColumns();
    if (error) {
      const errMessage = [];
      Object.keys(error).forEach((key) => {
        const errs = key.split('.');
        if (errs.length > 1) {
          const errIndex = errs[1];
          const errDataIndex = errs[2];
          columns.forEach((item) => {
            if (item.dataIndex === errDataIndex) {
              errMessage.push({
                index: errIndex,
                message: `编号${errIndex + 1} ,${item.title} : ${error[key]}`,
              });
            }
          });
        }
      });
      this.setState({ error: errMessage });
    }
  }

  handleEdit = (rowId) => {
    this.rowId = rowId;
    this.handleModalVisible(true);
  }

  makeColumns = () => {
    const { brand } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '职位',
        dataIndex: 'brand_id',
        filters: brand.map(item => ({ value: item.id, text: item.name })),
        render: (_, { brands }) => {
          const brandName = brands && brands.map(item => item.name);
          return brandName ? brandName.join(',') : '';
        },
      },
      {
        title: '固定积分得分',
        dataIndex: 'point',
        sorter: true,
        render: (value, record) => {
          return (
            <EdiTableCell
              value={value ? value.toString() : '0'}
              type="number"
              onChange={this.handleTableOnChange(record.id, 'point')}
            />
          );
        },
      },
    ];
    return columns;
  }


  makeMultiOperator = () => {
    const multiOperator = [
      { text: '批量编辑', action: selectedRows => this.handleEdit(selectedRows.map(row => row.id)) },
    ];
    return multiOperator;
  }

  render() {
    const { dataSource, visible, error } = this.state;
    const { form: { getFieldDecorator }, form, bLoading, eLoading, editLoading } = this.props;
    return (
      <React.Fragment>
        <OAModal
          form={form}
          title="批量修改积分配置"
          visible={visible}
          afterClose={() => { this.rowId = null; }}
          onCancel={() => this.handleModalVisible(false)}
          onSubmit={this.handleSubmit}
        >
          <FormItem
            {...{
              labelCol: { span: 6 },
              wrapperCol: { span: 14 },
            }}
            label="固定积分"
          >
            {getFieldDecorator('point', {
              initialValue: '',
              rules: [{
                required: 'true',
                message: '固定积分值必填',
              }],
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )}
          </FormItem>
        </OAModal>
        <OATable
          loading={bLoading || eLoading || editLoading}
          pagination={false}
          multiOperator={this.makeMultiOperator()}
          columns={this.makeColumns()}
          data={dataSource}
          fetchDataSource={this.fetchDataSource}
          footer={() => error.map((item, index) => {
            const key = `${index}`;
            return (
              <p style={{ color: 'red' }} key={key}>{item.message}</p>
            );
          })}
        />
      </React.Fragment>
    );
  }
}
