import React from 'react';
import { Drawer } from 'antd';
import { connect } from 'dva';
import CheckInfo from './checkInfo';


@connect(({ point, loading }) => ({
  buckleInfo: point.eventLogDetails,
  loading: loading.effects['buckle/fetchBuckleGroupsInfo'],
}))
export default class extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id && nextProps.id) {
      this.fetchEventLog({ id: nextProps.id });
    }
  }


  fetchEventLog = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchEventLog', payload: params });
  }


  render() {
    const { id, onClose, loading, buckleInfo, visible } = this.props;
    const data = buckleInfo[id] || {};
    return (
      <Drawer
        width={420}
        title="事件详情"
        visible={visible}
        onClose={onClose}
        loading={loading}
      >
        <CheckInfo data={data} />
      </Drawer>
    );
  }
}
