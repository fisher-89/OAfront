import React, { Component } from 'react';
import Control from './control';
import styles from '../mobile_template.less';
import { makeTagarray } from '../util';


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: props.gridfields ? makeTagarray(props.gridfields.fields) :
        makeTagarray(props.fields, props.grids),
      childselectedBg: null,
      selectedBg: null,
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
    const { bind } = this.props;
    if (bind) {
      bind(this.board);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { gridfields, fields, grids } = nextProps;
    if (!gridfields) {
      this.setState({
        formdata: makeTagarray(fields, grids),
      });
    } else {
      this.setState({
        formdata: makeTagarray(gridfields.fields),
      });
    }
  }

  handleSetbgLine = (griddata = null, index) => {
    if (griddata) {
      this.setState({
        childselectedBg: index,
      });
    } else {
      this.setState({
        selectedBg: index,
      });
    }
  }

  makeControls = () => {
    const { onDrag,
      onCancel,
      onMove,
      EleIndex, EleMovey,
      EleCurrenIndex,
      onSelected,
      dataindex,
      currentDirection } = this.props;
    const { formdata, selectedBg } = this.state;
    return [...formdata.map((item, index) => {
      return (
        <Control
          id="boardtag"
          key={String(index)}
          onDrag={onDrag}
          onCancel={onCancel}
          handleSetbgLine={this.handleSetbgLine}
          selected={selectedBg}
          index={index}
          data={item}
          dataindex={dataindex}
          board={this.board}
          onMove={onMove}
          EleIndex={EleIndex}
          EleMovey={EleMovey}
          EleCurrenIndex={EleCurrenIndex}
          currentDirection={currentDirection}
          onSelected={onSelected}
        />
      );
    })];
  }

  makechildControls = () => {
    const { gridfields, onDrag, onCancel,
      makeMask, EleIndex,
      EleMovey, EleCurrenIndex,
      dataindex,
      currentDirection,
    } = this.props;
    const { formdata, childselectedBg } = this.state;
    return [...formdata.map((item, index) => {
      return (
        <Control
          id={`boardchildtag${gridfields.key}`}
          griddata={gridfields}
          key={String(index)}
          child="child"
          itemDrop={this.handleDropitem}
          formdata={formdata}
          makeMask={makeMask}
          onDrag={onDrag}
          onCancel={onCancel}
          handleSetbgLine={this.handleSetbgLine}
          selected={childselectedBg}
          index={index}
          data={item}
          board={this.board}
          dataindex={dataindex}
          EleIndex={EleIndex}
          EleMovey={EleMovey}
          EleCurrenIndex={EleCurrenIndex}
          currentDirection={currentDirection}
        />
      );
    })];
  }

  render() {
    const { gridfields, id } = this.props;
    return (
      <div id={id || null} className={styles.board}>
        <div
          className={styles.scroller}
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          <div className={styles.controls}>
            {!gridfields && this.makeControls()}
            {gridfields && this.makechildControls()}
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
