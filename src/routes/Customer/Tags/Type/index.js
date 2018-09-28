import React from 'react';
import { Button, Icon, List } from 'antd';
import store from '../store/type';
import TagTypeForm from './form';
import styles from './index.less';
import { customerAuthority } from '../../../../utils/utils';

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

  handleClose = (record) => {
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
            if (!customerAuthority(180)) return;
            this.setState({ visible: true });
          }}
          icon="plus"
          size="small"
          type="dashed"
          disabled={!customerAuthority(180)}
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
                  {customerAuthority(180) && (
                    <div style={{ float: 'right' }}>
                      <Icon
                        type="edit"
                        className={styles.edit}
                        onClick={() => {
                          this.setState({ visible: true, initialValue: item });
                        }}
                      />
                      <Icon
                        type="close"
                        className={styles.edit}
                        onClick={() => this.handleClose(item)}
                      />
                    </div>
                  )}
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
