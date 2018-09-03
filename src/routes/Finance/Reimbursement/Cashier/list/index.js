import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs } from 'antd';
import Detail from '../../detail';
import UnPaidList from './unpaid';
import PaidList from './paid';

const { TabPane } = Tabs;

@connect(({ reimbursement }) => ({
  detail: reimbursement.detailInfo,
}))

export default class extends PureComponent {
  state = {
    detailVisible: false,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchFundsAttribution' });
    dispatch({ type: 'reimbursement/fetchStatus' });
    dispatch({ type: 'reimbursement/fetchExpenseTypes' });
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

  render() {
    const { detail } = this.props;
    const { detailVisible } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col span={detailVisible ? 9 : 24} style={{ paddingRight: 10 }}>
            <Card bordered={false}>
              <Tabs>
                <TabPane tab="未转账" key="processing" style={{ minHeight: 500 }}>
                  <UnPaidList
                    visible={detailVisible}
                    showDetail={this.showDetail}
                  />
                </TabPane>
                <TabPane tab="已转账" key="approved" style={{ minHeight: 500 }}>
                  <PaidList visible={detailVisible} showDetail={this.showDetail} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col span={detailVisible ? 15 : 0}>
            <Card bordered={false}>
              <Detail
                info={detail}
                onClose={() => this.setState({ detailVisible: false })}
              />
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
