import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Badge,
  Button,
  Divider,
  Popconfirm,
  Tooltip,
} from 'antd';
import OATable from '../../../components/OATable';

@connect(({ workflow, loading }) => ({
  list: workflow.auth,
  loading: (
    loading.effects['workflow/fetchAuthIndex'] ||
    loading.effects['workflow/authDelete']
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
  update = (id, text) => {
    const { updateRole } = this.props;
    updateRole(id, text);
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
      title: '关联员工',
      align: 'center',
      dataIndex: 'staff',
      searcher: true,
      render: (text) => {
        let staffText = '';
        if (text.length > 0) {
          const staffArr = text.map((staff) => {
            return staff.realname;
          });
          staffText = staffArr.join('、');
        }
        return OATable.renderEllipsis(staffText, true);
      },
      onFilter: (value, record) => {
        const staffStr = record.staff.map(item => item.realname);
        return staffStr.indexOf(value) !== -1;
      },
    },
    {
      title: '操作权限',
      align: 'center',
      // dataIndex: 'handle',
      // searcher: true,
      render: (text, record) => {
        const type = {
          1: '查看',
          2: '编辑',
          3: '删除',
        };
        const flowNameText = record.handle_flow.map(flow => flow.name);
        const flowHandleType = record.handle_flow_type.map(value => type[value]);
        const formNameText = record.handle_form.map(form => form.name);
        const formHandleType = record.handle_form_type.map(value => type[value]);
        const style = { lineHeight: '20px', width: '200px', marginTop: '10px' };
        const content = (
          <div>
            <div>
              <span>可操作流程：</span>
              <p style={style}>{flowNameText.join('、')}</p>
              <span>操作类型：</span>
              <p style={style}>{flowHandleType.join('、')}</p>
            </div>
            <Divider dashed />
            <div>
              <span>可操作表单：</span>
              <p style={style}>{formNameText.join('、')}</p>
              <span>操作类型：</span>
              <p style={style}>{formHandleType.join('、')}</p>
            </div>
          </div>
        );
        const trueText = (
          <Tooltip title={content} placement="left">
            <span style={{ padding: '5px 20px' }}>有</span>
          </Tooltip>
        );
        let value = '无';
        if (record.is_super === 1) {
          value = '全部';
        } else if (
          record.is_super === 0 &&
          (record.handle_flow.length > 0 || record.handle_form.length > 0)
        ) {
          value = trueText;
        }
        return value;
      },
    },
    {
      title: '可导出流程',
      dataIndex: 'export_flow',
      align: 'center',
      searcher: true,
      render: (text) => {
        let value = '';
        if (text.length > 0) {
          const flowAuth = text.map((flow) => {
            return flow.name;
          });
          value = flowAuth.join('、');
        }
        return OATable.renderEllipsis(value, true);
      },
      onFilter: (value, record) => {
        const nameStr = record.export_flow.map(item => item.name);
        return nameStr.indexOf(value) !== -1;
      },
    },
    {
      title: '可导出表单',
      dataIndex: 'export_form',
      align: 'center',
      searcher: true,
      render: (text) => {
        let value = '';
        if (text.length > 0) {
          const formAuth = text.map((form) => {
            return form.name;
          });
          value = formAuth.join('、');
        }
        return OATable.renderEllipsis(value, true);
      },
      onFilter: (value, record) => {
        const nameStr = record.export_form.map(item => item.name);
        return nameStr.indexOf(value) !== -1;
      },
    },
    {
      title: '操作',
      render: ({ id }, text) => {
        return (
          <span>
            <a title="编辑" onClick={() => this.update(id, text)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="你确认删除" onConfirm={() => this.delete(id)}>
              <a title="删除">删除</a>
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
