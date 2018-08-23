import React, { Component } from 'react';
import {
  Icon,
} from 'antd';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import styles from '../index.less';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveCard(dragIndex, hoverIndex);
    const monitorItem = monitor.getItem();
    monitorItem.index = hoverIndex;
  },
};


const Types = {
  CARD: 'card',
};

@DropTarget(Types.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(Types.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  }

  render() {
    const {
      content,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return connectDropTarget(
      <div className={styles.rectangle} style={{ opacity }}>
        <div className={styles.header}>
          {
            connectDragSource(
              <div className={styles.dragIcon}>
                <Icon type="bars" />
              </div>
            )
          }
        </div>
        {content}
      </div>
    );
  }
}
