import React, { PureComponent } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from '../mobile_template.less';


class DraggingFieldTag extends PureComponent {

  contextMenu = () => {
    const { addLine, deleteLine,index ,data,griddata} = this.props;
    return (
      <Menu>
        {/*<Menu.Item*/}
          {/*onClick={() => {*/}
            {/*document.addEventListener('mousemove', this.handleMouseMove);*/}
            {/*document.addEventListener('touchmove', this.handleMouseMove);*/}
            {/*griddata?addLine(index,griddata):addLine(index);*/}
          {/*}}*/}
        {/*>*/}
          {/*在上方插入行*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item*/}
          {/*onClick={() => {*/}
            {/*document.addEventListener('mousemove', this.handleMouseMove);*/}
            {/*document.addEventListener('touchmove', this.handleMouseMove);*/}
            {/*griddata?addLine(index+1,griddata):addLine(index+1);*/}
          {/*}}*/}
        {/*>*/}
          {/*在下方插入行*/}
        {/*</Menu.Item>*/}
        <Menu.Item
          onClick={() => {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('touchmove', this.handleMouseMove);
            console.log("addLine",addLine,index,this.props);
            if(griddata){
              data?deleteLine(data,griddata):deleteLine(index,griddata);
            }else{
              data?deleteLine(data):deleteLine(index);
            }

          }}
        >
          删除
        </Menu.Item>
      </Menu>
    );
  }

  handleContextMenuToggle = (visible) => {
    if (visible) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('touchmove', this.handleMouseMove);
    } else {
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('touchmove', this.handleMouseMove);
    }
  }

  render() {
    const {height,index} = this.props;
    return <Dropdown
          trigger={['contextMenu']}
          onVisibleChange={this.handleContextMenuToggle}
          overlay={this.contextMenu()}
        >
          <div
            className={styles.lineFocus}
            onMouseEnter={this.handleMouseEnter}
          >
            {/*<div className={styles.leftControl} style={{height:`${height}px`,lineHeight:`${height}px`}}>{index+1}</div>*/}
            <div className={styles.boxShadow} style={{height:"100%"}}/>
            {/*<div className={styles.rightControl} style={{height:`${height}px`,lineHeight:`${height}px`}}>{index+1}</div>*/}
          </div>
        </Dropdown>
  }
}

export default DraggingFieldTag;
