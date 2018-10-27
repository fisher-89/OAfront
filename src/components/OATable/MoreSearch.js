import React from 'react';
import { Input, Button, Popover, Form, Select, Row, Col, Slider } from 'antd';
import { mapValues, isArray, isObject, isString, isNumber, map, has } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default class MoreSearch extends React.Component {
  state = {
    filters: {},
    visible: false,
    colCountKey: 1,
  }

  componentWillMount() {
    this.colCounts = {};
    [1, 2, 3].forEach((value, i) => { this.colCounts[i] = value; });
  }

  componentWillReceiveProps(nextProps) {
    const { filterDropdownVisible } = nextProps;
    if ('filterDropdownVisible' in nextProps && filterDropdownVisible) {
      this.setState({ visible: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
      (JSON.stringify(nextProps.filters) !== JSON.stringify(this.props.filters)) ||
      (JSON.stringify(nextProps.filterDropdownVisible)
        !== JSON.stringify(this.props.filterDropdownVisible))
    ) {
      return true;
    }
    return false;
  }

  onChange = () => {
    const { onChange } = this.props;
    const { filters } = this.state;
    this.setState({ visible: false }, onChange(filters));
  }

  onColCountChange = (colCountKey) => {
    this.setState({ colCountKey });
  }

  handleVisible = () => {
    const { visible, filters } = this.state;
    const state = { visible: !visible };
    if (!visible === true && JSON.stringify(filters) !== JSON.stringify(this.props.filters)) {
      state.filters = { ...this.props.filters };
    }
    this.setState(state);
  }

  handleSearchChange = (key) => {
    return (e) => {
      const value = e.target ? e.target.value : e;
      const { filters } = this.state;
      this.setState({
        filters: {
          ...filters,
          ...(!key ? e : { [key]: isString(value) ? [value] : value }),
        },
      });
    };
  }

  resetSearch = () => {
    const { filters } = this.state;
    const newFilters = mapValues(filters, (value) => {
      if (isArray(value)) return [];
      if (isObject(value)) return {};
      if (isString(value) || isNumber(value)) return undefined;
      return undefined;
    });
    this.setState({ filters: newFilters }, this.onChange);
  }

  makeFormItemProps = (props) => {
    return {
      ...formItemLayout,
      label: props.title,
      key: props.dataIndex,
    };
  }

  makeSearchProps = (props) => {
    const { filters } = this.state;
    return {
      style: { width: '100%' },
      value: filters[props.dataIndex],
      placeholder: `请输入${props.title}`,
      onChange: this.handleSearchChange(props.dataIndex),
    };
  }

  makeSearcherFilter = (item) => {
    return (
      <FormItem {...this.makeFormItemProps(item)}>
        <Input {...this.makeSearchProps(item)} />
      </FormItem>
    );
  }

  makeDefaultFilters = (item) => {
    return (
      <FormItem {...this.makeFormItemProps(item)}>
        <Select {...this.makeSearchProps(item)} mode="multiple">
          {map(item.filters, filter => (<Option key={`${filter.value}`}>{filter.text}</Option>))}
        </Select>
      </FormItem>
    );
  }

  makeColumnsSearch = (moreSearch) => {
    return moreSearch.map((item) => {
      if (item.searcher) {
        return this.makeSearcherFilter(item);
      } else if (item.filters) {
        return this.makeDefaultFilters(item);
      }
      return null;
    }).filter(item => item);
  }


  renderMoreSearch = () => {
    const { moreSearch } = this.props;
    const { filters, colCountKey } = this.state;
    const colCount = this.colCounts[colCountKey];
    const span = 24 / colCount;
    let searchComponent = moreSearch;
    if (React.isValidElement(moreSearch)) {
      searchComponent = React.cloneElement(moreSearch, {
        initialValue: filters,
        onChange: this.handleSearchChange,
      });
    } else if (isArray(moreSearch)) {
      searchComponent = this.makeColumnsSearch(moreSearch);
    } else if (isObject(moreSearch)) {
      const { content, columns } = moreSearch;
      searchComponent = [];
      if (isArray(content)) {
        searchComponent = this.makeColumnsSearch(content);
      } else if (React.isValidElement(content)) {
        const element = React.cloneElement(content, {
          colSpan: span,
          key: 'content',
          initialValue: filters,
          onChange: this.handleSearchChange,
        });
        searchComponent.push({
          col: false,
          component: element,
        });
      } else {
        searchComponent.push({
          col: false,
          component: content,
        });
      }
      searchComponent = searchComponent.concat(this.makeColumnsSearch(columns));
    }

    return (
      <div style={{ maxWidth: colCountKey === 2 ? 800 : 600 }}>
        <div style={{ width: '400px', margin: '0 auto' }}>
          <FormItem label="排版" {...formItemLayout}>
            <Slider
              min={0}
              step={null}
              value={colCountKey}
              marks={this.colCounts}
              onChange={this.onColCountChange}
              max={Object.keys(this.colCounts).length - 1}
            />
          </FormItem>
        </div>
        {
          isArray(searchComponent) ? (
            <Row gutter={8}>
              {
                map(searchComponent, (component, index) => {
                  const key = index;
                  return !has(component, 'component') ? (
                    <Col key={key} span={span}>{component}</Col>
                  ) : component.component;
                })
              }
            </Row>
          ) : searchComponent
        }
        <div className="ant-table-filter-dropdown-btns">
          <a className="ant-table-filter-dropdown-link clear" onClick={this.resetSearch}>重置</a>
          <a className="ant-table-filter-dropdown-link confirm" onClick={this.onChange}>确定</a>
        </div>
      </div>
    );
  }

  render() {
    const { visible } = this.state;
    return (
      <Popover
        trigger="click"
        visible={visible}
        placement="bottom"
        content={this.renderMoreSearch()}
      >
        <Button icon="filter" onClick={this.handleVisible}>更多筛选</Button>
      </Popover>
    );
  }
}
MoreSearch.defaultProps = {
  filters: {},
  onChange: () => { },
};
