import React, { PureComponent } from 'react';
import { Map } from 'react-amap';
import { Input } from 'antd';
import SP from './searchAndposition';

/* 需要输入address lng lat
   输出 address lng lat
*/
const { TextArea } = Input;
export default class extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.mapPlugins = ['ToolBar'];
    this.state = {
      address: value.address || '',
      position: {
        longitude: value.lng || 120,
        latitude: value.lat || 30,
      },
    };
  }

  handlePosition = (position) => {
    const value = {
      address: position.address,
      position: { longitude: position.position.lng, latitude: position.position.lat },
    };
    const completeValue = {
      address: position.address,
      lng: position.position.lng,
      lat: position.position.lat,
    };
    this.setState({ ...value }, () => this.props.onChange(completeValue));
  }

  dragPosition = (position) => {
    const value = {
      address: position.address,
      position: { longitude: position.position.lng, latitude: position.position.lat },
    };
    const completeValue = {
      address: position.address,
      lng: position.position.lng,
      lat: position.position.lat,
    };
    this.setState({ ...value }, () => this.props.onChange(completeValue));
  }

  render() {
    const loadingStyle = {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    const Loading = <div style={loadingStyle}>Loading Map...</div>;
    const { position, address } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: '100%', height: '500px', position: 'relative' }} >
          <Map
            amapkey="9a54ee2044c8fdd03b3d953d4ace2b4d"
            zoom={15}
            loading={Loading}
            center={position}
            plugins={this.mapPlugins}
            useAMapUI
          >
            <SP
              value={{ ...position, address }}
              handlePosition={this.handlePosition}
              dragPosition={this.dragPosition}
            />
          </Map>
        </div>
        <div style={{ height: 20 }} />
        定位地址：<TextArea autosize={{ minRows: 2, maxRows: 6 }} value={this.state.address} />
      </React.Fragment>
    );
  }
}
