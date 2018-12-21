import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Badge,
  Button,
  Divider,
  Popconfirm,
} from 'antd';
import OATable from '../../../components/OATable';

@connect(({ workflow, loading }) => ({
  list: workflow.auth,
  loading: (
    loading.effects['workflow/fetchAuthIndex']
  ),
}))

export default class List extends Component {
  // 请求列表数据
  fetchDataSource = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchAuthIndex',
      payload: params,
    });
  };
  // 点击添加角色
  handleAdd = () => {
    const { addRole } = this.props;
    addRole();
  };
  // 删除
  delete = (id) => {
    const { deleteRole } = this.props;
    deleteRole(id);
  };
  // 编辑
  update = (id) => {
    const { updateRole } = this.props;
    updateRole(id);
  };
  // table字段
  columns = [
    { title: '序号', dataIndex: 'id', align: 'center', sorter: true },
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
      searcher: true,
      // render: key => OATable.renderEllipsis(key, true),
      render: (text, record) => {
        let value = <span title={text}>{text}</span>;
        if (record.is_super) {
          const style = { background: '#ffffff', color: '#188FFF', borderColor: '#188FFF' };
          const superText = (
            <Badge count="超" style={style} />
          );
          value = <span title={text}>{text} {superText}</span>;
        }
        return value;
      },
    },
    {
      title: '操作权限',
      align: 'center',
      searcher: true,
      render: (text, record) => {
        let value = '';
        if (record.handle.length > 0) {
          const handleName = record.handle.map((item) => {
            let name = '';
            switch (item.id) {
              case 1:
                name = '查看';
                break;
              case 2:
                name = '添加';
                break;
              case 3:
                name = '编辑';
                break;
              case 4:
                name = '删除';
                break;
              default:
                name = '';
            }
            return name;
          });
          value = handleName.join('、');
        }
        return OATable.renderEllipsis(value, true);
      },
    },
    {
      title: '关联员工',
      align: 'center',
      searcher: true,
      render: (text, record) => {
        let staffText = '';
        if (record.staff.length > 0) {
          const staffArr = record.staff.map((staff) => {
            return staff.realname;
          });
          staffText = staffArr.join('、');
        }
        return OATable.renderEllipsis(staffText, true);
      },
    },
    {
      title: '关联流程',
      dataIndex: 'flow_auth',
      align: 'center',
      searcher: true,
      render: (text, record) => {
        let value = '';
        if (record.flow_auth.length > 0) {
          const flowAuth = record.flow_auth.map((auth) => {
            return auth.flow.name;
          });
          value = flowAuth.join('、');
        }
        return OATable.renderEllipsis(value, true);
      },
    },
    {
      title: '关联表单',
      dataIndex: 'form_auth',
      align: 'center',
      searcher: true,
      render: (text, record) => {
        let value = '';
        if (record.flow_auth.length > 0) {
          const formAuth = record.form_auth.map((auth) => {
            return auth.form.name;
          });
          value = formAuth.join('、');
        }
        return OATable.renderEllipsis(value, true);
      },
    },
    {
      title: '操作',
      render: ({ id }) => {
        return (
          <span>
            <a href="#" title="编辑" onClick={() => this.update(id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="你确认删除" onConfirm={() => this.delete(id)}>
              <a href="#" title="删除">删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  // 额外操作按钮
  extraOperator = [
    (
      <Button key="add" type="primary" onClick={this.handleAdd}>新建角色</Button>
    ),
  ];

  render() {
    const { list, loading } = this.props;
    return (
      <OATable
        // serverSide
        data={list}
        loading={loading}
        // total={list.total}
        columns={this.columns}
        fetchDataSource={this.fetchDataSource}
        extraOperator={this.extraOperator}
      />
    );
  }
}
