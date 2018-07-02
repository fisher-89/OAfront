import React, { PureComponent } from 'react';
import { Button, Dropdown, Icon, Menu, Tooltip } from 'antd';
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
      fetchTableDataSource, resetFilter, clearSelectedRows,
    } = this.props;
    const hasFilter = Object.keys(filters)
      .filter(key => filters[key] && filters[key].length)
      .length > 0;
    return (
      <div className={styles.filterTableOperator} style={{ display: 'flex' }}>
        {extraOperator || null}
        <Tooltip title="数据同步">
          <Button
            icon="sync"
            onClick={() => {
            fetchTableDataSource();
          }}
          />
        </Tooltip>
        {
          (Object.keys(sorter).length > 0 || hasFilter) &&
          (<Button onClick={() => resetFilter()}>清空筛选</Button>)
        }
        {
          selectedRows.length > 0 && multiOperator && (
            <span>
              <Dropdown overlay={this.makeMultiOperator()} trigger={['click']}>
                <Button>
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
              <Button style={{ margin: '0 8px' }} type="danger" onClick={() => clearSelectedRows()}>清空选择</Button>
            </span>
          )
        }
      </div>
    );
  }
}

export default Operator;
