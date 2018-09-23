import React from 'react';
import { Button, Icon, Tooltip, List } from 'antd';
import store from '../store/type';
import TagTypeForm from './form';
import styles from './index.less';

@store(['fetchTagsType', 'deleted'])
export default class extends React.PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  componentWillMount() {
    const { fetchTagsType } = this.props;
    fetchTagsType();
  }

  handleClose = (e) => {
    e.preventDefault();
    const { deleted } = this.props;
    deleted(record.id);
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  render() {
    const { visible, initialValue } = this.state;
    const { tagsType } = this.props;
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            this.setState({ visible: true });
          }}
          icon="plus"
          size="small"
          type="dashed"
          style={{ color: '#888', width: 200, marginBottom: 10 }}
        >
          标签类型
        </Button>
        <List
          bordered
          size="small"
          dataSource={tagsType}
          renderItem={(item) => {
            return (
              <List.Item>
                <div className={styles.tags}>
                  <span className={styles.icon} style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                  <div style={{ float: 'right' }}>
                    <Tooltip title="编辑">
                      <Icon
                        type="edit"
                        className={styles.edit}
                        onClick={() => {
                          this.setState({ visible: true, initialValue: item });
                        }}
                      />
                    </Tooltip>
                    <Icon
                      type="close"
                      className={styles.edit}
                      onClick={this.handleClose}
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
      </React.Fragment>
    );
  }
}
