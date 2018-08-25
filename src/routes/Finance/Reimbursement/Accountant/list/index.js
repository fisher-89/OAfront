import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs } from 'antd';
import Detail from '../../detail';
import ProcessingList from './processing';
import OvertimeList from './overtime';
import ApprovedList from './approved';
import RejectedList from './rejected';
import PackageList from '../packageList';

const { TabPane } = Tabs;

@connect(({ reimbursement }) => ({
  detail: reimbursement.detailInfo,
}))

export default class extends PureComponent {
  state = {
    detailVisible: false,
    packageListVisible: false,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchFundsAttribution' });
    dispatch({ type: 'reimbursement/fetchStatus' });
  }

  showDetail = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reimbursement/updateDetail',
      payload: rowData,
    });
    this.setState({
      detailVisible: true,
    });
  }

  openPackageList = () => {
    this.setState({
      packageListVisible: true,
    });
  }

  closePackageList = () => {
    this.setState({
      packageListVisible: false,
    });
  }

  render() {
    const { detail } = this.props;
    const { detailVisible, packageListVisible } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col span={detailVisible ? 8 : 24} style={{ paddingRight: 10 }}>
            <Card bordered={false}>
              <Tabs>
                <TabPane tab="待审" key="processing" style={{ minHeight: 500 }}>
                  <ProcessingList
                    visible={detailVisible}
                    showDetail={this.showDetail}
                    openPackageList={this.openPackageList}
                  />
                </TabPane>
                <TabPane tab="逾期" key="overtime" style={{ minHeight: 500 }}>
                  <OvertimeList
                    visible={detailVisible}
                    showDetail={this.showDetail}
                    openPackageList={this.openPackageList}
                  />
                </TabPane>
                <TabPane tab="已通过" key="approved" style={{ minHeight: 500 }}>
                  <ApprovedList visible={detailVisible} showDetail={this.showDetail} />
                </TabPane>
                <TabPane tab="已驳回" key="rejected" style={{ minHeight: 500 }}>
                  <RejectedList visible={detailVisible} showDetail={this.showDetail} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col span={detailVisible ? 16 : 0}>
            <Card bordered={false}>
              <Detail
                info={detail}
                onClose={() => this.setState({ detailVisible: false })}
              />
            </Card>
          </Col>
        </Row>
        <PackageList visible={packageListVisible} onCancel={this.closePackageList} />
      </React.Fragment>
    );
  }
}
