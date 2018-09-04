import React from 'react';
import {
  Icon,
  Button,
} from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import ItemView from './itemView';
import CustomerCard from '../FormList/Drag';
import styles from '../FormList/index.less';
/**
 * 列表控件 弹窗形式
 * config:{
    sorter: false,   是否排序 默认否
    value: [],  默认值
    onChange: () => { }, 表单change对象
 * }
 */

@DragDropContext(HTML5Backend)
export default class List extends React.Component {
  constructor(props) {
    super(props);
    let { value } = props;
    this.newIndex = 0;
    value = this.dotDataSource(value);
    this.state = {
      dataSource: value || [],
      dataInfo: {},
      error: {},
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.state;
    if (nextProps.value.length !== 0) {
      if (
        JSON.stringify(nextProps.value)
        !==
        JSON.stringify(this.props.value)
        && (dataSource.length === 0)
      ) {
        this.setState({ dataSource: this.dotDataSource(nextProps.value) });
      }
    }
  }

  dotDataSource = (value) => {
    const newValue = value.map((item, index) => {
      return {
        ...item,
        onlyId: index + 1,
      };
    });
    this.newIndex = value.length;
    return newValue;
  }


  handleEditItem = (id) => {
    const { dataSource } = this.state;
    const { error } = this.props;
    let errorInfo = {};
    const dataInfo = dataSource.find((item, index) => {
      if (item.onlyId === id) errorInfo = error[index] || {};
      return item.onlyId === id;
    });
    this.setState({
      dataInfo,
      error: { ...errorInfo },
    }, () => this.handleVisible(true));
  }

  handleOk = (params, labelText) => {
    const { dataSource } = this.state;
    this.labelText = labelText;
    if (Object.keys(params).length === 0) {
      this.handleVisible(false);
      return;
    }
    let dataIndex;
    const dataInfo = { ...params };
    let newDataSource = [...dataSource];
    if (dataInfo.onlyId) {
      newDataSource = dataSource.map((item, index) => {
        const newItem = item;
        if (newItem.onlyId === dataInfo.onlyId) {
          dataIndex = index;
          return dataInfo;
        }
        return newItem;
      });
    } else {
      this.newIndex += 1;
      dataInfo.onlyId = this.newIndex;
      newDataSource.push(dataInfo);
      dataIndex = newDataSource.length - 1;
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
      this.props.onChange(value, dataIndex);
    });
  }

  handleRemove = (id) => {
    const { dataSource } = this.state;
    const newDataSource = dataSource.filter((item) => {
      return item.onlyId !== id;
    });
    this.setState({
      dataSource: [...newDataSource],
    }, () => {
      this.handleVisible(false);
      this.props.onChange(this.state.dataSource, 'all');
    });
  }

  handleVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeButtom = (id) => {
    return (
      <div className={styles.action}>
        <Icon className={styles.defaultColor} type="form" onClick={() => this.handleEditItem(id)} />
        <br />
        <Icon className={styles.danger} type="delete" onClick={() => this.handleRemove(id)} />
      </div>
    );
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
      this.props.onChange(this.state.dataSource, 'all');
    });
  }

  makeListContent = () => {
    const { dataSource } = this.state;
    const {
      error,
      sorter,
      listItemContent,
    } = this.props;
    const list = dataSource.map((value, i) => {
      const errorObj = error[i] ? error[i] : {};
      const errorAble = Object.keys(errorObj).length;
      const data = listItemContent(value, errorObj);
      const content = <ItemView data={data || {}} />;
      const result = sorter ? (
        <CustomerCard
          key={value.onlyId}
          index={i}
          id={value.onlyId}
          content={content}
          errorAble={errorAble}
          actionBtn={() => this.makeButtom(value.onlyId)}
          moveCard={this.moveCard}
        />
      ) : content;
      return result;
    });
    return list;
  }

  makeModalComponet = () => {
    const { title, width, zIndex, bodyStyle, height } = this.props;
    const { visible, dataInfo, dataSource, error } = this.state;
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
        bodyStyle: {
          ...bodyStyle,
          maxHeight: height,
          overflowY: 'auto',
        },
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
  value: [],
  onChange: () => { },
  width: 520,
  zIndex: 1000,
  bodyStyle: { overflow: 'auto' },
  error: {},
};
