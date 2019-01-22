import React, { Component } from 'react';
import { Row, Tabs } from 'antd';
import styles from './mobile_template.less';
import Board from './board/index';
import FieldTag from './field_tag';
import GridTag from './grid_tag';
import FieldTagShadow from './dragging_field_tag';
import Mask from './board/mask';
import { handleSort, setFilds, handleChildsort, makeTagarray } from './util';

const { TabPane } = Tabs;
class MobileTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGrid: null,
      dataIndex: null,
      parentGridIndex: null,
      startPoint: { x: null, y: null },
      tagPosition: { top: 0, left: 0 },
      onDragging: false,
      maxLIne: 0,
      offset: null,
      masktag: 0,
      EleIndex: null,
      EleMovey: null,
      controSelf: null,
      dataindex: null,
      EleCurrenIndex: null,
      currentDirection: null,
      ElechildIndex: null,
      ElechildMovey: null,
      ElechildCurrenIndex: null,
      childDirection: null,
      childdataindex: null,
      formData: [],
      activeKeyoption: { },
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    const changeSelectedGrid = nextState.selectedGrid !== this.state.selectedGrid;
    const changeList = (nextProps.grids !== this.props.grids)
      || (nextProps.fields !== this.props.fields);
    const changeDragging = nextState.onDragging !== this.state.onDragging;
    if (nextState.EleIndex !== null) return true;
    if (nextState.ElechildIndex !== null) return true;
    if (changeSelectedGrid || changeList || changeDragging) return true;
    if (nextState.activeKeyoption.activeKey !== this.state.activeKeyoption.activeKey) return true;
    return false;
  }

  toggleGridField = (key) => {
    const { selectedGrid } = this.state;
    this.setState({
      selectedGrid: selectedGrid === key ? null : key,
    });
  }

  handleDragStart = (data, startPoint, tagPosition, grid = null, extraparams = {}) => {
    // offset = null,controSelf
    const { fields, grids } = this.props;
    let index = 'fields' in data ? grids.indexOf(data) : fields.indexOf(data);
    const gridIndex = grid ? grids.indexOf(grid) : null;
    if (grid) index = grid.fields.indexOf(data);
    const formdata = gridIndex === null ? makeTagarray(fields, grids) :
      makeTagarray(grids[gridIndex].fields);
    const option = gridIndex === null ? {} : { activeKey: grids[gridIndex].key };
    this.setState({
      dataIndex: index,
      onDragging: data,
      parentGridIndex: gridIndex,
      startPoint,
      tagPosition,
      offset: extraparams.offset,
      controSelf: extraparams.controSelf,
      formData: formdata,
      masktag: grid ? 2 : 1,
      activeKeyoption: option,
    });
  }

  handleDragCancel = (data, x = null, y = null) => {
    if (!(x === 0 && y === 0)) {
      const { fields, grids, form } = this.props;
      const { dataIndex, parentGridIndex } = this.state;
      if ('fields' in data) {
        const gridFields = data.fields;
        for (let item = 0; item < gridFields.length; item += 1) {
          gridFields[item].mobile_x = null;
          gridFields[item].mobile_y = null;
        }
        form.setFieldsValue({
          [`grids.${dataIndex}.mobile_y`]: null,
          [`grids.${dataIndex}.fields`]: gridFields,
        });
      } else if (parentGridIndex !== null) {
        const gridFields = grids[parentGridIndex].fields;
        gridFields[dataIndex].mobile_x = null;
        gridFields[dataIndex].mobile_y = null;
        form.setFieldsValue({
          [`grids.${parentGridIndex}.fields`]: gridFields,
        });
      } else {
        fields[dataIndex].mobile_x = null;
        fields[dataIndex].mobile_y = null;
        form.setFieldsValue({ fields });
      }
    }
    this.setState({
      EleIndex: null,
      EleMovey: null,
      onDragging: false,
      dataindex: null,
      EleCurrenIndex: null,
      parentGridIndex: null,
      ElechildIndex: null,
      ElechildMovey: null,
      ElechildCurrenIndex: null,
      childdataindex: null,
      masktag: 0,
    });
  }


  handleDragConfirm = (data) => {
    let { fields, grids } = this.props;
    console.log('this.props', this.props);
    const { form } = this.props;
    const { parentGridIndex } = this.state;
    this.state.onDragging = false;
    // let isCancle = false;
    // [...fields,...grids].filter(item=>typeof item.x==='number').sort(compare("y"))
    //   .map((item)=>{
    //     if(item.y<data.y && data.y<item.y+item.row &&item.key !== data.key){
    //       // this.handleDragCancel(data)
    //       isCancle = true;
    //       return item;
    //     }})
    // if(isCancle && parentGridIndex === null){
    //   setFilds(fields,grids,form);
    //   this.state.parentGridIndex = null;
    //   return void 0;
    // }

    if (parentGridIndex !== null) {
      const results = handleChildsort(data, grids, parentGridIndex);
      grids = results.gridsData;
    } else {
      const results = handleSort(data, fields, grids);
      fields = results.fieldsData;
      grids = results.gridsData;
      this.state.maxLIne = results.MaxLine;
    }
    this.state.EleIndex = null;
    this.state.EleMovey = null;
    this.state.dataindex = null;
    this.state.parentGridIndex = null;
    this.state.EleCurrenIndex = null;
    this.state.ElechildIndex = null;
    this.state.ElechildMovey = null;
    this.state.childdataindex = null;
    this.state.ElechildCurrenIndex = null;
    this.state.masktag = 0;
    setFilds(fields, grids, form);
  }

  makeFieldOptions = () => {
    const { fields } = this.props;
    return fields.map((field) => {
      return (<FieldTag key={field.id} data={field} onDrag={this.handleDragStart} />);
    });
  }

  handleElemove = (index, ymove, currentDirection, currentIndex = null, dataindex = null) => {
    this.setState({
      EleIndex: index, // tag.index
      EleMovey: ymove, // tag.move
      EleCurrenIndex: currentIndex, //
      currentDirection,
      dataindex, // data.index
    });
  }

  handleElechildMove = (index, ymove, currentDirection, currentIndex = null, dataindex = null) => {
    this.setState({
      ElechildIndex: index, // tag.index
      ElechildMovey: ymove, // tag.move
      ElechildCurrenIndex: currentIndex, //
      childDirection: currentDirection,
      childdataindex: dataindex, // data.index
    });
  }


  handleSelect =(data) => {
    this.setState({
      activeKeyoption: { activeKey: data.key || data },
    });
  }

  makeGridOptions = () => {
    const { grids } = this.props;
    const { selectedGrid } = this.state;
    return grids.map((grid) => {
      const { key } = grid;
      const selected = selectedGrid === key;
      return (
        <GridTag
          key={key}
          data={grid}
          selected={selected}
          onDrag={this.handleDragStart}
          toggleGridField={this.toggleGridField}
          makeMask={this.makeMask}
        />
      );
    });
  }
  makeChildtemplate = () => {
    const { fields, grids, form, formname } = this.props;
    const { parentGridIndex,
      maxLIne,
      masktag,
      ElechildIndex,
      ElechildMovey,
      ElechildCurrenIndex,
      childDirection,
      childdataindex,
      activeKeyoption } = this.state;
    // const option = parentGridIndex===null?{}:{activeKey:grids[parentGridIndex].key};
    return (
      <Tabs
        className={styles.childtemplatetabs}
        tabPosition="left"
        tabBarGutter={4}
        {...activeKeyoption}
        onTabClick={this.handleSelect}
      >
        {grids.filter(item => item.mobile_y !== null).map((item) => {
                  return (
                    <TabPane tab={item.name} key={item.key}>
                      <div className={styles.template}>
                        <div className={styles.boardHeader}>
                          <h3>{formname}</h3>
                        </div>
                        <Mask masktag={masktag === 2 ? 0 : masktag} />
                        <Board
                          id={`boardChild${item.key}`}
                          gridfields={item}
                          grids={grids}
                          fields={fields}
                          form={form}
                          makeMask={this.makeMask}
                          parentGrid={parentGridIndex}
                          line={maxLIne}
                          onDrag={this.handleDragStart}
                          onCancel={this.handleDragCancel}
                          onMove={this.handleElemove}
                          EleIndex={ElechildIndex}
                          EleMovey={ElechildMovey}
                          EleCurrenIndex={ElechildCurrenIndex}
                          currentDirection={childDirection}
                          dataindex={childdataindex}
                        />
                      </div>
                    </TabPane>
);
                })}
      </Tabs>
    );
  }


  render() {
    const { fields, grids, form, formname } = this.props;
    const { startPoint,
      tagPosition,
      masktag,
      offset,
      onDragging,
      parentGridIndex,
      maxLIne,
      EleIndex,
      EleMovey,
      EleCurrenIndex,
      formData,
      controSelf,
      dataindex,
      currentDirection } = this.state;
    return (
      <Row className={styles.pcTemplate}>
        <div className={styles.component}>
          <h3>字段</h3>
          <div className={styles.fields}>
            {this.makeFieldOptions()}
          </div>
          {grids.length > 0 && (<h3>列表控件</h3>)}
          <div className={styles.grids}>
            {this.makeGridOptions()}
          </div>
        </div>
        <div>
          <div className={styles.templatecontainer}>
            <div className={styles.ftemplate}>
              <div className={styles.template}>
                <div className={styles.boardHeader}>
                  <h3>{formname}</h3>
                </div>
                <Mask masktag={masktag === 1 ? 0 : masktag} parentGridIndex={parentGridIndex} />
                <Board
                  id="board"
                  grids={grids}
                  fields={fields}
                  form={form}
                  bind={(board) => {
                    this.board = board;
                  }}
                  dataindex={dataindex}
                  line={maxLIne}
                  makeMask={this.makeMask}
                  onDrag={this.handleDragStart}
                  onCancel={this.handleDragCancel}
                  onMove={this.handleElemove}
                  EleIndex={EleIndex}
                  EleMovey={EleMovey}
                  EleCurrenIndex={EleCurrenIndex}
                  currentDirection={currentDirection}
                  onSelected={this.handleSelect}
                />
              </div>
            </div>
            {/* <div className={styles.childtemplate}>
              {this.makeChildtemplate()}
            </div> */}
            {(() => {
                if (grids.filter(item => item.mobile_y !== null).length) {
                  return (
                    <div className={styles.childtemplate}>
                      {this.makeChildtemplate()}
                    </div>
);
                }
            })()}
          </div>
        </div>
        {onDragging && (
          <FieldTagShadow
            data={onDragging}
            style={{ ...tagPosition }}
            startPoint={startPoint}
            controSelf={controSelf}
            dataindex={dataindex}
            offset={offset}
            formdata={formData}
            onCancel={this.handleDragCancel}
            onConfirm={this.handleDragConfirm}
            board={this.board}
            parentGrid={parentGridIndex}
            grids={grids}
            onMove={this.handleElemove}
            onChildMove={this.handleElechildMove}
          />
        )}
      </Row>
    );
  }
}

export default MobileTemplate;
