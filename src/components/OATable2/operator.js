import React, { PureComponent } from 'react';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import styles from './index.less';

class Operator extends PureComponent {
  makeMultiOperator = () => {
    const { multiOperator, selectedRows } = this.props;
    return (
      <Menu onClick={({ key }) => {
        const [_thisClick] = multiOperator.filter((_, index) => index.toString() === key);
        _thisClick.action(selectedRows);
      }}
      >
        {
          multiOperator.map((item, index) => {
            const key = `${index}`;
            return (
              <Menu.Item key={key}>
                {item.text}
              </Menu.Item>
            );
          })
        }
      </Menu>
    );
  }

  render() {
    const {
      selectedRows,
      sorter,
      filters,
      multiOperator,
      extraOperator,
      extraOperatorRight,
      fetchTableDataSource,
      resetFilter,
      // clearSelectedRows,
      sync,
    } = this.props;
    const hasFilter = Object.keys(filters)
      .filter(key => filters[key] && filters[key].length)
      .length > 0;
    return (
      <div style={{ display: 'flex' }}>
        <div
          className={styles.filterTableOperator}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          {extraOperator || null}
          {sync && (
            <Tooltip title="数据同步">
              <Button
                icon="sync"
                onClick={() => {
                  fetchTableDataSource();
                }}
              />
            </Tooltip>
          )}
          {
            (Object.keys(sorter).length > 0 || hasFilter) &&
            (<Button onClick={() => resetFilter()}>清空筛选</Button>)
          }
          {
            selectedRows.length > 0 && multiOperator && (
              <React.Fragment>
                <Dropdown overlay={this.makeMultiOperator()} trigger={['click']}>
                  <Button icon="menu-fold" style={{ fontSize: '12px' }}>
                    批量操作
                  </Button>
                </Dropdown>
              </React.Fragment>
            )
          }
        </div>
        <div className={styles.filterTableOperator} style={{ alignSelf: 'flex-end' }}>
          {extraOperatorRight || null}
        </div>
      </div>
    );
  }
}

export default Operator;
