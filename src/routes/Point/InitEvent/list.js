import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Button,
  Divider,
  Input,
  InputNumber,
  TreeSelect,
  Switch,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  SearchTable,
} from '../../../components/OAForm';
import OATable from '../../../components/OATable';
import InputRange from '../../../components/InputRange';
import EventTree from './eventTree';
import { markTreeData, customerAuthority } from '../../../utils/utils';

const FormItem = OAForm.Item;

@connect(({ point, loading }) => ({
  result: point.event,
  typeList: point.type,
  final: point.final,
  fLoading: loading.effects['point/fetchFinal'],
  tableLoading: loading.effects['point/fetchEvent'],
  loading: (
    loading.effects['point/addEvent'] ||
    loading.effects['point/editEvent']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
    filters: {},
  }

  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  setTypeId = (typeId) => {
    this.setState({ filters: { type_id: [`${typeId}`] } });
  }

  fetchEvent = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchEvent',
      payload: { ...params },
    });
  }

  fetchFinal = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchFinal',
      payload: params,
    });
  }


  handleEdit = (rowData) => {
    this.setState({ editInfo: rowData }, () => this.handleModalVisible(true));
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const response = {
      ...params,
      ...params.first_approver,
      ...params.final_approver,
      point_a_max: params.point_a.max,
      point_a_min: params.point_a.min,
      point_b_max: params.point_b.max,
      point_b_min: params.point_b.min,
      is_active: params.is_active ? 1 : 0,
      first_approver_locked: params.first_approver_locked ? 1 : 0,
      final_approver_locked: params.final_approver_locked ? 1 : 0,
    };
    delete response.point_a;
    delete response.point_b;
    delete response.first_approver;
    delete response.final_approver;

    dispatch({
      type: response.id ? 'point/editEvent' : 'point/addEvent',
      payload: response,
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  }

  handleError = (err) => {
    const { onError } = this.props;
    onError(err, {
      point_a_max: 'point_a',
      point_a_min: 'point_a',
      point_b_max: 'point_b',
      point_b_min: 'point_b',
    });
  }

  handleSuccess = () => {
    this.handleModalVisible(false);
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/deleteEvent',
      payload: { id },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const { typeList } = this.props;
    const active = [
      {
        value: 0,
        text: '未激活',
      },
      {
        value: 1,
        text: '激活',
      },
    ];
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
        sorter: true,
      },
      {
        title: '事件类型',
        dataIndex: 'type_id',
        filters: typeList.map(item => ({ value: item.id, text: item.name })),
        render: (typeId) => {
          let str = {};
          str = typeList.find(item => item.id.toString() === typeId.toString());
          return str ? str.name : '';
        },
      },
      {
        title: '事件名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: 'A分范围',
        dataIndex: 'point_a_between',
        exportRender: (record) => {
          return `${record.point_a_min}-${record.point_a_max}`;
        },
        render: (_, record) => {
          return `${record.point_a_min}-${record.point_a_max}`;
        },
      },
      {
        title: '默认A分',
        dataIndex: 'point_a_default',
        sorter: true,
      },
      {
        title: 'B分范围',
        dataIndex: 'point_b_between',
        exportRender: (record) => {
          return `${record.point_b_min}-${record.point_b_max}`;
        },
        render: (_, record) => {
          return `${record.point_b_min}-${record.point_b_max}`;
        },
      },
      {
        title: '默认B分',
        dataIndex: 'point_b_default',
        sorter: true,
      },
      {
        title: '初审人',
        dataIndex: 'first_approver_name',
        searcher: true,
      },
      {
        title: '终审人',
        dataIndex: 'final_approver_name',
        searcher: true,
      },
      {
        title: '激活',
        dataIndex: 'is_active',
        filters: active,
        render: isActive => (isActive ? '激活' : '未激活'),
      },
    ];
    if (customerAuthority(143) || customerAuthority(144)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(143) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(144) && (
                  <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
                )}
              </Fragment>
            );
          },
        }
      );
    }
    return columns;
  }

  makeExtraOperator = () => {
    const extra = [];
    if (customerAuthority(139)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加事件
        </Button>
      ));
    }
    return extra;
  }

  makeSearchStaffColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '审核人编号',
        dataIndex: 'staff_sn',
        searcher: true,
      },
      {
        title: '审核人姓名',
        dataIndex: 'staff_name',
        searcher: true,
      },
      {
        title: 'A分加分上限',
        dataIndex: 'point_a_awarding_limit',
        rangeFilters: true,
      },
      {
        title: 'A分减分上限',
        dataIndex: 'point_a_deducting_limit',
        rangeFilters: true,
      },
      {
        title: 'B分加分上限',
        dataIndex: 'point_b_awarding_limit',
        rangeFilters: true,
      },
      {
        title: 'B分减分上限',
        dataIndex: 'point_b_deducting_limit',
        rangeFilters: true,
      },
    ];
    return columns;
  }

  makeSearchStaffProps = () => {
    const { finalLoading, final } = this.props;
    const response = {
      name: {
        final_approver_sn: 'staff_sn',
        final_approver_name: 'staff_name',
      },
      title: '终审人列表',
      showName: 'final_approver_name',
      placeholder: '请选择员工',
      tableProps: {
        index: 'staff_sn',
        columns: this.makeSearchStaffColumns(),
        data: final && final.data,
        total: final && final.total,
        loading: finalLoading,
        fetchDataSource: this.fetchFinal,
      },
    };
    return response;
  }


  render() {
    const {
      tableLoading,
      result,
      typeList,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const { visible, editInfo, filters } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const treeData = markTreeData(typeList, { parentId: 'parent_id', value: 'id', lable: 'name' });
    const isEdit = Object.keys(editInfo).length !== 0;
    const excelAction = {};
    if (customerAuthority(140)) {
      excelAction.excelInto = 'http://192.168.20.144:8003/admin/events/import';
    }

    if (customerAuthority(141)) {
      excelAction.excelExport = {
        uri: '/api/pms/events',
        title: '事件库',
      };
    }

    if (customerAuthority(141)) {
      excelAction.excelTemplate = '/api/pms/events/example';
    }

    return (
      <Row>
        <Col span={4} style={{ borderRight: '1px solid #e8e8e8' }}>
          <EventTree fetchDataSource={typeId => this.setTypeId(typeId)} />
        </Col>
        <Col span={20}>
          <OATable
            serverSide
            {...excelAction}
            filters={filters}
            scroll={{ x: 300 }}
            loading={tableLoading}
            total={result.total}
            dataSource={result.data}
            columns={this.makeColumns()}
            fetchDataSource={this.fetchEvent}
            extraOperator={this.makeExtraOperator()}
          />
        </Col>
        {(customerAuthority(139) || customerAuthority(143))
          && (
            <OAModal
              width={600}
              title="事件"
              visible={visible}
              style={{ top: 30 }}
              loading={this.props.loading}
              actionType={editInfo.id !== undefined}
              onCancel={() => this.handleModalVisible()}
              onSubmit={validateFields(this.handleSubmit)}
              afterClose={() => this.setState({ editInfo: {} })}
            >
              {
                editInfo.id ? (
                  getFieldDecorator('id', {
                    initialValue: editInfo.id,
                  })(
                    <Input placeholder="请输入" type="hidden" />
                  )
                ) : null
              }
              <FormItem {...formItemLayout} label="事件类型" required>
                {getFieldDecorator('type_id', {
                  initialValue: editInfo.type_id ? editInfo.type_id.toString() : null,
                })(
                  <TreeSelect
                    placeholder="请选择"
                    treeDefaultExpandAll
                    treeData={treeData}
                    getPopupContainer={trrger => (trrger)}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="事件名称" required>
                {getFieldDecorator('name', {
                  initialValue: editInfo.name || '',
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>

              <FormItem required {...formItemLayout} label="A分默认值">
                {getFieldDecorator('point_a_default', {
                  initialValue: isEdit ? editInfo.point_a_default.toString() : '',
                })(
                  <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                )}
              </FormItem>
              <FormItem required {...formItemLayout} label="B分默认值">
                {getFieldDecorator('point_b_default', {
                  initialValue: isEdit ? editInfo.point_b_default.toString() : '',
                })(
                  <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="A分" required>
                {getFieldDecorator('point_a', {
                  initialValue: {
                    min: isEdit ? editInfo.point_a_min.toString() : '',
                    max: isEdit ? editInfo.point_a_max.toString() : '',
                  },
                })(
                  <InputRange />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="b分" required>
                {getFieldDecorator('point_b', {
                  initialValue: {
                    min: isEdit ? editInfo.point_b_min.toString() : '',
                    max: isEdit ? editInfo.point_b_max.toString() : '',
                  },
                })(
                  <InputRange />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="抄送人"
              >
                {getFieldDecorator('default_cc_addressees', {
                  initialValue: editInfo.default_cc_addressees || [],
                })(
                  <SearchTable.Staff
                    multiple
                    name={{
                      staff_sn: 'staff_sn',
                      staff_name: 'realname',
                    }}
                    showName="staff_name"
                    placeholder="请选择员工"
                  />
                )}
              </FormItem>

              <Row>
                <Col span={14}>
                  <FormItem
                    {
                    ...{
                      labelCol: { span: 10 },
                      wrapperCol: { span: 14 },
                    }
                    }
                    label="初审人"
                  >
                    {getFieldDecorator('first_approver', {
                      initialValue: {
                        first_approver_sn: editInfo.first_approver_sn || '',
                        first_approver_name: editInfo.first_approver_name || '',
                      },
                    })(
                      <SearchTable.Staff
                        name={{
                          first_approver_sn: 'staff_sn',
                          first_approver_name: 'realname',
                        }}
                        valueName="first_approver_sn"
                        showName="first_approver_name"
                        placeholder="请选择员工"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem
                    {
                    ...{
                      labelCol: { span: 16 },
                      wrapperCol: { span: 8 },
                    }
                    }
                    label="锁定"
                  >
                    {getFieldDecorator('first_approver_locked', {
                      initialValue: editInfo.first_approver_locked === 1 || false,
                      valuePropName: 'checked',
                    })(
                      <Switch />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={14}>
                  <FormItem
                    {
                    ...{
                      labelCol: { span: 10 },
                      wrapperCol: { span: 14 },
                    }
                    }

                    label="终审人"
                  >
                    {getFieldDecorator('final_approver', {
                      initialValue: {
                        final_approver_sn: editInfo.final_approver_sn || '',
                        final_approver_name: editInfo.final_approver_name || '',
                      },
                    })(
                      <SearchTable {...this.makeSearchStaffProps()} />
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem
                    {
                    ...{
                      labelCol: { span: 16 },
                      wrapperCol: { span: 8 },
                    }
                    }
                    label="锁定"
                  >
                    {getFieldDecorator('final_approver_locked', {
                      initialValue: editInfo.final_approver_locked === 1 || false,
                      valuePropName: 'checked',
                    })(
                      <Switch />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <FormItem {...formItemLayout} label="激活">
                {getFieldDecorator('is_active', {
                  initialValue: editInfo.is_active === 1 || true,
                  valuePropName: 'checked',
                })(
                  <Switch />
                )}
              </FormItem>
            </OAModal>
          )
        }
      </Row>
    );
  }
}
