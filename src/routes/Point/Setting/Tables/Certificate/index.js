import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
  Layout,
  Menu,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../../../components/OATable';
import CertificateForm from './form';
import StaffCertificateForm from './staffForm';
import StaffCertificateTable from './staff';
import { customerAuthority } from '../../../../../utils/utils';

const { Content, Sider } = Layout;
@connect(({ point, loading }) => ({
  certificate: point.certificate,
  certificateLoading: loading.effects['point/fetchCertificate'],
  deleteLoaing: loading.effects['point/deleteCertificate'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    addStaffVisible: false,
    menuKey: '0',
    editInfo: {},
  }

  fetchDataSource = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchCertificate', payload: {} });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({
      editInfo: data,
    }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/deleteCertificate', payload: { id } });
  }

  handleAddStaffVisible = (flag) => {
    this.setState({ addStaffVisible: !!flag });
  }


  handleClick = ({ key }) => {
    this.setState({ menuKey: key });
  }

  makeCertificateColumns = () => {
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
        title: '说明',
        dataIndex: 'description',
      },
      {
        title: '基础分',
        dataIndex: 'point',
        rangeFilters: true,
      },
    ];
    if (customerAuthority(162) || customerAuthority(161)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(161) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(162) && (
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
    if (customerAuthority(160)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          onClick={() => this.handleModalVisible(true)}
        >
          添加证书
        </Button>
      ));
    }
    return extra;
  }

  makeStaffExtraOperator = () => {
    const extra = [];
    if (customerAuthority(164)) {
      extra.push((
        <Button
          icon="plus"
          key="staffPlus"
          type="primary"
          onClick={() => this.handleAddStaffVisible(true)}
        >
          分配证书
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { certificate, certificateLoading, deleteLoaing } = this.props;
    const {
      visible,
      editInfo,
      menuKey,
      addStaffVisible,
    } = this.state;
    return (
      <React.Fragment>

        <Layout>
          <Sider
            theme="light"
            breakpoint="lg"
            collapsedWidth="0"
            style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu theme="light" mode="inline" defaultSelectedKeys={['0']} onClick={this.handleClick}>
              <Menu.Item key="0">
                <span className="nav-text">证书配置</span>
              </Menu.Item>
              <Menu.Item key="1">
                <span className="nav-text">证书分配</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>

            <Content style={{ background: '#fff', padding: 5 }}>
              {menuKey === '0' ? (
                <OATable
                  loading={certificateLoading || deleteLoaing}
                  extraOperator={this.makeExtraOperator()}
                  columns={this.makeCertificateColumns()}
                  data={certificate}
                  fetchDataSource={this.fetchDataSource}
                  scroll={{ x: 300 }}
                  pagination={{
                    showQuickJumper: false,
                    showSizeChanger: false,
                  }}
                />
              ) : (<StaffCertificateTable extraOperator={this.makeStaffExtraOperator} />)}
            </Content>
          </Layout>
        </Layout>
        {
          (customerAuthority(160) || customerAuthority(161)) &&
          (
            <CertificateForm
              initialValue={editInfo}
              visible={visible}
              onCancel={() => { this.setState({ editInfo: {} }); }}
              handleVisible={this.handleModalVisible}
            />
          )
        }
        {
          (customerAuthority(164) || customerAuthority(165)) &&
          (
            <StaffCertificateForm
              visible={addStaffVisible}
              handleVisible={this.handleAddStaffVisible}
            />
          )
        }
      </React.Fragment>
    );
  }
}
