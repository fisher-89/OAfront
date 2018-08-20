import React, { PureComponent } from 'react';
import { Table, Input, Icon, message, Button, Tooltip, Spin } from 'antd';
import QueueAnim from 'rc-queue-anim';

import { makerFilters } from '../../utils/utils';

import TreeFilter from './treeFilter';
import DateFilter from './dateFilter';
import RangeFilter from './rangeFilter';

import Operator from './operator';
import TableUpload from './upload';

import EdiTableCell from './editTableCell';
import EditableCell from './editableRow';

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
  tableVisible: true,
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
    this.enterAnim = [
      {
        opacity: 0, x: 30, backgroundColor: '#fffeee', duration: 0,
      },
      {
        height: 0,
        duration: 200,
        type: 'from',
        delay: 250,
        ease: 'easeOutQuad',
        onComplete: this.onEnd,
      },
      {
        opacity: 1, x: 0, duration: 250, ease: 'easeOutQuad',
      },
      { delay: 1000, backgroundColor: '#fff' },
    ];
    this.leaveAnim = [
      { duration: 250, opacity: 0 },
      { height: 0, duration: 200, ease: 'easeOutQuad' },
    ];
    this.currentPage = 1;
  }

  componentDidMount() {
    const { data, serverSide } = this.props;
    if (!data || data.length === 0 || serverSide) {
      this.fetchTableDataSource();
    }
  }

  onEnd = (e) => {
    const dom = e.target;
    dom.style.height = 'auto';
  }

  // getBodyWrapper = (body) => {
  //   // const { pagination } = this.state;
  //   // // 切换分页去除动画;
  //   // if (this.currentPage !== pagination.current) {
  //   //   this.currentPage = pagination.current;
  //   //   return body;
  //   // }
  //   return (
  //     <QueueAnim
  //       component="tbody"
  //       // type={['right', 'left']}
  //       // leaveReverse
  //       className={body.className}
  //     // enter={this.enterAnim}
  //     // leave={this.leaveAnim}
  //     // appear={false}
  //     >
  //       {body.children}
  //     </QueueAnim>
  //   );
  // }


  showTotal = (total, range) => {
    // const { filtered } = this.props;
    return <div style={{ color: '#969696' }}>{`显示 ${range[0]} - ${range[1]} 项 , 共 ${total} 项`}</div>;
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
      params = makerFilters(params);
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
      } else if (column.rangeFilters) {
        Object.assign(response, this.makeRangeFilterOption(key, column));
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

  makeRangeFilterOption = (key, column) => {
    const { filterDropdownVisible, filtered } = this.state;

    const { serverSide } = this.props;
    const rangeFilterOption = {
      filterIcon: <Icon type="filter" style={{ color: filtered.indexOf(key) !== -1 ? '#108ee9' : '' }} />,
      filterDropdown: (
        <RangeFilter
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

  handleRangeFilter = (key) => {
    return (rangeValue) => {
      const { filters, filtered } = this.state;
      const { serverSide } = this.props;
      const filteredState = filtered.filter(item => item !== key);
      if (rangeValue.length > 0) {
        filteredState.push(key);
      }
      this.setState({
        filters: {
          ...filters,
          [key]: rangeValue,
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
    return (value, record) => {
      if (Array.isArray(record[key])) {
        const able = record[key].find(item => item.toString() === value);
        return able;
      }
      return `${record[key]}` === `${value}`;
    };
  }

  makeDefaultOnRangeFilter = (key) => {
    return ({ min, max }, record) => min <= record[key] && max >= record[key];
  }


  makeDefaultOnSearch = (key) => {
    return (value, record) => {
      return `${record[key]}`.match(new RegExp(value, 'gi'));
    };
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
      onChange: this.handleTableChange,
      size: 'middle',
      bordered: false,
      // scroll: { x: true },
      pagination: {
        ...pagination,
        ...this.props.pagination,
      },
      ...this.props,
      rowSelection: newRowSelection,
      columns: this.mapColumns(),
    };
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
    // this.excelLoading('下载中...');
    // const a = document.createElement('a');
    location.href = excelTemplate;
    // a.target = '_blank';
    // a.click();
    // request(`${excelTemplate}`, {
    //   method: 'GET',
    // }).then((res) => {
    //   res.blob().then((blob) => {
    //     this.excelLoading(false);
    //     const url = window.URL.createObjectURL(blob);
    //     let filename = res.headers.get('Content-Disposition');
    //     filename = decodeURI(filename);
    //     filename = filename.match(/filename="(.+)"/);
    //     [, filename] = filename;
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename;
    //     a.click();
    //   });
    // });
  }

  // handleUploadOnchange = (e) => {
  //   const { files } = e.target;
  //   if (!this.handleBeforeUpload(files[0])) return;
  //   const fileReader = new FileReader();
  //   fileReader.onload = (ev) => {
  //     const data = ev.target.result;
  //     let persons = [];
  //     const workbook = XLSX.read(data, {
  //       type: 'binary',
  //     });
  //     Object.keys(workbook.Sheets).forEach((sheet) => {
  //       const fromTo = workbook.Sheets[sheet]['!ref'];
  //       if (fromTo) {
  //         persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
  //       }
  //     });
  //     if (!persons.length) {
  //       message.error('不能上传空的excel文件!');
  //     } else {
  //       // const header = Object.values(persons[0]);
  //       // persons = persons.filter((item, index) => index !== 0);
  //       // persons = persons.map((item) => {
  //       //   const temp = {};
  //       //   const value = Object.values(item);
  //       //   header.forEach((key, index) => {
  //       //     if (value[index]) {
  //       //       temp[key] = value[index];
  //       //     }
  //       //   });
  //       //   return temp;
  //       // });
  //       const { excelInto } = this.props;
  //       this.excelLoading('导入中...');
  //       request(`${excelInto}`, {
  //         method: 'POST',
  //         body: persons,
  //       }).then((response) => {
  //         this.excelLoading(false);
  //       });
  //     }
  //   };
  //   fileReader.readAsBinaryString(files[0]);
  // }

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
    const { multiOperator, tableVisible, extraOperatorRight, sync } = this.props;
    const { loading } = this.state;
    return (
      <Spin spinning={loading !== false} tip={`${loading}`}>
        <div className={styles.filterTable}>
          <QueueAnim type={['right', 'left']} >
            <Operator
              {...this.state}
              sync={sync}
              key="Operator"
              multiOperator={multiOperator}
              extraOperator={this.makeExtraOperator()}
              extraOperatorRight={extraOperatorRight}
              fetchTableDataSource={this.fetchTableDataSource}
              resetFilter={this.resetFilter}
              clearSelectedRows={this.clearSelectedRows}
            />
            {(tableVisible === true) && (
              <Table
                {...this.makeTableProps()}
                key="table"
              // components={{
              //   body: {
              //     wrapper: this.getBodyWrapper,
              //   },
              // }}
              />
            )}
          </QueueAnim>
        </div>
      </Spin>
    );
  }
}

OATable.EdiTableCell = EdiTableCell;
OATable.EditableCell = EditableCell;
OATable.defaultProps = defaultProps;

export default OATable;

