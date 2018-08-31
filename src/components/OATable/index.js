import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Table, Input, Icon, message, Button, Tooltip } from 'antd';
import Ellipsis from '../Ellipsis';
import { makerFilters } from '../../utils/utils';
import TreeFilter from './treeFilter';
import DateFilter from './dateFilter';
import RangeFilter from './rangeFilter';
import Operator from './operator';
import TableUpload from './upload';
import EdiTableCell from './editTableCell';
import styles from './index.less';
import request from '../../utils/request';


const defaultProps = {
  multiOperator: null,
  extraOperator: null,
  extraOperatorRight: null,
  serverSide: false,
  excelExport: null,
  excelInto: null,
  excelTemplate: null,
  extraExportFields: [],
  filtered: 0,
  sync: true,
  operatorVisble: true,
  tableVisible: true,
  autoScroll: false,
  fetchDataSource: () => {
    // message.error('请设置fetchDataSource');
  },
};

class OATable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: this.showTotal,
      },
      filterDropdownVisible: false,
      filtered: [],
      filters: {},
      sorter: {},
      loading: false,
    };
  }

  componentDidMount() {
    const { data, serverSide } = this.props;
    if (!data || data.length === 0 || serverSide) {
      this.fetchTableDataSource();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { rowSelection, multiOperator } = nextProps;
    if (
      multiOperator && multiOperator.length > 0
      &&
      rowSelection
      && JSON.stringify(rowSelection) !== JSON.stringify(this.props.rowSelection)
    ) {
      const { selectedRowKeys, selectedRows } = rowSelection;
      this.setState({ selectedRowKeys, selectedRows });
    }
  }

  onEnd = (e) => {
    const dom = e.target;
    dom.style.height = 'auto';
  }

  showTotal = (total, range) => {
    return <div style={{ color: '#969696' }}>{`显示 ${range[0]} - ${range[1]} 项 , 共 ${total} 项`}</div>;
  }

  fetchTableDataSource = (fetch, update = false) => {
    const { fetchDataSource, columns, serverSide } = this.props;
    const { filters, pagination, sorter } = this.state;
    let params = {};
    let urlPath = {};
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
        page: pagination.current,
        pagesize: pagination.pageSize,
        filters: {
          ...filterParam,
          ...searcherParam,
        },
      };
      if (sorter.field) {
        params.sort = `${sorter.field}-${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
      }
      urlPath = makerFilters(params);
    }
    if (!fetch) {
      if (!serverSide && update) {
        params.update = update;
      }
      fetchDataSource(urlPath, params);
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
      if (!sorter.field && column.defaultSortOrder) {
        sorter.field = key;
        sorter.order = column.sortOrder || column.defaultSortOrder;
      }
      response.sortOrder = sorter.field === key && sorter.order;
      if (column.searcher) {
        Object.assign(response, this.makeSearchFilterOption(key, column));
        response.render = response.render || this.makeDefaultSearchRender(key);
      } else if (column.treeFilters) {
        Object.assign(response, this.makeTreeFilterOption(key, column));
      } else if (column.filters) {
        response.onFilter = column.onFilter || this.makeDefaultOnFilter(key);
      } else if (column.dateFilters) {
        Object.assign(response, this.makeDateFilterOption(key, column));
      } else if (column.rangeFilters) {
        Object.assign(response, this.makeRangeFilterOption(key, column));
      }
      if (column.dataIndex !== undefined && !column.render) {
        const { tooltip } = column;
        const render = (text) => {
          let viewText = text;
          if (column.searcher) {
            viewText = this.makeDefaultSearchRender(key)(text);
          }
          return (
            <Ellipsis tooltip={tooltip || false} lines={1}>
              {viewText}
            </Ellipsis>
          );
        };
        response.render = render;
      }
      return response;
    });
  }

  makeSearchFilterOption = (key, column) => {
    const { filtered, filters, filterDropdownVisible } = this.state;
    const { serverSide } = this.props;
    const cls = classNames({
      [styles['table-filter-active']]: filtered.indexOf(key) !== -1,
    });
    const searchFilterOption = {
      filterIcon: <Icon type="search" className={cls} />,
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
    const cls = classNames({
      [styles['table-filter-active']]: filtered.indexOf(key) !== -1,
    });
    const dateFilterOption = {
      filterIcon: <Icon type="clock-circle-o" className={cls} />,
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

  makeRangeFilterOption = (key, column) => {
    const { filterDropdownVisible, filtered } = this.state;
    const { serverSide } = this.props;
    const cls = classNames({
      [styles['table-filter-active']]: filtered.indexOf(key) !== -1,
    });
    const rangeFilterOption = {
      filterIcon: <Icon type="filter" className={cls} />,
      filterDropdown: (
        <RangeFilter
          width={260}
          onSearchRange={this.handleRangeFilter(key)}
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
      rangeFilterOption.onFilter = this.makeDefaultOnRangeFilter(key);
    }
    return rangeFilterOption;
  }

  handleSearch = (key) => {
    return (value) => {
      const { pagination, filters, sorter, filtered } = this.state;
      const searchFilter = value ? [value] : [];
      const filteredState = filtered.filter(item => item !== key);
      if (value) {
        filteredState.push(key);
      }
      const newFilters = {
        ...filters,
        [key]: searchFilter,
      };
      this.setState({
        filterDropdownVisible: false,
        filtered: filteredState,
      }, () => {
        this.handleTableChange(pagination, newFilters, sorter);
      });
    };
  }

  handleTreeFilter = (key) => {
    return (checkedKeys) => {
      const { pagination, filters, sorter } = this.state;
      const newFilters = {
        ...filters,
        [key]: checkedKeys,
      };
      this.setState({
        filterDropdownVisible: false,
      }, () => {
        this.handleTableChange(pagination, newFilters, sorter);
      });
    };
  }

  handleDateFilter = (key) => {
    return (timeValue) => {
      const { pagination, filters, sorter, filtered } = this.state;
      const filteredState = filtered.filter(item => item !== key);
      if (timeValue.length > 0) {
        filteredState.push(key);
      }
      const newFilters = {
        ...filters,
        [key]: timeValue,
      };
      this.setState({
        filterDropdownVisible: false,
        filtered: filteredState,
      }, () => {
        this.handleTableChange(pagination, newFilters, sorter);
      });
    };
  }

  handleRangeFilter = (key) => {
    return (rangeValue) => {
      const { pagination, filters, sorter, filtered } = this.state;
      const filteredState = filtered.filter(item => item !== key);
      if (rangeValue.length > 0) {
        filteredState.push(key);
      }
      const newFilters = {
        ...filters,
        [key]: rangeValue,
      };
      this.setState({
        filterDropdownVisible: false,
        filtered: filteredState,
      }, () => {
        this.handleTableChange(pagination, newFilters, sorter);
      });
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, this.changeStateAndFetch);
    } else {
      this.changeStateAndFetch(pagination, filters, sorter);
    }
  }

  changeStateAndFetch = (pagination, filters, sorter) => {
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
    return (value) => {
      const { serverSide } = this.props;
      if (serverSide) return true;
      const valueInfo = eval(`arguments[1].${key}`);
      if (Array.isArray(valueInfo)) {
        const able = valueInfo.find(item => item.toString() === value);
        return able;
      }
      return `${valueInfo}` === `${value}`;
    };
  }

  makeDefaultOnRangeFilter = (key) => {
    return ({ min, max }) => {
      const valueInfo = eval(`arguments[1].${key}`);
      return min <= valueInfo && max >= valueInfo;
    };
  }


  makeDefaultOnSearch = (key) => {
    return (value) => {
      const valueInfo = eval(`arguments[1].${key}`);
      return `${valueInfo}`.match(new RegExp(value, 'gi'));
    };
  }

  makeDefaultSorter = (key) => {
    return () => {
      let a = eval(`arguments[0].${key}`);
      let b = eval(`arguments[1].${key}`);

      if (moment(a).isValid() && moment(b).isValid()) {
        a = moment(a).valueOf();
        b = moment(b).valueOf();
      }
      return parseFloat(a) - parseFloat(b);
    };
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

  resetFilter = (key) => {
    const { serverSide } = this.props;
    const { filters, searchers, filtered } = this.state;
    if (key && filters[key]) {
      delete filters[key];
    } else if (key && searchers[key]) {
      delete searchers[key];
    }
    let newFiltered = [];
    if (key) {
      newFiltered = filtered.filter(item => item !== key);
    }
    this.setState({
      filters: key ? filters : {},
      searchers: key ? searchers : {},
      filtered: newFiltered,
      // sorter: {},
    }, () => {
      if (serverSide) {
        this.fetchTableDataSource();
      }
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows }, () => {
      const { rowSelection } = this.props;
      if (rowSelection && rowSelection.onChange) {
        rowSelection.onChange(selectedRowKeys, selectedRows);
      }
    });
  }

  clearSelectedRows = () => {
    this.handleRowSelectChange([], []);
  }

  makeTableProps = () => {
    const { pagination, selectedRowKeys } = this.state;
    const {
      multiOperator,
      data,
      serverSide,
      total,
      rowSelection,
      loading,
    } = this.props;

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
      size: 'middle',
      bordered: false,
      scroll: {},
      pagination,
      ...this.props,
      onChange: this.handleTableChange,
      loading: loading || this.state.loading,
      rowSelection: newRowSelection,
      columns: this.mapColumns(),
    };

    if (this.props.pagination && typeof this.props.pagination === 'object') {
      response.pagination = {
        ...pagination,
        ...this.props.pagination,
      };
    }

    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  makeExcelFieldsData = (data) => {
    const { extraExportFields, columns, excelExport: { title } } = this.props;
    let exportFields = extraExportFields.concat(columns);
    exportFields = exportFields.filter(item => item.dataIndex !== undefined);
    const newData = [];
    data.forEach((item) => {
      let temp = {};
      const fieldsKey = Object.keys(item);
      Object.keys(exportFields).forEach((column) => {
        const columnValue = exportFields[column];
        let renderValue;
        if (columnValue.render) {
          renderValue = columnValue.render(item[columnValue.dataIndex], item);
        }
        if (fieldsKey.indexOf(columnValue.dataIndex) !== -1 && !columnValue.render) {
          temp[columnValue.dataIndex] = item[columnValue.dataIndex];
        } else if (columnValue.exportRender) {
          temp[columnValue.dataIndex] = columnValue.exportRender(item);
        } else if (
          fieldsKey.indexOf(columnValue.dataIndex) !== -1
          && columnValue.render
          && typeof renderValue === 'string'
        ) {
          temp[columnValue.dataIndex] = renderValue;
        }
      });
      temp = Object.values(temp);
      newData.push(temp);
    });
    const header = Object.keys(exportFields).map(key => exportFields[key].title);
    const datas = {
      sheetData: newData,
      sheetHeader: header,
    };
    let tableString = `${datas.sheetHeader.join(',')}\n`;
    datas.sheetData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        let str = item[key];
        if (typeof str === 'string') {
          str = str.replace(/,/ig, '，');
        }
        tableString += `${str}\t,`;
      });
      tableString += '\n';
    });

    const uri = `data:application/csv;charset=utf-8,\ufeff${encodeURIComponent(tableString)}`;
    const link = document.createElement('a');
    link.href = uri;
    link.download = `${title}.xls`;
    link.click();
    this.excelLoading(false);
  }

  excelLoading = (loading) => {
    this.setState({ loading });
  }

  handleExportExcel = () => {
    const { excelExport: { uri } } = this.props;
    const params = this.fetchTableDataSource(true);
    const body = { filters: params.filters };
    this.excelLoading('导出中...');
    request(`${uri}`, {
      method: 'GET',
      body,
    }).then((response) => {
      this.makeExcelFieldsData(response);
    });
  }


  handleBeforeUpload = (file) => {
    const isExcel = (file.type === 'application/vnd.ms-excel') || (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    if (!isExcel) {
      message.error('你只能上传excel格式的文件!');
    }
    return isExcel;
  }

  handleExcelTemplate = () => {
    const { excelTemplate } = this.props;
    location.href = excelTemplate;
  }


  makeExtraOperator = () => {
    const { extraOperator, excelInto, excelExport, excelTemplate } = this.props;
    const operator = extraOperator || [];
    if (excelInto) {
      operator.push(
        <Tooltip key="upload" title="导入数据">
          <TableUpload
            uri={excelInto}
            handleBeforeUpload={this.handleBeforeUpload}
          >
            EXCEL导入
          </TableUpload>
        </Tooltip>
      );
    }

    if (excelExport) {
      operator.push(
        <Tooltip key="download" title="导出数据">
          <Button icon="download" onClick={this.handleExportExcel}>EXCEL导出</Button>
        </Tooltip>
      );
    }

    if (excelTemplate) {
      operator.push(
        <Tooltip key="muban" title="模板">
          <Button icon="download" onClick={this.handleExcelTemplate}>下载EXCEL模板</Button>
        </Tooltip>
      );
    }
    return operator;
  }

  render() {
    const {
      multiOperator,
      tableVisible,
      extraOperatorRight,
      sync,
      columns,
      operatorVisble,
    } = this.props;
    const filterColumns = columns.map((item) => {
      const temp = { title: item.title, dataIndex: item.dataIndex };
      if (item.filters) {
        temp.filterData = item.filters;
      }
      if (item.treeFilters) {
        temp.filterData = item.treeFilters;
      }
      return temp;
    });
    return (
      <div
        className={styles.filterTable}
      >
        {operatorVisble && (
          <Operator
            {...this.state}
            sync={sync}
            key="Operator"
            filterColumns={filterColumns || []}
            multiOperator={multiOperator}
            extraOperator={this.makeExtraOperator()}
            extraOperatorRight={extraOperatorRight}
            fetchTableDataSource={() => {
              this.fetchTableDataSource(null, true);
            }}
            resetFilter={this.resetFilter}
          />
        )}
        {(tableVisible === true) && (
          <Table
            {...this.makeTableProps()}
            key="table"
          />
        )}
      </div>
    );
  }
}

OATable.EdiTableCell = EdiTableCell;
OATable.defaultProps = defaultProps;

export default OATable;

