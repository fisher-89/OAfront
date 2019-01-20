import React, { Component } from 'react';
import { Tag } from 'antd';
import styles from './mobile_template.less';
import Textinput from "./board/input_view";
import {getTagpotision} from "./util";


class DraggingFieldTag extends Component {
  constructor(props){
    super(props);
    this.state = {
        offset: { x: 0, y: 0 },
        onTemplate: false,
        data: null,
        mouseY:null,//记录上次鼠标位置y轴
        tagHeight:44,
        scrollMove:null
    }
  }

  componentWillReceiveProps(nextProps){
    const {data} = nextProps;
    if(data.type==='file'){
      this.setState({
        tagHeight:77
      })
    }
    if(data.type===undefined){
      this.setState({
        tagHeight:40
      })
    }
  }
  componentWillMount() {
    const {data} = this.props;
    this.state.data = data;
    document.addEventListener('mousemove', this.dragField);
    document.addEventListener('touchmove', this.dragField);
    document.addEventListener('mouseup', this.loosenDrag);
    document.addEventListener('touchend', this.loosenDrag);
  }
  componentWillUnmount(){
    clearInterval(this.state.scrollMove);
    document.removeEventListener('mousemove', this.dragField);
    document.removeEventListener('touchmove', this.dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('touchend', this.loosenDrag);
    }


  dragField = (e) => {
    e.preventDefault();
    let {data,grids,parentGrid,board,startPoint: { x, y },style: { top, left },offset} = this.props;
    if(data.mobile_x && typeof data.mobile_x.top==='number'){
      top = data.mobile_x.top;
      left = data.mobile_x.left;
    }
    this.clientSite = e.type === 'touchmove' ? e.touches[0] : e;
    const {clientX,clientY} = this.clientSite;
    let offsetX = clientX - x;
    let offsetY = clientY - y;
    let onTemplate = false;
    offsetX = offset?offsetX+offset.offX:offsetX;
    offsetY = offset?offsetY+offset.offY:offsetY;
    const Board = document.querySelector("#board").getBoundingClientRect() || null;
    let Boardchild = null;
    if(parentGrid!==null){
      Boardchild = document.querySelector(`#boardChild${grids[parentGrid].key}`) && document.querySelector(`#boardChild${grids[parentGrid].key}`).getBoundingClientRect();
    }
    if(parentGrid !==null){
      if( Boardchild && clientX>Boardchild.left && clientX<Boardchild.right && clientY>Boardchild.top-40 && clientY<Boardchild.bottom+40){
        this.handleScroll(clientY,Boardchild,`#boardChild${grids[parentGrid].key}`);
        typeof data.mobile_y === "string" ?this.childanimateDragsort(top,left):this.childanimateDragIn(top,left);//data.y==null 组件移进动画
        onTemplate = true;
        offsetX = Boardchild.left - left;
        offsetY = clientY - top -20;
      }else{
        this.state.mouseY!==null?this.childanimateDragOut():null;//组件移出动画
      }
    }else if(parentGrid===null){
      if(clientX > Board.left && clientX < Board.right && clientY > Board.top - 40 && clientY < Board.bottom + 40) {
        this.handleScroll(clientY,Board,"#board");//上、下拉滚动
        typeof data.mobile_y === "string" ?this.animateDragsort(top,left):this.animateDragIn(top,left);//data.y==null 组件移进动画
        onTemplate = true;
        offsetX = Board.left - left;
        offsetY = clientY - top - 20;
      }else{
        this.state.mouseY?this.animateDragOut():null;//组件移出动画
      }
    }
    this.setState({
      offset: { x: offsetX, y: offsetY },
      onTemplate: onTemplate
    })
  }

  loosenDrag = (e) => {
    e.preventDefault();
    const { onCancel, onConfirm } = this.props;
    const { onTemplate, data ,offset: { x, y }} = this.state;
    document.removeEventListener('mousemove', this.dragField);
    document.removeEventListener('touchmove', this.dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('touchend', this.loosenDrag);
    if (onTemplate) {
      onConfirm(data);
    } else {
      onCancel(data,x,y);
    }
  }

  animateDragIn = (top,left)=>{
    const {formdata,onMove,data} = this.props;
    const {clientX,clientY}  = this.clientSite;
    if (formdata.length === 0){
      this.state.data = {...data, mobile_x: {top, left}, mobile_y: 0};
    }else{
      const tag = getTagpotision("#boardtag", clientX, clientY);
      if (tag) {
        let direct = -1;//默认-1 从外入内
        if (this.state.mouseY && clientY > this.state.mouseY) {
          direct = 1;//方向向下
          this.state.data = {...data, mobile_x: {top, left}, mobile_y: parseInt(tag.index) + 1};
          onMove(tag.index, this.state.tagHeight, direct, null, formdata.length);
        } else if (this.state.mouseY && clientY < this.state.mouseY) {
          direct = 0;//方向向上
          this.state.data = {...data, mobile_x: {top, left}, mobile_y: tag.index};
          onMove(tag.index, this.state.tagHeight, direct, null, formdata.length);
        } else {
          this.state.data = {...data, mobile_x: {top, left}, mobile_y: tag.index};
          onMove(tag.index, this.state.tagHeight, direct, null, formdata.length); //arguments:1不移动的位置、高度、所移动的index、移动方向1向下 0 向上
        }
        this.state.mouseY = clientY;
      } else if (tag === null) {
        this.state.data = {...data, mobile_x: {top, left}, mobile_y: formdata.length};
        onMove(formdata.length, this.state.tagHeight, 1);
      }
    }
  }

  childanimateDragIn = (top,left)=>{
    const {data,formdata,onChildMove,grids,parentGrid} = this.props;
    const {clientX,clientY} = this.clientSite;
    if(formdata.length===0){
      this.state.data = { ...data, mobile_x: {top,left}, mobile_y:0};
    }
    if(formdata.length!==0){
      const tag = getTagpotision(`#boardchildtag${grids[parentGrid].key}`,clientX,clientY);
      if(tag){
        let direct = -1;//默认-1
        if(this.state.mouseY && clientY > this.state.mouseY){
          direct = 1;//方向向下
          this.state.data = { ...data, mobile_x: {top,left}, mobile_y: tag.index};
          onChildMove(tag.index,this.state.tagHeight,direct,null,formdata.length);
        }else if(this.state.mouseY && clientY < this.state.mouseY){
          direct = 0;//方向向上
          this.state.data = { ...data, mobile_x: {top,left}, mobile_y: tag.index};
          onChildMove(tag.index,this.state.tagHeight,direct,null,formdata.length);
        }else{
          this.state.data = { ...data, mobile_x: {top,left}, mobile_y: tag.index };
          onChildMove(tag.index,this.state.tagHeight,direct,null,formdata.length); 
        }
        this.state.mouseY = clientY;
      }else if(tag===null){
        this.state.data = { ...data, mobile_x: {top,left}, mobile_y:formdata.length};
        onChildMove(formdata.length,this.state.tagHeight,1);
      }
    }
  }
  animateDragOut =()=> {
    const {controSelf, onMove, formdata} = this.props;
    if (controSelf) {
      const currentIndex = controSelf.attributes["index"].nodeValue;
      onMove(formdata.length, this.state.tagHeight, 1, currentIndex, currentIndex);
    } else {
      this.state.mouseY = null;
      onMove(formdata.length, this.state.tagHeight, -1, null, formdata.length);//初始化位置，由内出外
    }
  }

  childanimateDragOut = ()=>{
    const {controSelf,onChildMove,formdata} = this.props;
    if(controSelf){
      const currentIndex = controSelf.attributes["index"].nodeValue;
      onChildMove(formdata.length,this.state.tagHeight,1,currentIndex,currentIndex);
    }else{
      this.state.mouseY = null;
      onChildMove(formdata.length,this.state.tagHeight,-1,null,formdata.length);//初始化位置，由内出外
    }
  }

  animateDragsort =(top,left)=>{
    const {onMove,data,controSelf,formdata} = this.props;
    const {clientX, clientY} = this.clientSite;
    const height = controSelf.attributes["height"].nodeValue;
    const currentIndex = controSelf.attributes["index"].nodeValue;
    const tag = getTagpotision("#boardtag", clientX, clientY);
    if (tag) {
      let direct = -1;
      if (this.state.mouseY && clientY > this.state.mouseY) {
        direct = 1;//方向向下
        this.state.data = {...data, mobile_x: {top, left}, mobile_y: parseInt(tag.index) + 1};
        onMove(tag.index, this.state.tagHeight, direct, currentIndex, currentIndex);//arguments:1不移动的位置、高度、所移动的index、移动方向1向下 0 向上
      } else if (this.state.mouseY && clientY < this.state.mouseY) {
        direct = 0;//方向向上
        this.state.data = {...data, mobile_x: {top, left}, mobile_y: tag.index};
        onMove(tag.index, this.state.tagHeight, direct, currentIndex, currentIndex);//arguments:1不移动的位置、高度、所移动的index、移动方向1向下 0 向上
      }
      this.state.mouseY = clientY;
    } else if (tag === null) {
      this.state.data = {...data, mobile_x: {top, left}, mobile_y: formdata.length};
      onMove(formdata.length, this.state.tagHeight, 1, currentIndex, currentIndex);
    }
  }

  childanimateDragsort =(top,left)=>{
    const {onChildMove,data,controSelf,grids,parentGrid,formdata} =this.props;
    const {clientX, clientY} = this.clientSite;
    const height = controSelf.attributes["height"].nodeValue;
    const currentIndex = controSelf.attributes["index"].nodeValue;
    const tag = getTagpotision(`#boardchildtag${grids[parentGrid].key}`,clientX,clientY);
    if (tag) {
      let direct = -1;
      if (this.state.mouseY && clientY > this.state.mouseY) {
        direct = 1;//方向向下
        this.state.data = {...data, mobile_x: {top, left}, mobile_y: parseInt(tag.index) + 1};
        onChildMove(tag.index, this.state.tagHeight, direct, currentIndex, currentIndex);//arguments:1不移动的位置、高度、所移动的index、移动方向1向下 0 向上
      } else if (this.state.mouseY && clientY < this.state.mouseY) {
        direct = 0;//方向向上
        this.state.data = {...data, mobile_x: {top, left}, mobile_y: tag.index};
        onChildMove(tag.index, this.state.tagHeight, direct, currentIndex, currentIndex);//arguments:1不移动的位置、高度、所移动的index、移动方向1向下 0 向上
      }
      this.state.mouseY = clientY;
    } else if (tag === null) {
      this.state.data = {...data, mobile_x: {top, left}, mobile_y: formdata.length};
      onChildMove(formdata.length, this.state.tagHeight, 1, currentIndex, currentIndex);
    }
  }
  /*
  * 上拉滚动/下拉滚动
  * */
  handleScroll =(clientY,Board,Selector)=>{
    if (clientY < Board.top && clientY > Board.top-40) {
      const scrollspeed = (Board.top - clientY)/10;
      clearInterval(this.state.scrollMove);
      this.state.scrollMove = setInterval(() => {
        document.querySelector(Selector).scrollTop -= scrollspeed;
      }, 1000 / 60)
    } else if (clientY > Board.bottom && clientY < Board.bottom + 40) {
      const scrollspeed = (clientY - Board.bottom)/10;
      clearInterval(this.state.scrollMove);
      this.state.scrollMove = setInterval(() => {
        document.querySelector(Selector).scrollTop += scrollspeed ;
      }, 1000 / 60)
    } else {
      clearInterval(this.state.scrollMove);
    }
  }
  setHeight = (data)=>{
    this.state.tagHeight = data
  }


  render(){
    const { style: { top, left } } = this.props;
    const { offset: { x, y }, onTemplate, data } = this.state;
    return (<div style={{ top, left, transform: `translate(${x}px,${y}px)` }} className={styles.dragShadow}>
        {
          onTemplate ?
            (
              <Textinput setHeight={this.setHeight} data={data}/>
            ) :
            (<Tag color="blue">{data.name}</Tag>)
        }
      </div>
    )
  }
}

export default DraggingFieldTag;
