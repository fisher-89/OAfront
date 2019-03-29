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
      zoom: 15,
      address: value.address || '',
      center: {
        longitude: value.lng || 120,
        latitude: value.lat || 30,
      },
    };
  }

  handleClear = () => {
    const position = {
      address: '',
      lng: null,
      lat: null,
    };
    this.setState({
      zoom: 5,
      address: '',
      center: {
        longitude: 110.892028,
        latitude: 31.802344,
      },
    }, () => this.props.onChange(position));
  }

  dragPosition = (position) => {
    const { lng, lat } = position;
    const value = {
      address: position.address,
      position: { longitude: lng, latitude: lat },
    };
    this.setState({ ...value }, () => this.props.onChange(position));
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
    const { center, address } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: '100%', height: '500px', position: 'relative' }} >
          <Map
            amapkey="9a54ee2044c8fdd03b3d953d4ace2b4d"
            zoom={this.state.zoom}
            loading={Loading}
            center={center}
            plugins={this.mapPlugins}
            useAMapUI
          >
            <SP
              value={{ ...center, address }}
              handleClear={this.handleClear}
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
