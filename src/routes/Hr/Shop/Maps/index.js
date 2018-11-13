import React, { PureComponent } from 'react';
import { Map } from 'react-amap';
import SP from './searchAndposition';

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
    console.log(this.state);
  }

  handlePosition = (position) => {
    const value = {
      address: position.address,
      position: { longitude: position.position.lng, latitude: position.position.lat },
    };
    this.setState({ ...value });
  }

  dragPosition = (position) => {
    this.setState({ position: { longitude: position.lng, latitude: position.lat } });
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
    const { position } = this.state;
    return (
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
            value={this.state}
            handlePosition={this.handlePosition}
            dragPosition={this.dragPosition}
          />
        </Map>
      </div>
    );
  }
}
