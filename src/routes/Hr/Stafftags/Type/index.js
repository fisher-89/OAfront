import React, { PureComponent, Fragment } from 'react';
import { Button, List, Icon } from 'antd';
import Ellipsis from '../../../../components/Ellipsis';
import TagTypeForm from './form';
import styles from './form.less';

export default class extends PureComponent {
  state = {
    visible: false,
  }
  handleModalVisible= (flag) => {
    this.setState({
      visible: !!flag,
    });
  }
  render() {
    const data = [{
      id: 6,
      name: 'aaaaws',
      color: '#2a52be',
    },
    {
      id: 7,
      name: 'abaws',
      color: '#2a52be',
    }];
    const { visible, initialValue } = this.state;
    return (
      <Fragment>
        <Button
          icon="plus"
          type="dashed"
          size="small"
          style={{ color: '#888', width: 200, marginBottom: 10 }}
          onClick={() => this.handleModalVisible(true)}
        >
      标签类型
        </Button>
        <List
          dataSource={data}
          bordered
          size="small"
          style={{ width: 200 }}
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
                    />
                    <Icon
                      className={styles.edit}
                      type="close"
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
