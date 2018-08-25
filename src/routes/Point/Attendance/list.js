import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, InputNumber } from 'antd';

import OATable from '../../../components/OATable';
import { customerAuthority } from '../../../utils/utils';

import OAForm, { OAModal, DatePicker } from '../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ point, loading }) => ({
  log: point.attendance,
  fetchLoading: loading.effects['point/fetchAttendance'],
}))
@OAForm.create()
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  };

  fetchAttendance = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchAttendance', payload: params });
  };

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const response = { ...params };

    dispatch({
      type: 'point/editAttendance',
      payload: response,
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  };

  handleError = (err) => {
    const { onError } = this.props;
    onError(err);
  };

  handleSuccess = () => {
    this.handleModalVisible(false);
  };

  handleEdit = (rowData) => {
    this.setState({ editInfo: rowData }, () => this.handleModalVisible(true));
  };

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  };

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'staff_sn',
        searcher: true,
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        searcher: true,
      },
      {
        title: '统计日期',
        dataIndex: 'workDate',
        searcher: true,
        render: (val) => {
          return val.slice(0, 10);
        },
      },
      {
        title: '上班时间',
        dataIndex: 'userOnTime',
        render: (val) => {
          return (val ? val : '缺卡');
        },
      },
      {
        title: '下班时间',
        dataIndex: 'userOffTime',
        render: (val) => {
          return (val ? val : '缺卡');
        },
      },
      {
        title: '工作时长',
        dataIndex: 'worktime',
        render: (val) => {
          return (val / 60).toFixed(2);
        },
      },
      {
        title: '请假时长',
        dataIndex: 'leavetime',
        render: (val) => {
          return (val / 60).toFixed(2);
        },
      },
      {
        title: '加班时长',
        dataIndex: 'overtime',
        render: (val) => {
          return (val / 60).toFixed(2);
        },
      },
      {
        title: '迟到时长',
        dataIndex: 'latetime',
        render: (val) => {
          return (val / 60).toFixed(2);
        },
      },
      {
        title: '早退时长',
        dataIndex: 'earlytime',
        render: (val) => {
          return (val / 60).toFixed(2);
        },
      },
    ];
    if (customerAuthority(143)) {
      columns.push({
        title: '操作',
        render: rowData => {
          return (
            <React.Fragment>
              {customerAuthority(143) && (
                <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              )}
            </React.Fragment>
          );
        }
      });
    }
    return columns;
  };

  render() {
    const { validateFields, form: { getFieldDecorator } } = this.props;
    const { visible, editInfo } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const isEdit = Object.keys(editInfo).length !== 0;
    const { log, fetchLoading } = this.props;
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={fetchLoading}
          columns={this.makeColumns()}
          dataSource={log && log.data}
          total={log && log.total}
          filtered={log && log.filtered}
          fetchDataSource={this.fetchAttendance}
          scroll={{ x: 300 }}
        />
        {customerAuthority(143) && (
          <OAModal
            width={600}
            title='考勤表单'
            visible={visible}
            style={{ top: 30 }}
            loading={this.props.loading}
            onCancel={() => this.handleModalVisible()}
            onSubmit={validateFields(this.handleSubmit)}
            afterClose={() => this.setState({ editInfo: {} })}
          >
            {editInfo.id
              ? getFieldDecorator('id', {
                  initialValue: editInfo.id
                })(<Input type='hidden' />)
              : null}

            <FormItem {...formItemLayout} label='上班时间'>
              {getFieldDecorator(
                'userOnTime',
                editInfo.userOnTime
                  ? { initialValue: editInfo.userOnTime }
                  : {}
              )(
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format={'YYYY-MM-DD h:mm:ss'}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='下班时间'>
              {getFieldDecorator(
                'userOffTime',
                editInfo.userOffTime
                  ? { initialValue: editInfo.userOffTime }
                  : {}
              )(
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format={'YYYY-MM-DD h:mm:ss'}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='工作时长'>
              {getFieldDecorator('worktime', {
                initialValue: isEdit ? editInfo.worktime.toString() : ''
              })(
                <InputNumber
                  min={0}
                  placeholder='请输入'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='加班时长'>
              {getFieldDecorator('overtime', {
                initialValue: isEdit ? editInfo.overtime.toString() : ''
              })(
                <InputNumber
                  min={0}
                  placeholder='请输入'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='请假时长'>
              {getFieldDecorator('leavetime', {
                initialValue: isEdit ? editInfo.leavetime.toString() : ''
              })(
                <InputNumber
                  min={0}
                  placeholder='请输入'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='迟到时长'>
              {getFieldDecorator('latetime', {
                initialValue: isEdit ? editInfo.latetime.toString() : ''
              })(
                <InputNumber
                  min={0}
                  placeholder='请输入'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='早退时长'>
              {getFieldDecorator('earlytime', {
                initialValue: isEdit ? editInfo.earlytime.toString() : ''
              })(
                <InputNumber
                  min={0}
                  placeholder='请输入'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </OAModal>
        )}
      </React.Fragment>
    );
  }
}
