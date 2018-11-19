/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent, Fragment } from 'react';
import {
  Icon,
  Tabs,
  Menu,
  Modal,
  Button,
  Divider,
  Dropdown,
  notification,
} from 'antd';

import { connect } from 'dva';

import Search from './search';
import EditStaff from './edit';
import ImportStaff from './import';
import ExportStaff from './export';
import StaffInfo from './staffInfo';
import EditLeave from './editLeave';
import AgainEntry from './againEntry';
import EditLeaving from './editLeaving';
import EditProcess from './editProcess';
import EditTransfer from './editTransfer';
import OATable from '../../../components/OATable';
import {
  findRenderKey,
  getFiltersData,
  customerAuthority,
  getBrandAuthority,
  getDepartmentAuthority,
} from '../../../utils/utils';

const { TabPane } = Tabs;

const staffProperty = ['无', '108将', '36天罡', '24金刚', '18罗汉'];
const gender = [{ value: '男', text: '男' }, { value: '女', text: '女' }];
const status = [
  { value: 0, text: '离职中' },
  { value: 1, text: '试用期' },
  { value: 2, text: '在职' },
  { value: 3, text: '停薪留职' },
  { value: -1, text: '离职' },
  { value: -2, text: '自动离职' },
  { value: -3, text: '开除' },
  { value: -4, text: '劝退' },
];

@connect(({ staffs, brand, department, position, loading }) => ({
  staff: staffs.staff,
  brand: brand.brand,
  position: position.position,
  department: department.department,
  staffInfo: staffs.staffDetails,
  staffLoading: loading.models.staffs,
  staffInfoLoading: loading.effects['staffs/fetchStaff'],
}))

export default class extends PureComponent {
  state = {
    panes: [
      // {
      //   title: '陈贤喜',
      //   key: '100001',
      // },
    ],
    filters: {},
    editStaff: {},
    editVisible: false,
    leaveVisible: false,
    entryVisible: false,
    processVisible: false,
    leavingVisible: false,
    transferVisible: false,
    activeKey: 'staff_list',
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'expense/fetchExpense' });
    dispatch({ type: 'position/fetchPosition' });
    dispatch({ type: 'department/fetchDepartment', payload: { withTrashed: true } });
    this.fetchTags();
    this.fetchTagsType();
    // this.fetchStaffInfo({ staff_sn: '100001' });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  fetchStaff = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'staffs/fetchStaff', payload: params });
    this.searchFilter = params;
  }

  fetchStaffInfo = (param) => {
    const { dispatch } = this.props;
    dispatch({ type: 'staffs/fetchStaffInfo', payload: param });
  }

  fetchTags = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'stafftags/fetchStaffTags', payload: { ...params, type: 'staff' } });
  }

  fetchTagsType = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'stafftags/fetchStaffTagCategories', payload: { ...params, type: 'staff' } });
  }

  showUserInfo = (info) => {
    const { panes } = this.state;
    let pushAble = true;
    panes.forEach((item) => {
      if (item.key === info.staff_sn.toString()) {
        pushAble = false;
      }
    });
    if (pushAble) {
      panes.push({
        title: info.realname,
        key: info.staff_sn.toString(),
      });
      this.fetchStaffInfo({ staff_sn: info.staff_sn });
    }
    this.setState({ panes: [...panes], activeKey: info.staff_sn.toString() });
  }

  remove = (targetKey) => {
    const { panes } = this.state;
    let { activeKey } = this.state;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    if (newPanes.length === 0) {
      activeKey = 'staff_list';
    }
    this.setState({ panes: [...newPanes], activeKey });
  }

  showModal = (editStaff, visibleName) => {
    this.setState({ editStaff }, () => this.setState({ [visibleName]: true }));
  }

  deleteStaff = (staffsn) => {
    Modal.confirm({
      title: '确认删除?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'staffs/deleteStaff',
          payload: { staff_sn: staffsn },
        });
      },
      onCancel: () => { },
    });
  }

  resetPassword = (staffsn) => {
    Modal.confirm({
      title: '确认重置？',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'staffs/resetPassword',
          payload: { staff_sn: staffsn },
          onSuccess: (response) => {
            notification.success({
              message: response.message,
            });
          },
        });
      },
      onCancel: () => { },
    });
  }

  unlockStaff = (staffsn) => {
    const { dispatch } = this.props;
    dispatch({ type: 'staffs/unlock', payload: { staff_sn: staffsn } });
  }

  makeActionElement = (data, rowData, divider = true) => {
    const buttonKey = this.makeStaffActionKey(rowData);
    const action = [];
    data.forEach((item, index) => {
      const id = item.props.dataauthid;
      const authAble = buttonKey.indexOf(id) === -1;
      const style = item.props.style || { color: '#1890ff' };
      if (!divider && authAble) return;
      const element = React.cloneElement(item,
        (
          authAble ? {
            key: index,
            onClick: () => { },
            style: { color: '#8E8E8E' },
          } :
            {
              style,
              key: index,
            }
        )
      );
      const key = `cc-${index}`;
      if (divider) action.push(<Divider key={key} type="vertical" />);
      action.push(element);
    });
    return action;
  }

  makeMoreAction = (rowData) => {
    const moreAction = [
      (
        <a
          key="user-add"
          dataauthid={55}
          onClick={() => {
            this.showModal(rowData, 'processVisible');
          }}
        >
          转正
        </a>
      ),
      (
        <a
          dataauthid={57}
          key="leave"
          onClick={() => {
            this.showModal(rowData, 'leaveVisible');
          }}
        >
          离职
        </a>
      ),
      (
        <a
          dataauthid={58}
          key="again-entry"
          onClick={() => {
            this.showModal(rowData, 'entryVisible');
          }}
        >
          再入职
        </a>
      ),
      (
        <a
          dataauthid={107}
          key="leaving"
          onClick={() => {
            this.showModal(rowData, 'leavingVisible');
          }}
        >
          离职交接
        </a>
      ),
      (
        <a
          key="transfer"
          dataauthid={56}
          onClick={() => {
            this.showModal(rowData, 'transferVisible');
          }}
        >
          人事变动
        </a>
      ),
      (
        <a key="reset" dataauthid={175} onClick={() => this.resetPassword(rowData.staff_sn)}>
          重置密码
        </a>
      ),
      (
        <a
          key="delete"
          dataauthid={59}
          style={{ color: 'red' }}
          onClick={() => {
            this.deleteStaff(rowData.staff_sn);
          }}
        >
          删除
        </a>
      ),
    ];
    const action = this.makeActionElement(moreAction, rowData, false);
    const menu = (
      <Menu>
        {action.map((item, index) => {
          const key = `dd${index}`;
          return (
            <Menu.Item key={key}>
              {item}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link">
          更多操作 <Icon type="down" />
        </a>
      </Dropdown>
    );
  }

  makeAction = (rowData) => {
    const action = [
      <a
        key="userInfo"
        onClick={() => { this.showUserInfo(rowData); }}
      >
        查看
      </a>,
    ];
    let actionList = [
      (
        <a
          key="edit"
          dataauthid={82}
          onClick={() => {
            this.showModal(rowData, 'editVisible');
          }}
        >
          编辑
        </a>
      ),

    ];
    if (rowData.is_active === 0) {
      actionList = [
        (
          <a
            key="unlock"
            dataauthid={66}
            onClick={() => {
              this.unlockStaff(rowData.staff_sn);
            }}
          >
            激活
          </a>
        ),
      ];
    }
    const newAction = this.makeActionElement(actionList, rowData);
    return action.concat(newAction);
  }

  makeStaffActionKey = (rowData) => {
    const buttonKey = [];
    const statusId = rowData.status_id;
    const { user: { authorities: { oa } } } = window;
    if (rowData.is_active === 0) {
      if (oa.indexOf(66)) {
        buttonKey.push(66);
      }
    } else if (rowData.is_active === 1) {
      if (oa.indexOf(66)) {
        buttonKey.push(66);
      }
      if (statusId === 1 && oa.indexOf(55)) {
        buttonKey.push(55);
      }
      if (statusId > 0 && oa.indexOf(175)) {
        buttonKey.push(175);
      }
      if (statusId > 0 && oa.indexOf(56)) {
        buttonKey.push(56);
      }
      if (statusId > 0 && oa.indexOf(57)) {
        buttonKey.push(57);
      }
      if (statusId === 0 && oa.indexOf(107)) {
        buttonKey.push(107);
      }
    }
    if (statusId < 0 && oa.indexOf(58)) {
      buttonKey.push(58);
    }
    if (oa.indexOf(82)) {
      buttonKey.push(82);
    }
    if (oa.indexOf(59)) {
      buttonKey.push(59);
    }
    return buttonKey;
  }

  makeColumns = () => {
    const { brand, department, position } = this.props;
    return [
      {
        width: 90,
        sorter: true,
        title: '编号',
        fixed: 'left',
        searcher: true,
        dataIndex: 'staff_sn',
      }, {
        width: 70,
        title: '姓名',
        fixed: 'left',
        searcher: true,
        dataIndex: 'realname',
      }, {
        width: 100,
        title: '电话',
        searcher: true,
        align: 'center',
        dataIndex: 'mobile',
      }, {
        width: 100,
        title: '品牌',
        align: 'center',
        dataIndex: 'brand_id',
        filters: getFiltersData(brand),
        render: key => OATable.renderEllipsis(findRenderKey(brand, key).name, true),
      }, {
        width: 100,
        title: '职位',
        dataIndex: 'position_id',
        filters: getFiltersData(position),
        render: key => findRenderKey(position, key).name,
      }, {
        width: 200,
        title: '部门',
        treeFilters: {
          value: 'id',
          title: 'name',
          data: department,
          parentId: 'parent_id',
        },
        dataIndex: 'department_id',
        render: key => OATable.renderEllipsis(findRenderKey(department, key).full_name, true),
      },
      {
        width: 70,
        title: '状态',
        align: 'center',
        filters: status,
        dataIndex: 'status_id',
        render: key => findRenderKey(status, key, 'value').text,
      },
      {
        width: 200,
        title: '店铺',
        searcher: true,
        dataIndex: 'shop.name',
        render: key => OATable.renderEllipsis(key, true),
      }, {
        width: 100,
        title: '店铺代码',
        dataIndex: 'shop_sn',
      },
      {
        width: 100,
        align: 'center',
        title: '入职日期',
        dateFilters: true,
        dataIndex: 'hired_at',
      }, {
        width: 100,
        hidden: true,
        align: 'center',
        title: '转正日期',
        dateFilters: true,
        dataIndex: 'employed_at',
      }, {
        width: 100,
        hidden: true,
        align: 'center',
        title: '离职日期',
        dateFilters: true,
        dataIndex: 'left_at',
      },
      {
        width: 70,
        title: '性别',
        hidden: true,
        align: 'center',
        filters: gender,
        dataIndex: 'gender',
      },
      {
        width: 100,
        hidden: true,
        align: 'center',
        title: '员工属性',
        dataIndex: 'property',
        render: val => staffProperty[val],
        filters: staffProperty.map((item, index) => ({ value: `${index}`, text: item })),
      },
      {
        width: 200,
        title: '操作',
        fixed: 'right',
        render: (_, rowData) => {
          const checkBrand = getBrandAuthority(rowData.brand_id);
          const checkDepartment = getDepartmentAuthority(rowData.department_id);
          if ((!checkBrand || !checkDepartment) && rowData.status_id > 0) {
            return '暂无操作权限';
          }
          return (
            <Fragment>
              {this.makeAction(rowData)}
              {rowData.is_active === 1 && <Divider type="vertical" />}
              {rowData.is_active === 1 && this.makeMoreAction(rowData)}
            </Fragment>
          );
        },
      },
    ];
  }

  makeExtraOperator = () => {
    const extra = [];
    const { staff: { total } } = this.props;
    extra.push(
      (customerAuthority(62)) && (
        <Button
          icon="plus"
          key="plus"
          type="primary"
          onClick={() => {
            this.setState({ editVisible: true });
          }}
        >
          添加员工
        </Button>
      ),
      (customerAuthority(62)) && (
        <ImportStaff key="importPop" />
      ),
      (customerAuthority(84) && (
        <ExportStaff key="exportBtn" filters={this.searchFilter} total={total} />
      ))
    );
    return extra;
  }

  tabsChange = (activeKey) => {
    this.setState({ activeKey });
  }

  render() {
    const { panes, activeKey, filters } = this.state;
    const { staffLoading, staffInfo, staffInfoLoading, staff } = this.props;
    const columns = this.makeColumns();
    return (
      <Fragment>
        <Tabs
          hideAdd
          animated
          type="editable-card"
          onEdit={this.onEdit}
          activeKey={activeKey}
          onChange={this.tabsChange}
        >
          <TabPane
            tab="员工列表"
            key="staff_list"
            closable={false}
          >
            <OATable
              bordered
              serverSide
              extraColumns
              autoComplete
              columns={columns}
              filters={filters}
              total={staff.total}
              scroll={{ y: 550 }}
              loading={staffLoading}
              dataSource={staff.data}
              moreSearch={<Search />}
              fetchDataSource={this.fetchStaff}
              extraOperator={this.makeExtraOperator()}
            />
          </TabPane>
          {panes.map((pane) => {
            return (
              <TabPane
                key={pane.key}
                tab={pane.title}
                closable={pane.closable}
              >
                {staffInfo[pane.key] && (Object.keys(staffInfo[pane.key]).length !== 0) && (
                  <StaffInfo
                    loading={staffInfoLoading}
                    data={staffInfo[pane.key]}
                    staffId={pane.key}
                  />
                )}
              </TabPane>
            );
          })}
        </Tabs>
        <EditStaff
          visible={this.state.editVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({ editVisible: false, editStaff: {} });
          }}
        />
        <EditTransfer
          visible={this.state.transferVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              transferVisible: false,
              editStaff: {},
            });
          }}
        />
        <EditLeave
          visible={this.state.leaveVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              leaveVisible: false,
              editStaff: {},
            });
          }}
        />
        <EditLeaving
          visible={this.state.leavingVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              leavingVisible: false,
              editStaff: {},
            });
          }}
        />
        <AgainEntry
          visible={this.state.entryVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              entryVisible: false,
              editStaff: {},
            });
          }}
        />
        <EditProcess
          visible={this.state.processVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              processVisible: false,
              editStaff: {},
            });
          }}
        />
      </Fragment>
    );
  }
}
