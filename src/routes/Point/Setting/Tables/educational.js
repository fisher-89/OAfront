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
@connect(({ point, loading }) => ({
  education: point.education,
  basePoint: point.base_education,
  eLoading: loading.effects['point/fetchEducation'],
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
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.education !== this.props.education) {
      this.setState({ dataSource: [...nextProps.education] });
    } else if (nextProps.basePoint !== this.props.basePoint) {
      const dataSource = this.makeFilterDataSource(nextProps.basePoint);
      this.setState({ dataSource: [...dataSource] });
    }
  }

  fetchDataSource = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchEducation',
      callBack: () => {
        dispatch({
          type: 'point/fetchBase',
          payload: { name: 'education' },
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
        name: 'education',
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
      if (bseIndex !== -1) {
        return {
          ...data[bseIndex],
          point: data[bseIndex].point.toString(),
        };
      }
      const temp = {
        ...item,
        point: '0',
      };
      delete temp.sort;
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
                message: `编号${errIndex} ,${item.title} : ${error[key]}`,
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
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 200,
        searcher: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
        searcher: true,
      },
      {
        title: '固定积分得分',
        dataIndex: 'point',
        width: 300,
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
          scroll={{ y: 500 }}
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
