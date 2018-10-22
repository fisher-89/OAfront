/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent, Fragment } from 'react';

import {
  Divider,
  Popover,
  Button,
  Icon,
  Tooltip,
  Tabs,
  Modal,
  notification,
} from 'antd';

import { connect } from 'dva';
import { Link } from 'dva/router';
import StaffInfo from './staffInfo';
import MoreSearch from './moreSearch';
import EditTransfer from './editTransfer';
import EditLeave from './editLeave';
import OATable from '../../../components/OATable';
import EditStaff from './edit';
import ImportStaff from './import';
import ExportStaff from './export';
import EditProcess from './editProcess';

import {
  customerAuthority,
  getBrandAuthority,
  getDepartmentAuthority,
} from '../../../utils/utils';

const { TabPane } = Tabs;

@connect(({ staffs, brand, department, position, loading }) => ({
  staff: staffs.staff,
  brand: brand.brand,
  position: position.position,
  department: department.department,
  staffInfo: staffs.staffDetails,
  staffLoading: loading.models.staffs,
}))

export default class extends PureComponent {
  state = {
    moreInfo: null,
    visible: false,
    panes: [],
    activeKey: 'staff_list',
    editVisible: false,
    transferVisible: false,
    leaveVisible: false,
    processVisible: false,
    editStaff: {},
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'position/fetchPosition' });
    dispatch({ type: 'department/fetchDepartment', payload: { withTrashed: true } });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  fetchStaff = (param) => {
    this.searchFilter = param;
    const { dispatch } = this.props;
    if (this.moreSearch) {
      this.searchFilter = {
        ...param,
        ...this.moreSearch.state.formFilter,
      };
    }
    dispatch({ type: 'staffs/fetchStaff', payload: this.searchFilter });
  }

  handleVisibleChange = (visible) => {
    if (this.modalVisible) {
      return;
    }
    this.setState({ visible });
  }

  fetchStaffInfo = (param) => {
    const { dispatch } = this.props;
    dispatch({ type: 'staffs/fetchStaffInfo', payload: param });
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

  showStaffTransfer = (editStaff) => {
    this.setState({ editStaff }, () => this.setState({ transferVisible: true }));
  }

  showStaffLeave = (editStaff) => {
    this.setState({ editStaff }, () => this.setState({ leaveVisible: true }));
  }

  showEditStaff = (editStaff) => {
    this.setState({ editStaff }, () => this.setState({ editVisible: true }));
  }

  showStaffProcess = (editStaff) => {
    this.setState({ editStaff }, () => this.setState({ processVisible: true }));
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
      onCancel: () => {},
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
      onCancel: () => {},
    });
  }

  makeAction = (rowData) => {
    const handleButton = {
      66: (
        <Link to="/" key="unlock">
          <Tooltip title="激活" mouseLeaveDelay={0}>
            <Icon type="unlock" style={{ fontSize: '18px' }} />
          </Tooltip>
        </Link>
      ),
      55: (
        <Tooltip title="转正" key="user-add" mouseLeaveDelay={0}>
          <a
            onClick={() => {
              this.showStaffProcess(rowData);
            }}
          >
            <Icon type="user-add" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
      56: (
        <Tooltip title="人事变动" key="transfer" mouseLeaveDelay={0}>
          <a
            onClick={() => {
              this.showStaffTransfer(rowData);
            }}
          >
            <Icon type="retweet" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
      57: (
        <Tooltip title="离职" key="user-delete" mouseLeaveDelay={0}>
          <a
            onClick={() => {
              this.showStaffLeave(rowData);
            }}
          >
            <Icon type="user-delete" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
      107: (
        <Link to="/" key="107">
          <Tooltip title="离职交接" mouseLeaveDelay={0}>
            <Icon type="user-delete" style={{ fontSize: '18px' }} />
          </Tooltip>
        </Link>
      ),
      58: (
        <Tooltip title="再入职" key="again-entry" mouseLeaveDelay={0}>
          <a
            onClick={() => {
              this.showEditStaff(rowData);
            }}
          >
            <Icon type="user-add" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
      82: (
        <Tooltip title="编辑" mouseLeaveDelay={0} key="edit">
          <a
            onClick={() => {
              this.showEditStaff(rowData);
            }}
          >
            <Icon type="form" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
      59: (
        <Tooltip title="删除" key="delete" mouseLeaveDelay={0}>
          <a
            style={{ color: 'red' }}
            onClick={() => {
              this.deleteStaff(rowData.staff_sn);
            }}
          >
            <Icon type="delete" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
      175: (
        <Tooltip title="重置密码" key="reset" mouseLeaveDelay={0}>
          <a onClick={() => this.resetPassword(rowData.staff_sn)}>
            <Icon type="sync" theme="outlined" style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
      ),
    };
    const action = [
      <Tooltip title="个人信息" key="solution" mouseLeaveDelay={0}>
        <a
          style={{ color: '#08979c' }}
          onClick={() => {
            this.showUserInfo(rowData);
          }}
        >
          <Icon type="solution" style={{ fontSize: '18px' }} />
        </a>
      </Tooltip>,
    ];
    const buttonKey = this.makeStaffActionKey(rowData.status_id);
    buttonKey.forEach((key, i) => {
      const dividerKey = `${i}d`;
      action.push(<Divider key={dividerKey} type="vertical" />);
      action.push(handleButton[key]);
    });
    return action;
  }

  makeStaffActionKey = (statusId) => {
    const buttonKey = [];
    const { user, user: { authorities: { oa } } } = window;
    if (user.is_active === 0) {
      if (oa.indexOf(66)) {
        buttonKey.push(66);
      }
    } else if (user.is_active === 1) {
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
        // buttonKey.push(107);
      }
    }
    if (statusId <= 0 && oa.indexOf(58)) {
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
    const genderArr = ['未知', '男', '女'];
    const gender = [{ value: 1, text: '男' }, { value: 2, text: '女' }];
    const staffProperty = ['无', '108将', '36天罡', '24金刚', '18罗汉'];
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

    return [
      {
        title: '编号',
        fixed: 'left',
        width: 70,
        dataIndex: 'staff_sn',
        sorter: true,
      }, {
        title: '姓名',
        fixed: 'left',
        align: 'center',
        width: 70,
        dataIndex: 'realname',
        searcher: true,
      }, {
        title: '电话',
        dataIndex: 'mobile',
        align: 'center',
        searcher: true,
      }, {
        title: '品牌',
        align: 'center',
        dataIndex: 'brand_id',
        filters: brand && brand.map((item) => {
          return { text: item.name, value: item.id };
        }),
        render: (val) => {
          const data = brand && brand.filter(item => item.id === val)[0];
          return data ? data.name : '';
        },
      }, {
        title: '职位',
        dataIndex: 'position_id',
        filters: position && position.map((item) => {
          return { text: item.name, value: item.id };
        }),
        render: (val) => {
          const data = position && position.filter(item => item.id === val)[0];
          return data ? data.name : '';
        },
      }, {
        title: '部门',
        dataIndex: 'department_id',
        width: 200,
        treeFilters: {
          title: 'name',
          value: 'id',
          parentId: 'parent_id',
          data: department.map(item => item),
        },
        render: (val) => {
          const data = department && department.filter(item => item.id === val)[0];
          const fullName = data ? data.full_name : '';
          const content = (
            <Tooltip title={fullName} placement="right">
              {fullName}
            </Tooltip>
          );
          return content;
        },
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        align: 'center',
        filters: status,
        render: val => status.filter(item => item.value === val)[0].text,
      },
      {
        title: '店铺',
        dataIndex: 'shop.name',
        searcher: true,
        render: (val) => {
          if (val) {
            const content = (
              <Tooltip title={val} placement="right">
                {val}
              </Tooltip>
            );
            return content;
          }
        },
      }, {
        title: '店铺代码',
        dataIndex: 'shop_sn',
        searcher: true,
      },
      {
        title: '入职日期',
        dataIndex: 'hired_at',
        align: 'center',
        dateFilters: true,
      }, {
        title: '转正日期',
        dataIndex: 'employed_at',
        align: 'center',
        dateFilters: true,
      }, {
        title: '离职日期',
        dataIndex: 'left_at',
        align: 'center',
        dateFilters: true,
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        align: 'center',
        dateFilters: true,
      },
      {
        title: '性别',
        dataIndex: 'gender_id',
        align: 'center',
        filters: gender,
        render: val => genderArr[val],
      },
      {
        title: '员工属性',
        dataIndex: 'property_id',
        align: 'center',
        filters: staffProperty.map((item, i) => {
          return { text: item, value: i };
        }),
        render: val => staffProperty[val],
      },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        key: 'operation',
        render: (val, rowData) => {
          const checkBrand = getBrandAuthority(rowData.brand_id);
          const checkDepartment = getDepartmentAuthority(rowData.department_id);
          if ((!checkBrand || !checkDepartment) && rowData.status_id > 0) {
            return '暂无操作权限';
          }
          return (
            <Fragment>
              {this.makeAction(rowData)}
            </Fragment>
          );
        },
      },
    ];
  }

  makeExtraOperator = () => {
    const extra = [];
    const { staff: { total } } = this.props;
    const { visible, moreInfo } = this.state;
    let style = {};
    if (moreInfo) {
      style = {
        color: '#40a9ff',
        backgroundColor: '#fff',
        borderColor: '#40a9ff',
      };
    }
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
    extra.push((
      <Popover
        key="searchPop"
        visible={visible}
        trigger="click"
        placement="bottomLeft"
        onVisibleChange={this.handleVisibleChange}
        content={(
          <MoreSearch
            ref={(e) => {
              this.moreSearch = e;
            }}
            modalVisible={this.searChModal}
            fetchDataSource={this.fetchStaff}
            loading={this.props.staffLoading}
            defaultFilter={this.searchFilter}
            handleVisibleChange={this.handleVisibleChange}
          />
        )}
      >
        <Button icon="search" style={style}>更多搜索</Button>
      </Popover>
    ));

    return extra;
  }

  tabsChange = (activeKey) => {
    this.setState({ activeKey });
  }

  searChModal = (visible) => {
    this.modalVisible = visible;
  }

  render() {
    const { panes, activeKey } = this.state;
    const { staffLoading, staffInfo, staff } = this.props;
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
              serverSide
              loading={staffLoading}
              scroll={{ x: 300 }}
              columns={this.makeColumns()}
              dataSource={staff && staff.data}
              total={staff && staff.total}
              filtered={staff && staff.filtered}
              extraOperator={this.makeExtraOperator()}
              fetchDataSource={this.fetchStaff}
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
                    loading={staffLoading}
                    data={staffInfo[pane.key]}
                    staffId={pane.key}
                  />
                )}
              </TabPane>
            );
          })}
        </Tabs>
        <EditStaff
          loading={staffLoading}
          visible={this.state.editVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              editVisible: false,
              editStaff: {},
            });
          }}
        />
        <EditTransfer
          loading={staffLoading}
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
          loading={staffLoading}
          visible={this.state.leaveVisible}
          editStaff={this.state.editStaff}
          onCancel={() => {
            this.setState({
              leaveVisible: false,
              editStaff: {},
            });
          }}
        />
        <EditProcess
          loading={staffLoading}
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
