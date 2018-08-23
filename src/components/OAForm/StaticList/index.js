import React from 'react';
import {
  Icon,
  Button,
  Tooltip,
} from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import ItemView from './itemView';
import CustomerCard from '../FormList/Drag';
/**
 * 列表控件 弹窗形式
 * config:{
    sorter: false,   是否排序 默认否
    initialValue: [],  默认值
    onChange: () => { }, 表单change对象
 * }
 */

@DragDropContext(HTML5Backend)
export default class List extends React.Component {
  constructor(props) {
    super(props);
    let { initialValue } = props;
    this.newIndex = 0;
    initialValue = this.dotDataSource(initialValue);
    this.state = {
      dataSource: initialValue || [],
      dataInfo: {},
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.state;
    if (nextProps.initialValue.length !== 0) {
      if (
        JSON.stringify(nextProps.initialValue)
        !==
        JSON.stringify(this.props.initialValue)
        && (dataSource.length === 0)
      ) {
        this.setState({ dataSource: this.dotDataSource(nextProps.initialValue) });
      }
    }
  }

  dotDataSource = (initialValue) => {
    const newValue = initialValue.map((item, index) => {
      return {
        ...item,
        onlyId: index + 1,
      };
    });
    this.newIndex = initialValue.length;
    return newValue;
  }


  handleEditItem = (id) => {
    const { dataSource } = this.state;
    const [dataInfo] = dataSource.filter(item => item.onlyId === id);
    this.setState({
      dataInfo,
    }, () => this.handleVisible(true));
  }

  handleOk = (params) => {
    const { dataSource } = this.state;
    if (Object.keys(params).length === 0) {
      this.handleVisible(false);
      return;
    }
    const dataInfo = { ...params };
    let newDataSource = [...dataSource];
    if (dataInfo.onlyId) {
      newDataSource = dataSource.map((item) => {
        let newItem = item;
        if (newItem.onlyId === dataInfo.onlyId) {
          newItem = dataInfo;
        }
        return newItem;
      });
    } else {
      this.newIndex += 1;
      dataInfo.onlyId = this.newIndex;
      newDataSource.push(dataInfo);
    }
    this.setState({
      visible: false,
      dataSource: [...newDataSource],
    }, () => {
      const value = [...this.state.dataSource].map((item) => {
        const temp = { ...item };
        delete temp.onlyId;
        return temp;
      });
      this.props.onChange(value);
    });
  }

  handleRemove = (id) => {
    const { dataSource } = this.state;
    const newDataSource = dataSource.filter(item => item.onlyId !== id);
    this.setState({
      dataSource: [...newDataSource],
    }, () => {
      this.handleVisible(false);
      this.props.onChange(this.state.dataSource);
    });
  }

  handleVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeButtom = (id) => {
    return [
      <Tooltip key="delete" title="删除" placement="right">
        <Icon
          className="dynamic-delete-button"
          type="close"
          onClick={() => this.handleRemove(id)}
        />
      </Tooltip>,
      <Tooltip key="edit" title="编辑" placement="right">
        <a>
          <Icon
            type="form"
            onClick={() => this.handleEditItem(id)}
          />
        </a>
      </Tooltip>,
    ];
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { dataSource } = this.state;
    const dragList = dataSource[dragIndex];
    const newState = update(this.state, {
      dataSource: {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragList]],
      },
    });
    const newDataSource = newState.dataSource.map((item, i) => {
      return {
        ...item,
        sorter: i,
      };
    });
    this.setState({ dataSource: newDataSource }, () => {
      this.props.onChange(this.state.dataSource);
    });
  }

  makeListContent = () => {
    const { dataSource } = this.state;
    const {
      sorter,
      // listItemContent,
      // error,
    } = this.props;
    const list = dataSource.map((value, i) => {
      // const errorObj = typeof error[i] === 'object' ? error[i] : {};
      // const form = listItemContent(value, errorObj);
      // const key = i;
      const content = <ItemView />;
      const result = sorter ? (
        <CustomerCard
          key={value.onlyId}
          index={i}
          id={value.onlyId}
          content={content}
          moveCard={this.moveCard}
        />
      ) : content;
      return result;
    });
    return list;
  }

  makeModalComponet = () => {
    const { title, width, zIndex, bodyStyle, height, error } = this.props;
    const { visible, dataInfo, dataSource } = this.state;
    const response = {
      error,
      dataSource,
      initialValue: dataInfo,
      config: {
        width,
        zIndex,
        visible,
        onOk: this.handleOk,
        destroyOnClose: true,
        title: title || '表单',
        bodyStyle: { ...bodyStyle, height },
        onCancel: () => this.handleVisible(false),
        afterClose: () => this.setState({ dataInfo: {} }),
      },
    };
    return response;
  }


  render() {
    const { Component } = this.props;
    return (
      <React.Fragment>
        {this.makeListContent()}
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
          <Button
            type="dashed"
            onClick={() => {
              const dataInfo = {};
              this.setState({ dataInfo }, () => this.handleVisible(true));
            }}
            style={{ width: '60%' }}
          >
            <Icon type="plus" /> 添加
          </Button>
        </div>
        <Component {...this.makeModalComponet()} />
      </React.Fragment>
    );
  }
}
List.defaultProps = {
  sorter: false,
  initialValue: [],
  onChange: () => { },
  width: 520,
  zIndex: 1000,
  bodyStyle: { overflow: 'auto' },
  error: {},
};
