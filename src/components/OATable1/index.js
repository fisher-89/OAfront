import React, { PureComponent } from 'react';
import { Table, Input, Icon, message, Button, Tooltip } from 'antd';
import QueueAnim from 'rc-queue-anim';

import TreeFilter from './treeFilter';
import DateFilter from './dateFilter';
import Operator from './operator';
import TableUpload from './upload';
import EdiTableCell from './editTableCell';
import styles from './index.less';

const defaultProps = {
  multiOperator: null,
  extraOperator: null,
  serverSide: false,
  excelExport: null,
  excelInto: null,
  fetchDataSource: () => {
    // message.error('请设置fetchDataSource');
  },
};

class OATable extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    pagination: {
      pageSize: 10,
      current: 1,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal(total, range) {
        return `共 ${total} 条，当前为 ${range[0]}-${range[1]} 条`;
      },
    },
    filterDropdownVisible: false,
    filtered: [],
    filters: {},
    sorter: {},
  };

  componentDidMount() {
    const { data, serverSide } = this.props;
    if (!data || data.length === 0 || serverSide) {
      this.fetchTableDataSource();
    }
  }

  fetchTableDataSource = (fetch) => {
    const { fetchDataSource, columns, serverSide } = this.props;
    const { filters, pagination, sorter } = this.state;
    let params = {};
    if (serverSide) {
      const filterParam = {};
      const searcherParam = {};

      columns.forEach((column, index) => {
        const key = column.dataIndex || index;
        const filter = filters[key];
        if (filter && filter.length > 0) {
          if (column.searcher) {
            filterParam[key] = { like: filter[0] };
          } else if (column.dateFilters) {
            [filterParam[key]] = filter;
          } else {
            filterParam[key] = filter.length === 1 ? filter[0] : { in: filter };
          }
        }
      });
      params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        filters: filterParam,
        searchers: searcherParam,
      };
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }
    }
    if (!fetch) {
      fetchDataSource(params);
    } else {
      return params;
    }
  }


  mapColumns = () => {
    return this.props.columns.map((column, index) => {
      const { filters, sorter } = this.state;
      const { serverSide } = this.props;
      const key = column.dataIndex || index;
      const response = { ...column };
      if (!serverSide) {
        response.sorter = column.sorter === true ? this.makeDefaultSorter(key) : column.sorter;
      }
      response.filteredValue = filters[key] || null;
      response.sortOrder = sorter.columnKey === key && sorter.order;
      if (column.searcher) {
        Object.assign(response, this.makeSearchFilterOption(key, column));
        response.render = response.render || this.makeDefaultSearchRender(key);
      } else if (column.treeFilters) {
        Object.assign(response, this.makeTreeFilterOption(key, column));
      } else if (column.filters) {
        response.onFilter = column.onFilter || this.makeDefaultOnFilter(key);
      } else if (column.dateFilters) {
        Object.assign(response, this.makeDateFilterOption(key, column));
      }
      return response;
    });
  }

  makeSearchFilterOption = (key, column) => {
    const { filtered, filters, filterDropdownVisible } = this.state;
    const { serverSide } = this.props;
    const searchFilterOption = {
      filterIcon: <Icon type="search" style={{ color: filtered.indexOf(key) !== -1 ? '#108ee9' : '' }} />,
      filterDropdown: (
        <Input.Search
          ref={(ele) => {
            this[`searchInput_${key}`] = ele;
          }}
          placeholder="搜索"
          onSearch={this.handleSearch(key)}
          style={{ width: 180 }}
          enterButton
        />
      ),
      filterDropdownVisible: filterDropdownVisible === key,
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          this[`searchInput_${key}`].input.input.value = filters[key] || '';
        }
        this.setState({
          filterDropdownVisible: visible ? key : false,
        }, () => this[`searchInput_${key}`] && this[`searchInput_${key}`].focus());
      },
    };
    if (!serverSide && !column.onFilter) {
      searchFilterOption.onFilter = this.makeDefaultOnSearch(key);
    }
    return searchFilterOption;
  }

  makeTreeFilterOption = (key, column) => {
    const { filterDropdownVisible } = this.state;
    const { serverSide } = this.props;
    const treeFilterOption = {
      filterDropdown: (
        <TreeFilter
          treeFilters={column.treeFilters}
          handleConfirm={this.handleTreeFilter(key)}
        />
      ),
      filterDropdownVisible: filterDropdownVisible === key,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible ? key : false,
        });
      },
    };
    if (!serverSide && !column.onFilter) {
      treeFilterOption.onFilter = this.makeDefaultOnFilter(key);
    }
    return treeFilterOption;
  }

  makeDateFilterOption = (key, column) => {
    const { filterDropdownVisible, filtered } = this.state;
    const { serverSide } = this.props;
    const dateFilterOption = {
      filterIcon: <Icon type="clock-circle-o" style={{ color: filtered.indexOf(key) !== -1 ? '#108ee9' : '' }} />,
      filterDropdown: (
        <DateFilter
          onSearchTime={this.handleDateFilter(key)}
          dateFilterVisible={filterDropdownVisible === key}
        />
      ),
      filterDropdownVisible: filterDropdownVisible === key,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible ? key : false,
        });
      },
    };
    if (!serverSide && !column.onFilter) {
      dateFilterOption.onFilter = this.makeDefaultOnRangeFilter(key);
    }

    return dateFilterOption;
  }

  handleSearch = (key) => {
    return (value) => {
      const { filters, filtered } = this.state;
      const { serverSide } = this.props;
      const searchFilter = value ? [value] : [];
      const filteredState = filtered.filter(item => item !== key);
      if (value) {
        filteredState.push(key);
      }
      this.setState({
        filters: {
          ...filters,
          [key]: searchFilter,
        },
        filterDropdownVisible: false,
        filtered: filteredState,
      }, () => {
        if (serverSide) {
          this.fetchTableDataSource();
        }
      });
    };
  }

  handleTreeFilter = (key) => {
    return (checkedKeys) => {
      const { filters } = this.state;
      const { serverSide } = this.props;
      this.setState({
        filters: {
          ...filters,
          [key]: checkedKeys,
        },
        filterDropdownVisible: false,
      }, () => {
        if (serverSide) {
          this.fetchTableDataSource();
        }
      });
    };
  }

  handleDateFilter = (key) => {
    return (timeValue) => {
      const { filters, filtered } = this.state;
      const { serverSide } = this.props;
      const filteredState = filtered.filter(item => item !== key);
      if (timeValue.length > 0) {
        filteredState.push(key);
      }
      this.setState({
        filters: {
          ...filters,
          [key]: timeValue,
        },
        filterDropdownVisible: false,
        filtered: filteredState,
      }, () => {
        if (serverSide) {
          this.fetchTableDataSource();
        }
      });
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filters,
      pagination,
      sorter,
    }, () => {
      if (this.props.serverSide) {
        this.fetchTableDataSource();
      }
    });
  }

  makeDefaultOnFilter = (key) => {
    return (value, record) => `${record[key]}` === `${value}`;
  }

  makeDefaultOnRangeFilter = (key) => {
    return ({ min, max }, record) => min <= record[key] && max >= record[key];
  }


  makeDefaultOnSearch = (key) => {
    return (value, record) => `${record[key]}`.match(new RegExp(value, 'gi'));
  }

  makeDefaultSorter = (key) => {
    return (a, b) => a[key] - b[key];
  }

  makeDefaultSearchRender = (key) => {
    const { filters } = this.state;
    return (val) => {
      if (filters[key]) {
        const reg = new RegExp(filters[key][0], 'gi');
        const match = `${val}`.match(reg);
        return (
          <span>
            {`${val}`.split(reg).map(
              (text, i) => (
                i > 0 ? [<span key={key} className="ant-table-search-highlight">{match[0]}</span>, text] : text
              )
            )}
          </span>
        );
      } else {
        return val;
      }
    };
  }

  resetFilter = () => {
    const { serverSide } = this.props;
    this.setState({
      filters: {},
      searchers: {},
      filtered: [],
      sorter: {},
    }, () => {
      if (serverSide) {
        this.fetchTableDataSource();
      }
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  clearSelectedRows = () => {
    this.handleRowSelectChange([], []);
  }

  makeTableProps = () => {
    const { pagination, selectedRowKeys } = this.state;
    const { multiOperator, data, serverSide, total, rowSelection } = this.props;
    if (serverSide) {
      pagination.total = total;
    }
    const newRowSelection = multiOperator && multiOperator.length > 0 ? {
      ...rowSelection,
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    } : rowSelection;
    const response = {
      rowKey: (record, index) => record.id || record.staff_sn || record.shop_sn || index,
      dataSource: data,
      pagination,
      onChange: this.handleTableChange,
      size: 'middle',
      bordered: true,
      scroll: { x: true },
      ...this.props,
      rowSelection: newRowSelection,
      columns: this.mapColumns(),
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  handleExportExcel = () => {
    const { excelExport } = this.props;
    const params = this.fetchTableDataSource(true);
    params.filters = {
      ...params.filters,
      export: 1,
    };
    fetchExport(excelExport);
  }


  handleBeforeUpload = (file) => {
    const isExcel = (file.type === 'application/vnd.ms-excel') || (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    if (!isExcel) {
      message.error('你只能上传excel格式的文件!');
    }
    return isExcel;
  }

  handleUpload = () => {
    this.inputFile.click();
  }

  makeExtraOperator = () => {
    const { extraOperator, excelInto, excelExport } = this.props;
    const operator = extraOperator;
    if (excelInto) {
      operator.push(
        <Tooltip key="upload" title="导入数据">
          <TableUpload
            uri={excelInto}
            handleBeforeUpload={this.handleBeforeUpload}
          />
        </Tooltip>
      );
    }

    if (excelExport) {
      operator.push(
        <Tooltip key="download" title="导出数据">
          <Button icon="download" onClick={this.handleExportExcel} />
        </Tooltip>
      );
    }
    return operator;
  }

  render() {
    const { multiOperator } = this.props;
    return (
      <div className={styles.filterTable}>
        <QueueAnim
          type="left"
          leaveReverse
        >
          <Operator
            {...this.state}
            key="hearderBoor"
            multiOperator={multiOperator}
            extraOperator={this.makeExtraOperator()}
            fetchTableDataSource={this.fetchTableDataSource}
            resetFilter={this.resetFilter}
            clearSelectedRows={this.clearSelectedRows}
          />
          <Table
            {...this.makeTableProps()}
            key="table"
          />
        </QueueAnim>
      </div>
    );
  }
}

OATable.EdiTableCell = EdiTableCell;
OATable.defaultProps = defaultProps;

export default OATable;

