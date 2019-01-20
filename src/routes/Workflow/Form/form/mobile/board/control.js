import React, { Component } from 'react';
import Textinput from "./input_view";
import FocusLine from "./line_focus";
import style from "../mobile_template.less";

export default class Control extends Component {

  state = {
    visiable:false,
    height:44,
    tagColor:null,
    y:null,
    eleVisible:'visible',
    ref:null,
    style:{}
  }
  componentWillReceiveProps(nextProps) {
    const {EleCurrenIndex, EleIndex, EleMovey, index, dataindex,currentDirection} = nextProps;
    if (dataindex && parseInt(dataindex) === parseInt(index)) {
      this.setState({
        eleVisible: "hidden"
      })
    } else {
      this.setState({
        eleVisible: "visible"
      })
    }
    if (EleCurrenIndex === null) {
      if (EleIndex < dataindex && index >=EleIndex && index < dataindex && currentDirection===-1) {//由外入内，由内出外
          this.setState({
            y: EleMovey
          })
        }else if(EleIndex <= dataindex && index < EleIndex && index < dataindex && currentDirection===-1){
            this.setState({
              y:0
            })
        }else if(EleIndex < dataindex && index >=EleIndex && index < dataindex && currentDirection===0) {//方向向上
            this.setState({
              y: EleMovey
            })
        }else if(EleIndex <= dataindex && index < EleIndex && index < dataindex && currentDirection===0){
          this.setState({
              y:0
            })
        }else if(EleIndex < dataindex && index >EleIndex && index < dataindex && currentDirection===1) {//方向向下
            this.setState({
              y: EleMovey
            })
        }else if(EleIndex < dataindex && index <= EleIndex && index < dataindex && currentDirection ===1){
            this.setState({
              y:0
            })
        }else if(dataindex===null){
            this.setState({
              y:null
            })
        }
    }else {
      if (EleIndex > dataindex && index <= EleIndex &&  index > dataindex && currentDirection===1) {
        this.setState({
          y: -EleMovey
        })
      }else if(EleIndex > dataindex && index <= dataindex && currentDirection===1){
        this.setState({
          y:0
        })
      }else if(EleIndex > dataindex && index > EleIndex && currentDirection===1){
        this.setState({
          y:0
        })
      }else if(EleIndex < dataindex && index <= EleIndex && currentDirection === 1){
        this.setState({
          y:0
        })
      }
      else if (EleIndex < dataindex && index > dataindex  && currentDirection===0) {
        this.setState({
          y: 0
        })
      }else if(EleIndex < dataindex && index < EleIndex && currentDirection ===0){
         this.setState({
          y: 0
         })
      }else if(EleIndex >= dataindex && index >=EleIndex  && currentDirection===0){
        this.setState({
          y:0
        })
      }else if(EleIndex < dataindex && index < dataindex && index >=EleIndex && currentDirection===0){
          this.setState({
            y: EleMovey
          })
      }
    }
  }
  componentWillUnmount(){
    document.removeEventListener("mousedown",this.mouseDown);
    document.removeEventListener("mousemove",this.mouseMove);
  }

  mouseDown = (e) =>{
    e.preventDefault();
    if(e.type === "mousedown" && e.button !==0)return false;
    this.target = e.target;
    this.mouseSite = this.mouseClientXY(e);
    this.target.addEventListener("mouseup",this.handleSelect);
    document.addEventListener("mousemove",this.mouseMove);
    this.dragTimeout = setTimeout(() => {
      this.handleDragstart();
    }, 150);
  }

  mouseMove = (e)=>{
    e.preventDefault();
    const clientX  = e.clientX;
    const clientY  = e.clientY;
    if(Math.abs(clientX - this.mouseSite.x)>10 || Math.abs(clientY - this.mouseSite.Y)>10 ){
      this.target.addEventListener("mouseup",this.handleSelect);
      document.addEventListener("mousemove",this.mouseMove);
      this.handleDragcancel();
      this.handleDragstart();
    }
  }

  handleDragstart = ()=>{
    this.target.removeEventListener("mouseup",this.handleSelect);
    document.removeEventListener("mousemove",this.mouseMove);
    const {data,griddata,onDrag} = this.props;
    const {x ,y} = this.mouseSite;
    console.log(this.target.getBoundingClientRect(),data.mobile_x,griddata,data);
    const {top,left} = griddata ?this.target.getBoundingClientRect():data.mobile_x;
    // const {top,left} = this.target.getBoundingClientRect();
    const offX = x-left-10;
    const offY = y-top-10;
    const extraparams = {
      offset:{offX,offY},
      controSelf:this.state.ref,
    }
    onDrag(data,{x,y},{left,top},griddata,extraparams);
  }
  handleDragcancel = () =>{
    clearTimeout(this.dragTimeout);
  }

  handleSelect = ()=>{
    const {onSelected,data} = this.props;
    this.handleDragcancel();
    this.target.removeEventListener("mouseup",this.handleSelect);
    document.removeEventListener("mousemove",this.mouseMove);
    if("fields" in data){
      onSelected(data);//选择时调用函数,动态切换tabs
    }
    return void 333;
  }

  mouseClientXY = (e) => {
    let x;
    let y;
    x = e.clientX;
    y = e.clientY;
    if (e.type === 'touchstart') {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    return { x, y };
  }

  mouseEnter = (e)=>{
    e.preventDefault();
    this.setState({
      visiable:true
    })
  }

  mouseLeave = (e)=>{
    e.preventDefault();
    this.setState({
      visiable:false
    })
  }

  setHeight = (data)=>{
    this.setState({
      height:data
    })
  }

  render() {
    const { data,id, index} = this.props;
    const {height,visiable,y,eleVisible,style} = this.state;
    let styletransition = y!==null?{transitionDuration:'250ms',transform: `translate(0px,${y}px)`}:null;
    return (
       <div id={id}
            className={style.boardtag}
            index={index}
            height={height}
            ref={(instance)=>{this.state.ref=instance}}
            style={{...styletransition,visibility:eleVisible,...style}}
            onMouseDown = {this.mouseDown}>
           <Textinput
              data={data}
              setHeight={this.setHeight}
           />
       </div>
    );
  }
}
