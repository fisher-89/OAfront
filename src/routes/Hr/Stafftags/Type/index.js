import React, { PureComponent, Fragment } from 'react';
import { Button, List, Icon } from 'antd';
import Ellipsis from '../../../../components/Ellipsis';
import TagTypeForm from './form';
import styles from './form.less';
import store from '../store/type';

@store(['fetchTypes', 'deleted'])
export default class extends PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  componentWillMount() {
    const { fetchTypes } = this.props;
    fetchTypes();
  }

  handleModalVisible= (flag) => {
    this.setState({
      visible: !!flag,
    });
  }

  handleClose = (record) => {
    const { deleted } = this.props;
    deleted(record.id);
  }

  render() {
    const { visible, initialValue } = this.state;
    const {
      stafftagtypes,
    } = this.props;
    return (
      <Fragment>
        <Button
          icon="plus"
          type="dashed"
          size="small"
          style={{ color: '#888', width: '100%', marginBottom: 10 }}
          onClick={() => {
            this.handleModalVisible(true);
            this.setState({ initialValue: {} });
          }}
        >
      标签类型
        </Button>
        <List
          dataSource={stafftagtypes}
          bordered
          size="small"
          renderItem={(item) => {
            return (
              <List.Item >
                <div className={styles.tags}>
                  <span className={styles.icon} style={{ backgroundColor: item.color }} />
                  <Ellipsis tooltip length={6} style={{ display: 'inline' }}>{item.name}</Ellipsis>
                  <div style={{ float: 'right' }}>
                    <Icon
                      className={styles.edit}
                      type="edit"
                      onClick={() => {
                        this.setState({ visible: true, initialValue: item });
                      }}
                    />
                    <Icon
                      className={styles.edit}
                      type="close"
                      onClick={() => this.handleClose(item)}
                    />
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
        <TagTypeForm
          visible={visible}
          initialValue={initialValue}
          onCancel={this.handleModalVisible}
        />
      </Fragment>
    );
  }
}
