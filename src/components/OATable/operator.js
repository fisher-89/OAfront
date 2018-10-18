import React, { PureComponent } from 'react';
import { Button, Dropdown, Menu, Tooltip, Popover, Tag } from 'antd';
import styles from './index.less';


const ButtonGroup = Button.Group;
class Operator extends PureComponent {
  state = {
    hovered: false,
  };

  handleHoverChange = (visible) => {
    this.setState({
      hovered: !!visible,
    });
  }

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

  makeFilterString = (value, column) => {
    let newValue = value;
    if (column.filterData) {
      if (Array.isArray(column.filterData)) {
        newValue = column.filterData
          .filter(item => newValue.indexOf(item.value.toString()) !== -1)
          .map(item => item.text);
      } else if (typeof column.filterData === 'object') {
        const filterData = column.filterData.data;
        const dataIndex = column.filterData.value;
        const text = column.filterData.title;
        newValue = filterData
          .filter(item => (value.indexOf(`${item[dataIndex]}`) !== -1))
          .map(item => item[text]);
      }
      newValue = newValue.join('，');
    } else if (typeof value === 'object') {
      newValue = [];
      Object.keys(value).forEach((key) => {
        if (key === 'like') {
          newValue = value[key];
        } else if (key === 'min' || key === 'max') {
          newValue.push(value[key]);
        }
      });
      if (typeof newValue !== 'string') {
        newValue = newValue.join('~');
      }
    }
    return newValue;
  }

  renderFiltersTag = () => {
    const { filterColumns, resetFilter, filters } = this.props;
    const filtersTag = [];
    filterColumns.forEach((item) => {
      Object.keys(filters).forEach((name) => {
        const filterValue = filters[name];
        if (item.dataIndex === name && filters[name]) {
          let lable = item.filterData ? filterValue : filterValue[0];
          lable = this.makeFilterString(lable, item);
          if (lable) {
            const filterTag = { label: `${item.title}：${lable}`, dataIndex: name };
            filtersTag.push(filterTag);
          }
        }
      });
    });
    return (
      <div style={{ width: 300, maxHeight: 230, overflowY: 'scroll' }}>
        {
          filtersTag.map((item) => {
            const tag = item.label;
            const key = item.dataIndex;
            const isLongTag = tag.length > 10;
            const tagElem = (
              <Tag key={key} closable afterClose={() => resetFilter(key)}>
                {isLongTag ? `${tag.slice(0, 10)}...` : tag}
              </Tag>
            );
            return isLongTag ? (<Tooltip title={tag} key={key}>{tagElem}</Tooltip>) : tagElem;
          })
        }
      </div>
    );
  }

  render() {
    const {
      selectedRows,
      filters,
      multiOperator,
      extraOperator,
      extraOperatorRight,
      fetchTableDataSource,
      resetFilter,
      sync,
    } = this.props;
    const hasFilter = Object.keys(filters)
      .filter(key => filters[key] && filters[key].length)
      .length > 0;
    const style = extraOperator.length ? { marginRight: 20 } : {};
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
          {extraOperator || null}
          <span style={style} />
          {
            (hasFilter) &&
            (
              <ButtonGroup>
                <Button onClick={() => resetFilter()}>清空筛选</Button>
                <Popover
                  content={this.renderFiltersTag()}
                  trigger="hover"
                  visible={this.state.hovered}
                  placement="bottomLeft"
                  onVisibleChange={this.handleHoverChange}
                  getPopupContainer={triggerNode => (triggerNode)}
                >
                  <Button icon="down" />
                </Popover>
              </ButtonGroup>
            )
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
