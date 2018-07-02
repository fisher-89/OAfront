import React from 'react';
import {
  Icon,
  Button,
  Tooltip,
} from 'antd';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CustomerCard from './Drag';
import './index.less';

export default (CustomerFrom) => {
  @DragDropContext(HTML5Backend)
  class newFrom extends React.PureComponent {
    constructor(props) {
      super(props);
      this.uuid = 0;
      let { initialValue } = props;
      if (initialValue.length > 0) {
        initialValue = initialValue.map((item, index) => {
          return {
            ...item,
            key: index + 1,
          };
        });
        this.uuid = initialValue.length;
      }
      this.state = {
        dataSource: initialValue || [],
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
          this.setState({ dataSource: nextProps.initialValue });
        }
      }
    }

    remove = (key) => {
      const { dataSource } = this.state;
      const newDataSource = dataSource.filter(item => item.key !== key);
      this.setState({ dataSource: [...newDataSource] });
    }

    add = () => {
      const { dataSource } = this.state;
      this.uuid += 1;
      dataSource.push({ key: this.uuid });
      this.setState({ dataSource: [...dataSource] });
    }

    makeRmoveIcon = (k) => {
      return (
        <Tooltip title="删除">
          <Icon
            className="dynamic-delete-button"
            type="close"
            onClick={() => this.remove(k)}
          />
        </Tooltip>
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
      const newDataSource = newState.dataSource.map((item, order) => {
        return {
          ...item,
          sorter: order,
        };
      });
      this.setState({ dataSource: newDataSource });
    }

    makeNewCustomerFroms = () => {
      const { sorter, name } = this.props;
      const newList = this.state.dataSource.map((item, i) => {
        const key = `${item.key}`;
        const newName = `${name}[${i}]`;
        const content = (
          <div
            key={key}
            style={{
              flexGrow: 1,
              display: 'flex',
              ...(!sorter ? {
                borderBottom: '1px solid #ccc',
                marginTop: '8px',
                paddingBottom: '8px',
              } : null),
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <CustomerFrom
                {...this.props}
                value={item}
                name={newName}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '10px',
            }}
            >
              {this.makeRmoveIcon(item.key)}
            </div>
          </div>
        );
        const result = sorter ? (
          <CustomerCard
            key={key}
            index={i}
            id={key}
            content={content}
            moveCard={this.moveCard}
          />
        ) : content;
        return result;
      });
      return newList;
    }

    render() {
      return (
        <React.Fragment>
          {this.makeNewCustomerFroms()}
          <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加
            </Button>
          </div>
        </React.Fragment>
      );
    }
  }

  newFrom.defaultProps = {
    name: 'keys',
    sorter: false,
    initialValue: [],
  };
  return newFrom;
};
