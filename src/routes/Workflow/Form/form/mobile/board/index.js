import React, { Component } from 'react';
import Control from './control';
import styles from '../mobile_template.less';
import {handleSort,handleChildsort,setFilds,makeTagarray} from "../util"


class Board extends Component {
  constructor(props){
    super(props);
    this.state = {
      formdata:[]
    }
  }
  componentWillReceiveProps(nextProps){
    const {gridfields,fields,grids} = nextProps;
    if(!gridfields){
      this.setState({
        formdata:makeTagarray(fields,grids)
      })
    }else{
      this.setState({
        formdata:makeTagarray(gridfields.fields)
      })
    }

  }
  componentWillMount(){
  }
  componentDidMount() {
    const { bind } = this.props;
    bind && bind(this.board);
  }
  handleAddLine = (row,griddata=null) => {
    let { fields, grids, form } = this.props;
    if(griddata===null){
      const results = handleSort(row,fields,grids);
      fields = results.fields;
      grids = results.grids;
      setFilds(fields,grids,form)
    }else{
      const results = handleChildsort(row,grids,griddata);
      grids = results.grids;
      setFilds(fields,grids,form)
    }
  }

  handleDeleteLine = (row,griddata=null) => {
    row = typeof row==='number' ?-row-1:((row.y=null) && row);
    let { fields, grids, form } = this.props;
    if(griddata===null){
      const results = handleSort(row,fields,grids);
      fields = results.fields;
      grids = results.grids;
      setFilds(fields,grids,form)
    }else{
      const results = handleChildsort(row,grids,griddata);
      grids = results.grids;
      setFilds(fields,grids,form)
    }
  }


  handleDropitem = (data,grid)=>{
    const {grids ,form } = this.props;
    const index = grids.indexOf(grid);
    const gridFields = grids[index].fields;
    gridFields[grids[index]['fields'].indexOf(data)].x = null;
    gridFields[grids[index]['fields'].indexOf(data)].y = null;
    form.setFieldsValue({
      [`grids.${index}.fields`]: gridFields
    })
  }


  makeControls = () => {
    const { fields, grids ,onDrag,onCancel,
      makeMask,onMove,EleIndex,EleMovey,
      EleCurrenIndex,
      onSelected,
      dataindex,
      currentDirection} = this.props;
    const {formdata} = this.state;
    return [...formdata.map((item,index)=>{
       return <Control  id="boardtag"
                        key={index}
                        itemDrop={this.handleDropitem}
                        makeMask={makeMask}
                        onDrag={onDrag}
                        onCancel={onCancel}
                        index={index}
                        data={item}
                        dataindex={dataindex}
                        board={this.board}
                        addLine={this.handleAddLine}
                        deleteLine={this.handleDeleteLine}
                        onMove={onMove}
                        EleIndex={EleIndex}
                        EleMovey={EleMovey}
                        EleCurrenIndex={EleCurrenIndex}
                        currentDirection={currentDirection}
                        onSelected={onSelected}
                      />

   })]
  }

  makechildControls = () =>{
    const {gridfields,onDrag,onCancel,
      makeMask,EleIndex,
      EleMovey,EleCurrenIndex,
      dataindex,
      currentDirection,
      } = this.props;
    const {formdata} = this.state;
    return [...formdata.map((item,index)=>{
      return <Control  id={`boardchildtag${gridfields.key}`}
                            griddata={gridfields}
                           key={index}
                           child="child"
                           itemDrop={this.handleDropitem}
                           formdata={formdata}
                           makeMask={makeMask}
                           onDrag={onDrag}
                           onCancel={onCancel}
                           index={index}
                           data={item}
                           board={this.board}
                           dataindex={dataindex}
                           EleIndex={EleIndex}
                           EleMovey={EleMovey}
                           EleCurrenIndex={EleCurrenIndex}
                           currentDirection={currentDirection}
                          />
    })]
  }

  render() {
    const {gridfields,id} = this.props;
    return (
       <div id={id?id:null} className={styles.board}>
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
